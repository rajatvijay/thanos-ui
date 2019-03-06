import React, { Component } from "react";
import {
  Button,
  Select,
  Layout,
  Input,
  Cascader,
  Form,
  Dropdown,
  Popover,
  Icon,
  Menu
} from "antd";
import { baseUrl, authHeader } from "../../_helpers";
import {
  workflowFiltersActions,
  workflowActions,
  workflowKindActions,
  createWorkflow
} from "../../actions";
import { connect } from "react-redux";
import _ from "lodash";
import { Scrollbars } from "react-custom-scrollbars";
import { WrappedAdvancedFilterForm } from "./advanced-filters.js";
//import { regionData } from "./regionData";
import { FormattedMessage, injectIntl } from "react-intl";

//const filter = {};
const { Sider } = Layout;
const Option = Select.Option;
const FormItem = Form.Item;

//REACT COMPONENT FOR ANTD SELECT TYPE FILTERS SO THAT STATE FOR INDIVISUAL FILTERS ARE HANDLED SMOOTHLY.
class WorkflowFilter extends Component {
  constructor(props) {
    super(props);
    this.state = {
      fieldOptions: [
        { label: "list empty", value: "list empty", disabled: true }
      ]
    };
  }

  // this is required as super.handleChange is not possible for react components
  _handleChange = value => {
    this.setState({ value });
    let fType = this.filterType.toLowerCase();
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

  handleChange = this._handleChange;

  getLabel = () => {
    let custom_ui_labels = this.props.config.custom_ui_labels || {};
    let label =
      this.props.intl.formatMessage({
        id: `workflowFiltersTranslated.filterLabels.${this.filterType}`
      }) || this.filterType;
    return custom_ui_labels[`filterLabels.${label}`] || label;
  };

  getPlaceHolder = () => {
    let custom_ui_labels = this.props.config.custom_ui_labels || {};
    let placeholder =
      this.props.intl.formatMessage({
        id: `workflowFiltersTranslated.filterPlaceholders.${this.filterType}`
      }) || this.filterType;
    return custom_ui_labels[`filterPlaceholders.${placeholder}`] || placeholder;
  };

  render() {
    const { value } = this.state;
    let label = this.getLabel();
    let placeholder = this.getPlaceHolder();
    return (
      <div>
        <div>
          <label>{label ? label : placeholder}</label>
        </div>
        <FormItem>
          <Select
            showSearch
            mode="single"
            label={placeholder}
            value={value}
            placeholder={placeholder}
            onChange={this.handleChange}
            //onDeselect={this.onDeselect}
            onSelect={this.onSelect}
            style={{ width: "100%" }}
            allowClear={true}
            labelInValue={true}
          >
            {_.map(this.getData(), function(c, index) {
              return (
                <Option prop={c} title={c.value} key={c.value}>
                  {c.label}
                </Option>
              );
            })}
          </Select>
        </FormItem>
      </div>
    );
  }
}

//REACT COMPONENT FOR ANTD SELECT TYPE FILTERS SO THAT STATE FOR INDIVISUAL FILTERS ARE HANDLED SMOOTHLY.
class WorkflowStatusFilter extends WorkflowFilter {
  filterType = "status";

  componentDidMount = () => {
    this.props.dispatch(workflowFiltersActions.getStatusData());
  };

  getData = () => {
    return !this.props.workflowFilterType.statusType.error
      ? _.orderBy(this.props.workflowFilterType.statusType, ["label"], ["asc"])
      : [{ value: "empty", label: "empty" }];
  };
}

//REACT COMPONENT FOR ANTD SELECT TYPE FILTERS SO THAT STATE FOR INDIVISUAL FILTERS ARE HANDLED SMOOTHLY.
class WorkflowRegionFilter extends WorkflowFilter {
  filterType = "region";

  componentDidMount = () => {
    this.props.dispatch(workflowFiltersActions.getRegionData());
  };

  getData = () => {
    return this.props.workflowFilterType.regionType.results;
  };

  handleChange = value => {
    this._handleChange(value);
    let region = value && value.key;
    this.props.dispatch(workflowFiltersActions.getBusinessUnitData(region));
  };
}

//REACT COMPONENT FOR ANTD SELECT TYPE FILTERS SO THAT STATE FOR INDIVISUAL FILTERS ARE HANDLED SMOOTHLY.
class WorkflowBUFilter extends WorkflowFilter {
  filterType = "business_unit";

  componentDidMount = () => {
    this.props.dispatch(workflowFiltersActions.getBusinessUnitData());
  };

