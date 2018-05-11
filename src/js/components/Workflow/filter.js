import React, { Component } from "react";
import { Select, Spin, Layout, Icon, Tooltip, Menu } from "antd";
import debounce from "lodash.debounce";
import {
  workflowFiltersActions,
  workflowActions,
  workflowKindActions
} from "../../actions";
import { connect } from "react-redux";
import _ from "lodash";

//const filter = {};
const SubMenu = Menu.SubMenu;
const MenuItemGroup = Menu.ItemGroup;
const { Sider } = Layout;
const Option = Select.Option;

const filterTypeSelect = [
  // {
  //   filterType: "Status",
  //   results: [
  //   { filterType: "status", label: "Archive" , value:"archive"},
  //   { filterType: "status", label: "Complete", value:"complete" },
  //   { filterType: "status", label: "On hold" , value:"onHold"}]
  // },

  {
    filterType: "Business",
    results: [
      { id: 1, filterType: "bu", value: "main", label: "Main Group" },
      { id: 2, filterType: "bu", value: "ae_uae_ou", label: "AE UAE OU" },
      { id: 3, filterType: "bu", value: "AO_AGO_OU", label: "AO AGO OU" },
      { id: 4, filterType: "bu", value: "AO_ANG_OU", label: "AO ANG OU" },
      {
        id: 5,
        filterType: "bu",
        value: "AR_ARS_USD_OU",
        label: "AR ARS USD OU"
      },
      { id: 6, filterType: "bu", value: "AT_LIX_OU", label: "AT LIX OU" },
      { id: 7, filterType: "bu", value: "AU_RTA_OU", label: "AU RTA OU" }
    ]
  },
  {
    filterType: "region",
    results: [
      { id: 1, filterType: "region", value: "EMEA", label: "EMEA" },
      { id: 2, filterType: "region", value: "LATAM", label: "LATAM" },
      { id: 3, filterType: "region", value: "APAC", label: "APAC" },
      { id: 4, filterType: "region", value: "US", label: "US" }
    ]
  }
];

//REACT COMPONENT FOR ANTD SELECT TYPE FILTERS SO THAT STATE FOR INDIVISUAL FILTERS ARE HANDLED SMOOTHLY.
class WorkflowFilter extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  //SELECT TYPE FILTER DISPATCHED HERE
  handleChange = value => {
    this.setState({ value });
    let fType = this.props.placeholder.toLowerCase();
    let payload = { filterType: fType, filterValue: [] };

    if (value !== undefined && value.length !== 0) {
      if (Array.isArray(value)) {
        _.map(value, function(f) {
          payload.filterValue.push(f.key);
        });
      } else {
        payload.filterValue.push(value.key);
      }
    } else {
      payload = { filterType: fType, filterValue: [] };
    }

    this.props.dispatch(workflowFiltersActions.setFilters(payload));
  };

  render() {
    const { value } = this.state;
    var that = this;
    return (
      <div>
        <div>
          <label>{this.props.placeholder}</label>
        </div>
        <Select
          mode="single"
          label={this.props.placeholder}
          value={value}
          placeholder={this.props.placeholder}
          onChange={this.handleChange}
          onDeselect={this.onDeselect}
          onSelect={this.onSelect}
          style={{ width: "100%" }}
          allowClear={true}
          labelInValue={true}
        >
          {_.map(this.props.childeren, function(c, index) {
            return (
              <Option prop={c} title={c.value} key={c.id}>
                {c.label}
              </Option>
            );
          })}
        </Select>
      </div>
    );
  }
}

//WORKFLOW KIND FILTER COMPONENT
class WorkflowKindFilter extends Component {
  constructor(props) {
    super();
    this.state = {
      selected: null
    };
  }

  componentDidMount = () => {
    this.props.dispatch(workflowFiltersActions.getStatusData());
  };

  workflowKindList = workflowKind => {
    let that = this;
    let { mouserover, selected } = this.state;
    return _.map(workflowKind, function(i, index) {
      return (
        <li
          className={
            "ant-menu-item " +
            (that.state.selected === i.id ? "ant-menu-item-selected " : "")
          }
          key={i.id}
          kind={i.id}
          onClick={that.onFilterSelected.bind(this, i)}
          style={{ paddingLeft: "24px" }}
        >
          <i className="material-icons icon">
            {i.icon ? i.icon : "library_books"}
          </i>
          {i.name}
        </li>
      );
    });
  };
  onFilterSelected = value => {
    let id = "";
    this.state.selected != value.id ? (id = value.id) : (id = "");
    this.setState({ selected: id });
    this.props.dispatch(
      workflowFiltersActions.setFilters({
        filterType: "kind",
        filterValue: [id],
        meta: { value }
      })
    );

    //console.log(this.props)
    //this.fetchGroupData(value.tag)
  };

  fetchGroupData = tag => {
    this.props.dispatch(workflowKindActions.getCount(tag));
  };

  render = () => {
    let that = this,
      workflowKind = null,
      workflowKindList = null,
      workflowFilterType = this.props.workflowFilterType;

    if (this.props.workflowKind) {
      let workflowKind = this.props.workflowKind.workflowKind;
      workflowKindList = this.workflowKindList(workflowKind);
    }

    return (
      <ul
        className="ant-menu ant-menu-light ant-menu-root ant-menu-inline"
        style={{
          width: "100%",
          height: "vh100",
          overflowX: "hidden",
          background: "transparent"
        }}
      >
        {workflowKindList}
      </ul>
    );
  };
}

class FilterSidebar extends Component {
  constructor(props) {
    super(props);
    // console.log('this.props filter props')
    // console.log(this.props)
  }

  componentWillReceiveProps = nextProps => {
    //reload workflow list if the filters change.
    if (this.props.workflowFilters !== nextProps.workflowFilters) {
      this.props.dispatch(workflowActions.getAll());
    }
  };

  render = () => {
    let that = this,
      workflowFilterType = this.props.workflowFilterType,
      filterList = filterTypeSelect;

    if (
      !this.props.workflowFilterType.loading &&
      this.props.workflowFilterType.statusType
    ) {
      let sFilter = this.props.workflowFilterType.statusType;
      let statusFilter = {
        filterType: "Status",
        results: sFilter.results
      };
      if (filterList.length === 2) {
        filterList.unshift(statusFilter);
      }
    }

    return (
      <Sider
        width={250}
        style={{ overflow: "auto", height: "100vh", position: "fixed" }}
        className="aux-nav aux-nav-filter bg-primary-light"
      >
        <h5 className="aux-item aux-lead">Filters</h5>
        <div className="filter-section section-kind">
          <WorkflowKindFilter {...this.props} />
        </div>

        <div className="filter-section">
          {_.map(filterTypeSelect, function(f, index) {
            return (
              <div className="aux-item aux-lead" key={"filter-2-" + index}>
                <WorkflowFilter
                  placeholder={f.filterType}
                  childeren={f.results}
                  {...that.props}
                />
              </div>
            );
          })}
        </div>
      </Sider>
    );
  };
}

function mapStateToProps(state) {
  const { workflowKind, workflowFilterType, workflowFilters } = state;
  return {
    workflowKind,
    workflowFilterType,
    workflowFilters
  };
}

export default connect(mapStateToProps)(FilterSidebar);
