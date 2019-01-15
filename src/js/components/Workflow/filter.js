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

const filterTypeSelect = [
  {
    filterType: "status",
    filterName: "Status",
    results: [
      { id: 1, filterType: "status", value: "main", label: "Main Group" },
      { id: 2, filterType: "status", value: "ae_uae_ou", label: "AE UAE OU" },
      { id: 3, filterType: "status", value: "AO_AGO_OU", label: "AO AGO OU" },
      { id: 4, filterType: "status", value: "AO_ANG_OU", label: "AO ANG OU" }
    ]
  },
  {
    filterType: "Business",
    filterName: "business unit",
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
    this.state = {
      fieldOptions: [
        { label: "list empty", value: "list empty", disabled: true }
      ]
    };
  }

  componentDidMount = () => {
    switch (this.props.filterType) {
      case "Business":
        this.props.dispatch(workflowFiltersActions.getBusinessUnitData());
        break;
      case "region":
        this.props.dispatch(workflowFiltersActions.getRegionData());
        break;
      case "status":
        this.props.dispatch(workflowFiltersActions.getStatusData());
        break;
    }
  };

  //SELECT TYPE FILTER DISPATCHED HERE
  handleChange = value => {
    this.setState({ value });
    let fType = this.props.filterType.toLowerCase();
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

  businessUnitFilterChange = value => {
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
    const regionData = this.props.workflowFilterType.regionType;
    const bd = this.props.workflowFilterType.businessType;
    const businessData = {
      loading: bd.loading,
      results: _.orderBy(bd.results, ["label"], ["asc"])
    };
    const statusData = !this.props.workflowFilterType.statusType.error
      ? this.props.workflowFilterType.statusType
      : [{ value: "empty", label: "empty" }];

    return (
      <div>
        <div>
          <label>
            {this.props.label ? this.props.label : this.props.placeholder}
          </label>
        </div>
        {this.props.filterType === "Business" ? (
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
              onChange={this.businessUnitFilterChange}
              label={this.props.placeholder}
              placeholder={this.props.placeholder}
              value={value}
              //onDeselect={this.onDeselect}
              onSelect={this.onSelect}
              style={{ width: "100%" }}
              loading={businessData.loading}
            />
          </FormItem>
        ) : (
          <FormItem
          //hasFeedback={regionData.loading ? true : false}
          //validateStatus={ "validating" : null}
          //help={ "Fetching fields data..." : ""}
          >
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
              //optionFilterProp="children"
              // filterOption={(input, option) =>
              //   option.props.children
              //     .toLowerCase()
              //     .indexOf(input.toLowerCase()) >= 0
              // }
            >
              {_.map(
                this.props.filterType === "region"
                  ? regionData.results
                  : statusData,

                function(c, index) {
                  return (
                    <Option prop={c} title={c.value} key={c.value}>
                      {c.label}
                    </Option>
                  );
                }
              )}
            </Select>
          </FormItem>
        )}
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
      initialLoad: true
    };
  }

  componentDidUpdate = pervProps => {
    if (
      this.props.workflowKind.workflowKind &&
      this.props.workflowFilters.kind.filterValue[0] &&
      this.state.initialLoad
    ) {
      this.setState({
        selected: this.props.workflowFilters.kind.filterValue[0],
        initialLoad: false
      });
    }
  };

  componentDidMount = () => {
    // if (!this.props.workflowFilterType.statusType) {
    //   this.props.dispatch(workflowFiltersActions.getStatusData());
    // }
  };

  shouldComponentUpdate(nextProps) {
    // if(!this.props.languageSelector.language){
    //   return nextProps.languageSelector.language !== this.props.languageSelector.language;
    // }
  }

  workflowKindList = workflowKind => {
    let that = this;

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
    id = value.id;
    this.setState({ selected: id });
    this.props.dispatch(
      workflowFiltersActions.setFilters({
        filterType: "kind",
        filterValue: [id],
        meta: { value }
      })
    );

    this.fetchGroupData(value.tag);
  };

  fetchGroupData = tag => {
    this.props.dispatch(workflowKindActions.getCount(tag));
    this.props.dispatch(workflowKindActions.getStatusCount(tag));
  };

  render = () => {
    let workflowKindList = null;

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

    this.props.dispatch(workflowFiltersActions.getBusinessUnitData());
    this.props.dispatch(workflowFiltersActions.getRegionData());
    this.props.dispatch(workflowFiltersActions.getStatusData());
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
    let that = this,
      filterList = filterTypeSelect;

    const { workflowKind } = this.props.workflowKind;

    let workflowKindFiltered = [];

    _.map(workflowKind, function(item) {
      if (!item.is_related_kind && _.includes(item.features, "add_workflow")) {
        workflowKindFiltered.push(item);
      }
    });

    //workflow Kind list

    //kind temp hide list

    const getTagToHide = tag => {
      let pass = true;

      switch (tag) {
        case "users":
          pass = false;
          break;
        case "entity-id":
          pass = false;
          break;
        default:
          pass = false;
      }

      return pass;
    };

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
                  <i className="material-icons t-14 pd-right-sm">{item.icon}</i>{" "}
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
        width={250}
        style={{ overflow: "auto", height: "100vh", position: "fixed" }}
        className="aux-nav aux-nav-filter bg-white"
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

          <div className="filter-section section-kind">
            <h5 className="aux-item aux-lead">
              <FormattedMessage id="workflowFiltersTranslated.filterWorkflowType" />
            </h5>
            <WorkflowKindFilter
              workflowKind={this.props.workflowKind}
              workflowFilters={this.props.workflowFilters}
              dispatch={this.props.dispatch}
            />
          </div>

          <div className="filter-divider" />

          <div className="filter-section">
            {_.map(filterTypeSelect, function(f, index) {
              let label =
                that.props.intl.formatMessage({
                  id: `workflowFiltersTranslated.filterLabels.${f.filterType}`
                }) || f.filterName;
              let placeholder =
                that.props.intl.formatMessage({
                  id: `workflowFiltersTranslated.filterPlaceholders.${
                    f.filterType
                  }`
                }) || f.filterType;
              return (
                <div
                  className="aux-item aux-lead filter-title"
                  key={"filter-2-" + index}
                >
                  <WorkflowFilter
                    label={label}
                    placeholder={placeholder}
                    filterType={f.filterType}
                    childeren={f.results}
                    {...that.props}
                  />
                </div>
              );
            })}
          </div>

          <div>
            <h5
              className="aux-item aux-lead  text-anchor"
              onClick={this.toggleAdvFilters}
            >
              <FormattedMessage id="workflowFiltersTranslated.advancedFilter" />{" "}
              <i className="material-icons t-16 text-middle">
                {this.state.showAdvFilters
                  ? "keyboard_arrow_up "
                  : "keyboard_arrow_down  "}
              </i>
            </h5>
          </div>

          <div
            className={
              "animated " + (this.state.showAdvFilters ? "fadeIn" : "fadeOut")
            }
          >
            <div className="filter-section">
              <h5 className="aux-item aux-lead filter-title">
                <FormattedMessage id="workflowFiltersTranslated.selectField" />
              </h5>
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
    languageSelector
  } = state;
  return {
    workflowKind,
    workflowFilterType,
    workflowFilters,
    languageSelector
  };
}

export default connect(mapStateToProps)(injectIntl(FilterSidebar));