  handleChange = value => {
    this.setState({ value });

    let payload = { filterType: "business_unit", filterValue: [] };

    if (value !== undefined && value.length !== 0) {
      payload.filterValue.push(value[value.length - 1]);
    } else {
      payload = { filterType: "business_unit", filterValue: [] };
    }

    this.props.dispatch(workflowFiltersActions.setFilters(payload));
  };

  render() {
    const { value } = this.state;
    const bd = this.props.workflowFilterType.businessType;
    const businessData = {
      loading: bd.loading,
      results: _.orderBy(bd.results, ["label"], ["asc"])
    };
    const statusData = !this.props.workflowFilterType.statusType.error
      ? _.orderBy(this.props.workflowFilterType.statusType, ["label"], ["asc"])
      : [{ value: "empty", label: "empty" }];
    let label = this.getLabel();
    let placeholder = this.getPlaceHolder();

    return (
      <div>
        <div>
          <label>{label ? label : placeholder}</label>
        </div>
        <FormItem
          hasFeedback={businessData.loading ? true : false}
          validateStatus={this.state.fetching ? "validating" : null}
          help={
            businessData.loading
              ? this.props.intl.formatMessage({
                  id: "workflowFiltersTranslated.fetchingFieldsData"
                })
              : ""
          }
        >
          <Cascader
            options={businessData.results}
            onChange={this.handleChange}
            label={placeholder}
            placeholder={placeholder}
            value={value}
            //onDeselect={this.onDeselect}
            onSelect={this.onSelect}
            style={{ width: "100%" }}
            loading={businessData.loading}
          />
        </FormItem>
      </div>
    );
  }
}

//WORKFLOW KIND FILTER COMPONENT
class WorkflowKindFilter extends Component {
  constructor() {
    super();
    this.state = {
      selected: null,
      initialLoad: true,
      value: null
    };
  }

  componentDidUpdate = pervProps => {
    if (
      this.props.workflowKind.workflowKind &&
      this.props.workflowFilters.kind.filterValue[0] &&
      this.state.initialLoad
    ) {
      this.setState({
        value: this.props.workflowFilters.kind.meta.name,
        initialLoad: false
      });
    }
  };

  handleChange = value => {
    let id = parseInt(value, 10);
    let that = this;
    this.setState({ value });
    let metaValue = _.find(this.props.workflowKind.workflowKind, item => {
      return item.id === id;
    });

    let payload = { filterType: "kind", filterValue: [id], meta: metaValue };
    this.props.dispatch(workflowFiltersActions.setFilters(payload));
    setTimeout(function() {
      that.fetchGroupData(metaValue.tag);
    }, 300);
  };

  fetchGroupData = tag => {
    this.props.dispatch(workflowKindActions.getCount(tag));
    this.props.dispatch(workflowKindActions.getAlertCount(tag));
    this.props.dispatch(workflowKindActions.getStatusCount(tag));
  };

  render = () => {
    let workflowKindList = null;
    let workflowKind = _.orderBy(
      this.props.workflowKind.workflowKind,
      ["name"],
      ["asc"]
    );
    const { value } = this.state;

    const options = workflowKind
      ? _.map(workflowKind, d => <Option key={d.id}>{d.name}</Option>)
      : [];

    return (
      <div className="aux-item aux-lead filter-title">
        <FormItem
          label={
            <FormattedMessage id="workflowFiltersTranslated.filterWorkflowType" />
          }
        >
          <Select
            mode="single"
            value={value}
            placeholder="Select Workflow Type"
            onChange={this.handleChange}
            onDeselect={this.onDeselect}
            onSelect={this.onSelect}
            style={{ width: "100%" }}
            //allowClear={true}
            //labelInValue={true}
          >
            {options}
          </Select>
        </FormItem>
      </div>
    );
  };
}

class FilterSidebar extends Component {
  constructor() {
    super();
    this.state = { showAdvFilters: false };
  }

  componentWillReceiveProps = nextProps => {
    if (this.props.workflowFilters !== nextProps.workflowFilters) {
      this.props.dispatch(workflowActions.getAll());
    }
  };

  componentDidMount = () => {
    if (!this.props.workflowKind.workflowKind) {
      this.loadWorkflowKind();
    }
  };

  loadWorkflowKind = () => {
    this.props.dispatch(workflowKindActions.getAll());
  };

  clicked = tag => {
    //dispatch
    let payload = {
      status: 1,
      kind: tag,
      name: "Draft"
    };
    this.props.dispatch(createWorkflow(payload));
  };

  toggleAdvFilters = () => {
    this.setState({ showAdvFilters: !this.state.showAdvFilters });
  };

