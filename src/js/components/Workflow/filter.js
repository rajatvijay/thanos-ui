import React, { Component } from "react";
import { Select, Spin, Layout, Icon, Tooltip, Menu } from "antd";
import debounce from "lodash.debounce";
import { workflowFiltersActions } from "../../actions";
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

class WorkflowFilter extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  handleChange = value => {
    this.setState({ value });

    console.log(value, this);

    if (value === []) {
      let fType = value[0].key.split("-")[1];
      let fId = value[0].key.split("-")[0];
      let payload = { filterType: fType, filterValue: [] };

      // if(fType === "status"){
      //   let payload ={filterType: fType, filterValue: [] }
      // } else if (fType === "business") {
      //   let payload ={filterType: fType, filterValue: [] }
      // } else if (fType === "region"){
      //   let payload ={filterType: fType, filterValue: [] }
      // }

      _.map(value, function(f) {
        let filterId = f.key.split("-")[0];
        payload.filterValue.push(filterId);
      });

      console.log("payload--------------------------");
      this.props.dispatch(workflowFiltersActions.setFilters(payload));
    }
  };

  render() {
    const { value } = this.state;
    //console.log(this.props)
    var that = this;
    return (
      <div>
        <div>
          <label>{this.props.placeholder}</label>
        </div>
        <Select
          mode="multiple"
          label={this.props.placeholder}
          value={value}
          placeholder={this.props.placeholder}
          onChange={this.handleChange}
          style={{ width: "100%" }}
          allowClear={true}
          labelInValue={true}
        >
          {_.map(this.props.childeren, function(c, index) {
            return (
              <Option
                prop={c}
                title={c.value}
                key={c.id + "-" + that.props.placeholder}
              >
                {c.label}
              </Option>
            );
          })}
        </Select>
      </div>
    );
  }
}

class FilterSidebar extends Component {
  constructor(props) {
    super(props);
  }

  componentDidMount = () => {
    this.props.dispatch(workflowFiltersActions.getStatusData());
  };

  workflowKindList = workflowKind => {
    return _.map(workflowKind, function(i, index) {
      return (
        <Menu.Item key={i.tag}>
          <i className="material-icons icon">
            {i.icon ? i.icon : "library_books"}
          </i>
          {i.name}
        </Menu.Item>
      );
    });
  };

  onFilterSelected = value => {
    this.props.dispatch(
      workflowFiltersActions.setFilters({
        filterType: "kind",
        filterValue: [value.key]
      })
    );
  };

  render = () => {
    let that = this,
      workflowKind = null,
      workflowKindList = null,
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

    if (this.props.workflowKind) {
      let workflowKind = this.props.workflowKind.workflowKind;
      workflowKindList = this.workflowKindList(workflowKind);
    }

    return (
      <Sider
        width={250}
        style={{ overflow: "auto", height: "100vh", position: "fixed" }}
        className="aux-nav aux-nav-filter bg-primary-light"
      >
        <h5 className="aux-item aux-lead">Filters</h5>
        <div className="filter-section section-kind">
          <Menu
            onClick={this.onFilterSelected.bind(this)}
            style={{
              width: "100%",
              height: "vh100",
              overflowX: "hidden",
              background: "transparent"
            }}
            defaultSelectedKeys={["1"]}
            mode="inline"
          >
            {workflowKindList}
          </Menu>
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
  const { workflowKind, workflowFilterType } = state;
  return {
    workflowKind,
    workflowFilterType
  };
}

export default connect(mapStateToProps)(FilterSidebar);
