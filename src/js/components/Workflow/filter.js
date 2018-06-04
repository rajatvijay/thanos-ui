import React, { Component } from "react";
import {
  Button,
  Select,
  Spin,
  Layout,
  Icon,
  Tooltip,
  Menu,
  Input,
  Cascader,
  Form
} from "antd";
import debounce from "lodash.debounce";
import { baseUrl, authHeader } from "../../_helpers";
import {
  workflowFiltersActions,
  workflowActions,
  workflowKindActions
} from "../../actions";
import { connect } from "react-redux";
import _ from "lodash";
import FieldData from "../../data/fieldData";
//import { cascaderOptions } from "./cascader-dummy-data";

//const filter = {};
const SubMenu = Menu.SubMenu;
const MenuItemGroup = Menu.ItemGroup;
const { Sider } = Layout;
const Option = Select.Option;
const FormItem = Form.Item;

const filterTypeSelect = [
  {
    filterType: "Business",
    filterName: "business unit(s)",
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
    filterName: "region",
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
          <label>
            {this.props.label ? this.props.label : this.props.placeholder}
          </label>
        </div>
        <Select
          showSearch
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
          optionFilterProp="children"
          filterOption={(input, option) =>
            option.props.children.toLowerCase().indexOf(input.toLowerCase()) >=
            0
          }
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
            (that.state.selected === i.id ||
            that.props.workflowFilters.kind.filterValue[0] === i.id
              ? "ant-menu-item-selected "
              : "")
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
    this.fetchGroupData(value.tag);
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

class WorkflowAdvFilter extends Component {
  state = {
    data: [],
    value: "",
    filterBuilder: { field: null, operator: null, value: null },
    filterList: [],
    fieldOptions: null,
    advFilterErr: false
  };

  handleChange = (type, value) => {
    let fb = this.state.filterBuilder;

    switch (type) {
      case "field":
        let fieldLast = value.length - 1;

        fb.field = value[fieldLast];
        break;
      case "operator":
        fb.operator = value;
        break;
      case "fieldValue":
        fb.value = value.target.value;
        break;
    }

    this.setState({ filterBuilder: fb }, function() {});
  };

  componentDidMount = () => {
    const requestOptions = {
      method: "GET",
      headers: authHeader.get(),
      credentials: "include"
    };

    fetch(baseUrl + "fields/export-json/", requestOptions)
      .then(response => response.json())
      .then(body => {
        this.setState({ fieldOptions: body.results, fetching: false });
      });
  };

  onAddFilterItem = () => {
    let filterList = this.state.filterList;

    if (_.some(this.state.filterBuilder, _.isEmpty)) {
      this.setState({ advFilterErr: true });
    } else {
      filterList.push(this.state.filterBuilder);

      //dispatch filter code here

      this.setState({
        filterList: filterList,
        //filterBuilder: { field: null, operator: null, value: null },
        advFilterErr: false
      });
      this.props.form.resetFields();

      this.setFilter(filterList);
    }
  };

  setFilter = filterList => {
    let a = [];

    _.map(filterList, function(i) {
      let f = i.field + "__" + i.operator + "__" + i.value;
      a.push(f);
    });

    let payload = { filterType: "answer", filterValue: a };

    this.props.dispatch(workflowFiltersActions.setFilters(payload));
  };

  removeFilterItem = index => {
    let arr = this.state.filterList;
    arr.splice(index, 1);
    this.setState({ filterList: arr });
    this.setFilter(arr);
  };

  render = () => {
    let that = this;

    return (
      <Form>
        <div>
          <div className="adv-filter-list">
            {_.map(this.state.filterList, function(i, index) {
              return (
                <div
                  className="adv-filter-item"
                  key={index}
                  onClick={that.removeFilterItem.bind(that, index)}
                >
                  where <b>{i.field}</b> {i.operator} to <b>{i.value}</b>
                </div>
              );
            })}
          </div>
          <div>
            <FormItem
              hasFeedback={
                this.state.advFilterErr &&
                this.state.filterBuilder.field === null
                  ? true
                  : false
              }
              validateStatus={
                this.state.advFilterErr &&
                this.state.filterBuilder.field === null
                  ? "error"
                  : ""
              }
            >
              <Cascader
                options={this.state.fieldOptions}
                onChange={this.handleChange.bind(this, "field")}
                placeholder="Please select field"
              />
            </FormItem>

            <FormItem
              hasFeedback={
                this.state.advFilterErr &&
                this.state.filterBuilder.operator === null
                  ? true
                  : false
              }
              validateStatus={
                this.state.advFilterErr &&
                this.state.filterBuilder.operator === null
                  ? "error"
                  : ""
              }
            >
              <Select
                placeholder="select operator"
                style={{ width: "100%" }}
                onChange={this.handleChange.bind(this, "operator")}
              >
                <Option value="eq">Equal</Option>
                <Option value="not_eq">Not equal</Option>
                <Option value="is_set">Has value</Option>
                <Option value="contains">Contains</Option>
                <Option value="not_contains">Does not contain</Option>
              </Select>
            </FormItem>

            <FormItem
              hasFeedback={
                this.state.advFilterErr &&
                this.state.filterBuilder.value === null
                  ? true
                  : false
              }
              validateStatus={
                this.state.advFilterErr &&
                this.state.filterBuilder.value === null
                  ? "error"
                  : ""
              }
            >
              <Input
                placeholder="Input value"
                onChange={this.handleChange.bind(this, "fieldValue")}
              />
            </FormItem>
          </div>

          <Button
            type="primary"
            size="default"
            style={{ width: "100%" }}
            onClick={this.onAddFilterItem}
          >
            Add Filter
          </Button>
        </div>
      </Form>
    );
  };
}

class FilterSidebar extends Component {
  constructor(props) {
    super(props);
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
        <h5 className="aux-item aux-lead">Filters </h5>

        <div className="filter-section section-kind">
          <WorkflowKindFilter {...this.props} />
        </div>

        <div className="filter-section">
          {_.map(filterTypeSelect, function(f, index) {
            return (
              <div className="aux-item aux-lead" key={"filter-2-" + index}>
                <WorkflowFilter
                  label={f.filterName}
                  placeholder={f.filterType}
                  childeren={f.results}
                  {...that.props}
                />
              </div>
            );
          })}
        </div>

        <div className="filter-section">
          <h5 className="aux-item aux-lead">Advanced filter</h5>
          <div className="aux-item aux-lead">
            <WrappedAdvancedFilterForm {...this.props} />
          </div>
        </div>
        <br />
        <br />
        <br />
        <br />
        <br />
        <br />
        <br />
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

const WrappedAdvancedFilterForm = Form.create()(WorkflowAdvFilter);

export default connect(mapStateToProps)(FilterSidebar);