  render = () => {
    let that = this;

    const { workflowKind } = this.props.workflowKind;

    let workflowKindFiltered = [];

    _.map(workflowKind, function(item) {
      if (!item.is_related_kind && _.includes(item.features, "add_workflow")) {
        workflowKindFiltered.push(item);
      }
    });

    //workflow Kind list

    //kind temp hide list
    const menu = (
      <Menu className="kind-menu" theme="Light">
        {_.map(workflowKindFiltered, function(item, index) {
          //////////---------------HACK---------------////////////
          //Hide users workflow kind from create button. Temporary

          let showitem = false;

          if (item.tag === "users") {
            return;
          } else if (item.tag === "entity-id") {
            return;
          } else {
            return (
              <Menu.Item key={"key-" + index} className="">
                <div
                  onClick={that.clicked.bind(this, item.tag)}
                  className="kind-item "
                >
                  {item.name}
                </div>
              </Menu.Item>
            );
          }
        })}

        {this.props.workflowKind.error ? (
          <Menu.Item key="1" className="text-primary text-medium">
            <span onClick={that.loadWorkflowKind}>
              <i className="material-icons t-14 pd-right-sm">refresh</i> Reload
            </span>
          </Menu.Item>
        ) : null}

        {_.isEmpty(this.props.workflowKind.workflowKind) ? (
          <Menu.Item key="1" className="text-grey text-medium" disabled>
            <span>
              <i className="material-icons t-14 pd-right-sm">error</i> Empty
            </span>
          </Menu.Item>
        ) : (
          ""
        )}
      </Menu>
    );

    return (
      <Sider
        width={320}
        style={{
          overflow: "auto",
          height: "100vh",
          position: "fixed",
          background: "#ebf0fa"
        }}
        className="aux-nav aux-nav-filter "
      >
        <Scrollbars autoWidth={true} autoHide={true} style={{ height: "100%" }}>
          {_.size(workflowKindFiltered) ? (
            <div>
              <div className="create-btn">
                <Dropdown
                  overlay={menu}
                  placement="bottomRight"
                  className="create-workflow-dropdown"
                >
                  <Button
                    type="primary"
                    size="large"
                    loading={this.props.workflowKind.loading}
                    className="shadow-2 btn-block btn-create"
                  >
                    <FormattedMessage id="workflowFiltersTranslated.createNewWorkflow" />
                    <Icon type="down" />
                  </Button>
                </Dropdown>
              </div>
              <div className="filter-divider" />
            </div>
          ) : null}

          <span className="aux-item aux-lead mr-bottom-lg">
            <span className="text-secondary t-14 text-medium text-uppercase">
              Filters
            </span>
          </span>
          <br />
          <br />

          <div className=" section-kind">
            {this.props.workflowKind ? (
              <WorkflowKindFilter
                workflowKind={this.props.workflowKind}
                workflowFilters={this.props.workflowFilters}
                dispatch={this.props.dispatch}
              />
            ) : null}
          </div>

          <div className="filter-section">
            <div className="aux-item aux-lead filter-title" key="filter-2-0">
              <WorkflowStatusFilter {...that.props} />
            </div>
            <div className="aux-item aux-lead filter-title" key="filter-2-1">
              <WorkflowRegionFilter {...that.props} />
            </div>
            <div className="aux-item aux-lead filter-title" key="filter-2-2">
              <WorkflowBUFilter {...that.props} />
            </div>
          </div>

          <div>
            <span
              className="aux-item aux-lead  text-anchor filter-title"
              onClick={this.toggleAdvFilters}
            >
              <label>
                <FormattedMessage id="workflowFiltersTranslated.advancedFilter" />{" "}
                <i className="material-icons t-16 text-middle">
                  {this.state.showAdvFilters
                    ? "keyboard_arrow_up "
                    : "keyboard_arrow_down  "}
                </i>
              </label>
            </span>
          </div>

          <div
            className={
              "animated " + (this.state.showAdvFilters ? "fadeIn" : "fadeOut")
            }
          >
            <div className="filter-section">
              <div className="aux-item aux-lead">
                <WrappedAdvancedFilterForm
                  {...this.props}
                  showAdvFilters={this.state.showAdvFilters}
                />
              </div>
            </div>
          </div>

          <br />
          <br />
          <br />
          <br />
          <br />
          <br />
          <br />
          <br />
          <br />
          <br />
          <br />
          <div style={{ height: "150px" }} />
        </Scrollbars>
      </Sider>
    );
  };
}

function mapStateToProps(state) {
  const {
    workflowKind,
    workflowFilterType,
    workflowFilters,
    config,
    languageSelector
  } = state;
  return {
    workflowKind,
    workflowFilterType,
    workflowFilters,
    config,
    languageSelector
  };
}

export default connect(mapStateToProps)(injectIntl(FilterSidebar));
