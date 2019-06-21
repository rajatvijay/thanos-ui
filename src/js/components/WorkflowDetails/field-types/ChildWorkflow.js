//NEWER
import React, { Component, Fragment } from "react";
import { authHeader, baseUrl, handleResponse } from "../../../_helpers";
import Collapsible from "react-collapsible";
import { WorkflowHeader } from "../../Workflow/WorkflowHeader";
import { calculatedData } from "../../Workflow/calculated-data";
import { connect } from "react-redux";
import { css } from "emotion";
import {
  Form,
  Button,
  Dropdown,
  Row,
  Menu,
  Col,
  Icon,
  Tooltip,
  Divider,
  Tag,
  Select,
  Collapse,
  Checkbox
} from "antd";
import _ from "lodash";
import { commonFunctions } from "./commons";
import { workflowKindActions, createWorkflow } from "../../../actions";
import { FormattedMessage, injectIntl } from "react-intl";
import WorkflowList from "../../Workflow/workflow-list";
import WrappedBulkActionFields from "./BulkActionFields";

const { getProcessedData } = calculatedData;
const Option = Select.Option;
const FormItem = Form.Item;
const {
  getLabel,
  onFieldChange,
  onFieldChangeArray,
  arrayToString,
  stringToArray,
  field_error,
  getRequired,
  feedValue,
  getLink,
  isDisabled
} = commonFunctions;
const Panel = Collapse.Panel;

//MOVE TO UTILS
const getKindID = (kindTag, workflowkind) => {
  let kind = null;
  kind = _.find(workflowkind, function(k) {
    return k.tag === kindTag;
  });
  if (kind) {
    return kind.id;
  } else {
    return;
  }
};

//MOVE TO UTILS
const getKindName = (kindId, workflowKind) => {
  let kind = _.find(workflowKind, function(k) {
    return k.id === parseInt(kindId, 10);
  });

  if (kind) {
    return kind.name;
  } else {
    return;
  }
};

function countBy(collection, func) {
  var object = Object.create(null);

  collection.forEach(function(item) {
    var key = func(item);
    if (key in object) {
      ++object[key];
    } else {
      object[key] = 1;
    }
  });

  return object;
}

const getChildKinds = (workflows, kinds) => {
  let grouped_child_kinds = [];

  if (workflows) {
    workflows.forEach(workflow => {
      if (workflow.child_kinds && workflow.child_kinds[0]) {
        grouped_child_kinds.push(workflow.child_kinds);
      }
    });
  }

  grouped_child_kinds = grouped_child_kinds.reduce((a, b) => a.concat(b), []); //_.flatten(grouped_child_kinds);

  let kindlist = [...new Set(grouped_child_kinds)]; // _.uniq(grouped_child_kinds);
  let count = countBy(grouped_child_kinds, Math.floor);

  let filteredKind = kindlist.map(kind => {
    let item = {};
    item.id = kind;
    item.name = getKindName(kind, kinds);
    item.count = count[kind.toString()];
    return item;
  });

  return filteredKind;
};

const VTag = props => {
  let tag = (
    <span
      className={"vet-tag " + (props.selected ? "vet-tag-selected" : "")}
      onClick={props.onClick}
    >
      {props.label}
    </span>
  );

  return tag;
};

class ChildWorkflowField2 extends Component {
  constructor() {
    super();
    this.state = {
      field: null,
      country: null,
      statusView: true,
      kindChecked: false,
      showRelatedWorkflow: false,
      selected_filters: { category: [], status: "", flag: "", kind: "" },
      showFilters: false,
      bulkActionWorkflowChecked: [],
      isBulkActionModalOpen: false,
      actionSelected: null,
      childWorkflow: null
    };
  }

  componentDidMount = () => {
    if (
      !_.size(this.props.workflowKind.workflowKind) &&
      this.state.kindChecked === false
    ) {
      this.props.dispatch(workflowKindActions.getAll());
      this.setState({ kindChecked: true });
    } else {
      this.prepFetchChildData();
    }
  };

  componentDidUpdate = prevProps => {
    if (
      _.size(this.props.workflowKind.workflowKind) &&
      !_.size(this.state.childWorkflow) &&
      !this.state.fetching &&
      !this.state.fetchEmpty
    ) {
      this.prepFetchChildData();
    }
  };

  prepFetchChildData = () => {
    let kind = this.props.field.definition.extra.child_workflow_kind_id;
    if (this.props.field.definition.extra["exclude_filters"]) {
      this.state.excluded_filters = this.props.field.definition.extra[
        "exclude_filters"
      ];
    }
    this.getChildWorkflow(this.props.workflowId, kind);
  };

  getQueryParamForChildWorkflows = () => {
    try {
      const kindId = this.props.field.definition.extra.child_workflow_kind_id;
      const nodeOrder = this.props.workflowDetailsHeader.workflowDetailsHeader
        .definition.node_order;
      const kindTag = this.props.workflowKind.workflowKind.find(
        kind => kind.id === kindId
      ).tag;
      if (nodeOrder && nodeOrder.includes(kindTag)) {
        return "root_id";
      }
      return "parent_workflow_id";
    } catch (e) {
      return null;
    }
  };

  getChildWorkflow = () => {
    let parentId = this.props.workflowId;
    let kind = this.props.field.definition.extra.child_workflow_kind_id;
    const requestOptions = {
      method: "GET",
      headers: authHeader.get(),
      credentials: "include"
    };

    // decide the query param for workflowId
    const paramName = this.getQueryParamForChildWorkflows();

    // No paramName means we dont know whether to call the API
    // with parent or root query name
    // so lets not call the API
    // The user will have to use the reload button to load embedded workflows
    if (!paramName) {
      return;
    }

    const valueFilter = this.getValuefilter();
    const url = `${baseUrl}workflows-list/?limit=100&${paramName}=${parentId}&kind=${kind}${valueFilter}&child_kinds=true`;

    this.setState({ fetching: true });

    fetch(url, requestOptions)
      .then(response => response.json())
      .then(body => {
        this.setState({
          fetchEmpty: _.size(body.results) ? false : true,
          childWorkflow: body.results,
          filteredChildWorkflow: body.results,
          fetching: false
        });
        this.createStatusFilterTag();
        this.createFilterTag();
        //this.filterByFlag();
        this.excludeWorkflows();
      });
  };

  getValuefilter = () => {
    let filterList = this.props.field.definition.extra.filters;
    let filter = "&";

    if (!_.size(filterList)) {
      return "";
    }

    _.forEach(filterList, (i, index) => {
      filter =
        filter + "answer=" + i.field + "__" + i.operator + "__" + i.value;
      if (!index + 1 === _.size(filterList)) {
        filter = filter + "&";
      }
    });

    return filter;
  };

  onChildSelect = e => {
    let payload = {
      status: 1,
      kind: e.key,
      name: "Draft",
      parent: this.props.workflowId
    };

    this.props.dispatch(createWorkflow(payload));
  };

  getRelatedTypes = () => {
    let related = this.props.workflowDetailsHeader.workflowDetailsHeader
      .definition.related_types;

    let that = this;

    let rt = [];
    if (related.length !== 0) {
      _.map(related, function(rtc) {
        _.filter(that.props.workflowKind.workflowKind, function(kind) {
          if (kind.tag === rtc) {
            rt.push(kind);
          }
        });
      });
    }

    return rt;
  };

  getKindMenu = () => {
    let that = this;
    let workflowKindFiltered = [];
    const relatedKind = this.getRelatedTypes();

    _.map(relatedKind, function(item) {
      if (
        item.is_related_kind &&
        _.includes(item.features, "add_workflow") &&
        that.props.field.definition.extra.child_workflow_kind_id === item.id
      ) {
        workflowKindFiltered.push(item);
      }
    });

    if (_.isEmpty(workflowKindFiltered)) {
      return null;
    }

    let menu = (
      <Menu onClick={this.onChildSelect}>
        {_.map(workflowKindFiltered, function(item, index) {
          return <Menu.Item key={item.tag}>{item.name}</Menu.Item>;
        })}
      </Menu>
    );

    return menu;
  };

  getAddMenu = () => {
    const kindMenu = this.getKindMenu();
    if (!kindMenu) {
      return null;
    }
    let menu = (
      <Dropdown
        overlay={kindMenu}
        className="child-workflow-dropdown"
        placement="bottomRight"
        size="small"
        //disabled={isDisabled(this.props)}
      >
        <span className="pd-ard-sm text-secondary text-anchor">
          <i className="material-icons">add</i>{" "}
          {this.state.fetching ? "loadin..." : null}
        </span>
      </Dropdown>
    );

    return menu;
  };

  createFlagFilter = () => {
    let that = this;
    if (!_.size(that.state.childWorkflow)) {
      return <span />;
    }

    return (
      <Select
        placeholder="Adjudication Code"
        onChange={that.onFilterTagChange.bind(that, "flag")}
        style={{ width: "150px" }}
        size="small"
        allowClear={true}
      >
        {_.map(that.state.childWorkflow[0].comment_flag_options, function(
          v,
          k
        ) {
          return (
            <Option key={v.label} value={v.label}>
              {v.label}
            </Option>
          );
        })}
      </Select>
    );
  };

  filterByFlag = () => {
    let that = this;
    let flag_workflow_map = {};

    // getting lc data alerts count
    _.map(that.state.filteredChildWorkflow, function(val, k) {
      if (!_.size(val.selected_flag)) {
        return;
      }
      let flag = val.selected_flag[val.id]["flag_detail"]["label"];
      if (flag_workflow_map[flag]) {
        flag_workflow_map[flag].push(val);
      } else {
        flag_workflow_map[flag] = [val];
      }
    });
    this.setState({
      flag_workflow_map: flag_workflow_map
    });
  };

  createStatusFilterTag = () => {
    let that = this;
    let status_workflow_map = { All: that.state.childWorkflow };
    let workflow_status_count = {
      All: _.size(that.state.childWorkflow)
    };
    let selected = this.state.selected_filters.status;

    // getting workflow status count
    _.map(that.state.childWorkflow, function(v, k) {
      let wstatus = v["status"]["label"];
      if (workflow_status_count[wstatus]) {
        workflow_status_count[wstatus] += 1;
      } else {
        workflow_status_count[wstatus] = 1;
      }
      if (status_workflow_map[wstatus]) {
        status_workflow_map[wstatus].push(v);
      } else {
        status_workflow_map[wstatus] = [v];
      }
    });

    return _.map(workflow_status_count, function(v, k) {
      return (
        <VTag
          label={k + " (" + v + ")"}
          key={k}
          onClick={that.onFilterTagChange.bind(that, "status", k)}
          selected={
            k === "All" && selected === ""
              ? true
              : selected === k
              ? true
              : false
          }
        />
      );
    });

    // this.setState({
    //   statusfilterTags: statusfilterTags,
    //   status_workflow_map: status_workflow_map
    // });
  };

  createFilterTag = () => {
    let that = this;
    this.setState({
      filterTags: null
    });

    if (!_.size(that.state.filteredChildWorkflow)) {
      this.setState({ filterTags: <span /> });
      return;
    }

    let filter_tag_count = {
      All: _.size(that.state.filteredChildWorkflow)
    };
    let tag_workflow_map = {
      All: that.state.filteredChildWorkflow
    };

    // getting lc data alerts count
    _.map(that.state.filteredChildWorkflow, function(val, k) {
      _.map(val.lc_data, function(tag, i) {
        if (!tag.value) {
          return true;
        }
        if (tag.display_type == "normal") {
          return true;
        }
        if (filter_tag_count[tag.label]) {
          filter_tag_count[tag.label] += 1; //parseInt(tag.value)
        } else {
          filter_tag_count[tag.label] = 1; //parseInt(tag.value)
        }

        if (tag_workflow_map[tag.label]) {
          tag_workflow_map[tag.label].push(val);
        } else {
          tag_workflow_map[tag.label] = [val];
        }
      });
    });

    let styling = this.props.field.definition.extra.lc_data_colorcodes || {};

    let filterTags = (
      <div>
        <span className="text-lighter mr-right-sm">Concerns: </span>
        {_.map(filter_tag_count, (v, k) => {
          return (
            <VTag
              label={
                <Tooltip title={k}>
                  {k} ({v})
                  {styling && styling[k] ? (
                    <i
                      style={{
                        color: styling[k].color,
                        position: "relative",
                        top: "-7px",
                        right: "-23px"
                      }}
                      className="material-icons ellip-small s50 t-12 text-middle"
                    >
                      fiber_manual_records
                    </i>
                  ) : null}
                </Tooltip>
              }
              key={v + k}
              onClick={this.onFilterTagChange.bind(that, k, "category")}
            />
          );
        })}
      </div>
    );

    this.setState({
      filterTags: filterTags,
      tag_workflow_map: tag_workflow_map
    });
  };

  onFilterTagChange = (tag, _type) => {
    let filtered_workflow = this.state.filteredChildWorkflow;

    if (tag == "status") {
      if (_type == "All") {
        delete this.state.selected_filters["status"];
      } else {
        this.state.selected_filters["status"] = _type;
      }
      this.setState({
        selected_filters: this.state.selected_filters
      });
    } else if (_type == "category") {
      if (tag == "All") {
        this.state.selected_filters["category"] = [];
        //delete this.state.selected_filters["category"];
      } else {
        this.state.selected_filters["category"] = [];
        if (_.size(this.state.selected_filters["category"])) {
          if (!_.includes(this.state.selected_filters["category"], tag)) {
            this.state.selected_filters["category"].push(tag);
          }
        } else {
          this.state.selected_filters["category"] = [tag];
        }
      }
      this.setState({
        selected_filters: this.state.selected_filters
      });
    } else if (tag == "flag") {
      this.state.selected_filters["flag"] = _type;
      this.setState({
        selected_filters: this.state.selected_filters
      });
    } else if (tag == "kind") {
      let { selected_filters } = this.state;
      if (_type == "all") {
        selected_filters.kind = "";
      } else {
        selected_filters.kind = _type;
      }
      this.setState({ selected_filters: selected_filters });
    }

    this.filterWorkflows();
    this.excludeWorkflows();
  };

  filterWorkflows = () => {
    let that = this;
    let selected_filters = this.state.selected_filters;
    if (!_.size(selected_filters)) {
      this.state.filteredChildWorkflow = that.state.childWorkflow;
      this.setState({ filteredChildWorkflow: that.state.childWorkflow });
      this.excludeWorkflows();
      return true;
    }
    let filtered_workflow = [];
    _.map(that.state.childWorkflow, function(cw) {
      let found = cw;
      _.map(selected_filters, function(fval, key) {
        if (key == "category" && fval.length) {
          _.forEach(cw.lc_data, function(lc_tag, i) {
            if (!lc_tag.value || lc_tag.display_type != "alert") {
              found = null;
              return true;
            }
            if (_.includes(fval, lc_tag.label)) {
              found = cw;
              return false;
            }
          });
        }

        if (key == "status" && fval) {
          // search for fvalue in cw["status"]["label"]
          if (cw["status"]["label"] != fval && fval != "All") {
            found = null;
            return true;
          }
        }

        if (key == "flag" && fval) {
          if (
            !_.size(cw.selected_flag[cw.id]) ||
            cw.selected_flag[cw.id]["flag_detail"]["label"] != fval
          ) {
            found = null;
            return true;
          }
        }

        if (key == "kind" && fval) {
          if (cw.child_kinds[0] == null || !cw.child_kinds.includes(fval)) {
            found = null;
            return true;
          }
        }
      });

      if (found) {
        filtered_workflow.push(cw);
      }
    });
    this.state.filteredChildWorkflow = filtered_workflow;
    this.setState({ filteredChildWorkflow: filtered_workflow });
    this.excludeWorkflows();
  };

  excludeWorkflows = () => {
    let that = this;
    let excluded_filters = this.state.excluded_filters;
    if (!_.size(excluded_filters)) {
      this.setState({
        filteredChildWorkflow: that.state.filteredChildWorkflow
      });
      return true;
    }
    let filtered_workflow = [];
    _.map(that.state.filteredChildWorkflow, function(cw) {
      let found = cw;
      _.map(excluded_filters, function(fval, key) {
        if (key == "category" && fval.length) {
          _.map(cw.lc_data, function(lc_tag, i) {
            if (!lc_tag.value) {
              return true;
            }
            if (_.includes(fval, lc_tag.label)) {
              found = null;
              return false;
            }
          });
        }
        if (key == "status" && fval) {
          // search for fvalue in cw["status"]["label"]
          if (cw["status"]["label"] == fval && fval != "All") {
            found = null;
            return true;
          }
        }
        if (key == "flag" && fval) {
          if (
            _.size(cw.selected_flag[cw.id]) &&
            cw.selected_flag[cw.id]["flag_detail"]["label"] == fval
          ) {
            found = null;
            return true;
          }
        }

        if (key == "kind" && fval) {
          if (cw.child_kinds[0] && cw.child_kinds.includes(fval)) {
            found = null;
            return true;
          }
        }
      });
      if (found) {
        filtered_workflow.push(cw);
      }
    });

    this.setState({ filteredChildWorkflow: filtered_workflow });
  };

  removeSelectedFilter = (k, v) => {
    // remove filters from selected_filters
    let selected_filters = this.state.selected_filters;
    if ((k == "category") & (_.size(selected_filters[k]) > 1)) {
      selected_filters[k] = _.filter(selected_filters[k], function(cat) {
        return cat != v;
      });
    } else {
      delete selected_filters[k];
    }
    this.setState({ selected_filters: selected_filters });
    this.filterWorkflows();
    //this.createFilterTag();
  };

  removeExcludedFilter = (k, v) => {
    let excluded_filters = this.state.excluded_filters;
    if ((k == "category") & (_.size(excluded_filters[k]) > 1)) {
      excluded_filters[k] = _.filter(excluded_filters[k], function(cat) {
        return cat != v;
      });
    } else {
      delete excluded_filters[k];
    }
    this.setState({ excluded_filters: excluded_filters });
    this.filterWorkflows();
    //this.createFilterTag();
  };

  selectedFilter = () => {
    let that = this;
    if (!_.size(this.state.selected_filters)) {
      return <span />;
    }
    return (
      <span>
        {" "}
        {_.map(this.state.selected_filters, function(v, k) {
          if (k == "category") {
            return _.map(v, function(c) {
              if (!c) {
                return;
              }

              return (
                <VTag
                  label={<Tooltip title={k}>{c}</Tooltip>}
                  selected={true}
                  onClick={that.removeSelectedFilter.bind(that, k, c)}
                  key={c + k + "selected"}
                />
              );
            });
          } else {
            if (!v) {
              return;
            }

            return (
              <VTag
                label={<Tooltip title={k}>{v}</Tooltip>}
                key={v + k + "selected"}
                onClick={that.removeSelectedFilter.bind(that, k, v)}
                selected={true}
              />
            );
          }
        })}
      </span>
    );
  };

  excludedFilter = () => {
    let that = this;
    if (!_.size(this.state.excluded_filters)) {
      return <span />;
    }
    return (
      <span>
        {_.map(this.state.excluded_filters, function(v, k) {
          if (k == "category") {
            return _.map(v, function(c) {
              return (
                <Tag
                  key={c + k + "selected"}
                  className="alert-tag-item alert-metal"
                  // closable
                  // onClose={that.removeExcludedFilter.bind(that, k, c)}
                >
                  <Tooltip title={k}>{c}</Tooltip>
                </Tag>
              );
            });
          } else {
            return (
              <Tag
                key={v + k + "selected"}
                className="alert-tag-item alert-metal"
                // closable
                // onClose={that.removeExcludedFilter.bind(that, k, v)}
              >
                <Tooltip title={k}>{v}</Tooltip>
              </Tag>
            );
          }
        })}
      </span>
    );
  };

  //CREATE. KIND FILTER
  createKindFilter = () => {
    const { props } = this;
    const { field, workflowKind } = props;
    let that = this;
    let kindList = getChildKinds(
      this.state.childWorkflow,
      workflowKind.workflowKind
    );

    let selected = this.state.selected_filters.kind;

    if (kindList.length === 0) {
      return <span />;
    }

    return (
      <div>
        <span className="text-lighter mr-right-sm">Type: </span>

        {kindList.length > 0 ? (
          <VTag
            label="All"
            key={"all"}
            onClick={this.onFilterTagChange.bind(that, "kind", "all")}
            selected={selected === "" ? true : false}
          />
        ) : null}

        {kindList.map(v => {
          return (
            <VTag
              label={`${v.name} (${v.count})`}
              key={v.id}
              onClick={this.onFilterTagChange.bind(that, "kind", v.id)}
              selected={selected === v.id ? true : false}
            />
          );
        })}
      </div>
    );
  };

  onToggleFilters = () => {
    this.setState({ showFilters: !this.state.showFilters });
  };

  handleBulkActionCheck = (event, bulkActionChilren) => {
    if (event.target.checked) {
      let checkedItems = [];
      bulkActionChilren.forEach(item => {
        checkedItems = [
          ...checkedItems,
          {
            id: item.id,
            kindDetail: item.kindDetail
          }
        ];
      });
      this.setState({
        bulkActionWorkflowChecked: checkedItems
      });
    } else {
      this.setState({
        bulkActionWorkflowChecked: []
      });
    }
  };

  handleChildWorkflowCheckbox = (event, id, kindId) => {
    let kindDetail = this.props.workflowKind.workflowKind.filter(
      item => item.id === kindId
    );
    if (event.target.checked) {
      this.setState({
        bulkActionWorkflowChecked: [
          ...this.state.bulkActionWorkflowChecked,
          {
            id: id,
            kindDetail: {
              bulk_actions: kindDetail.length ? kindDetail[0].bulk_actions : []
            }
          }
        ]
      });
    } else {
      let checkedChildren = this.state.bulkActionWorkflowChecked.filter(
        item => item.id != id
      );
      this.setState({
        bulkActionWorkflowChecked: checkedChildren
      });
    }
  };

  onOpenBulkActionModal = action => {
    this.setState({
      isBulkActionModalOpen: true,
      actionSelected: action
    });
  };

  onCloseBulkActionModal = () => {
    this.setState({
      isBulkActionModalOpen: false,
      actionSelected: null
    });
  };

  getBulkAction = workflows => {
    const allBulkActions = workflows.flatMap(
      workflow => workflow.kindDetail.bulk_actions
    );
    // const uniqueBulkActions = Array.from(new Set(allBulkActions))
    const uniqueBulkActions = [];
    allBulkActions.forEach(bulkAction => {
      if (
        !uniqueBulkActions.find(
          ({ action_tag }) => action_tag === bulkAction.action_tag
        )
      ) {
        uniqueBulkActions.push(bulkAction);
      }
    });

    const commonBulkActions = [];
    uniqueBulkActions.forEach(bulkAction => {
      const filteredWorkflows = workflows.filter(workflow =>
        workflow.kindDetail.bulk_actions
          .map(({ action_tag }) => action_tag)
          .includes(bulkAction.action_tag)
      );
      if (filteredWorkflows.length === workflows.length) {
        commonBulkActions.push(bulkAction);
      }
    });

    if (!commonBulkActions.length) {
      return "No Bulk Action Available";
    } else {
      return (
        <div style={{ display: "flex", flexDirection: "row" }}>
          {commonBulkActions.map(action => (
            <Button
              onClick={event => this.onOpenBulkActionModal(action)}
              style={{
                border: "1px solid #148CD6",
                color: "#148CD6"
              }}
            >
              {action.name}
            </Button>
          ))}
        </div>
      );
    }
  };

  render = () => {
    const { props } = this;
    const {
      field,
      workflowKind,
      workflowDetailsHeader,
      currentStepFields
    } = props;
    const { bulkActionWorkflowChecked, childWorkflow } = this.state;
    let that = this;

    let kindList = workflowKind.workflowKind ? workflowKind.workflowKind : [];
    let workflowHeaderChild = childWorkflow ? childWorkflow : [];
    const bulkActionChilren = workflowHeaderChild;
    workflowHeaderChild.forEach((child, index) => {
      kindList.forEach(kind => {
        if (child.definition.kind === kind.id) {
          bulkActionChilren[index].kindDetail = {
            bulk_actions: kind.bulk_actions
          };
        }
      });
    });

    let isBulkCheck =
      bulkActionChilren.length &&
      bulkActionWorkflowChecked.length &&
      bulkActionChilren.length === bulkActionWorkflowChecked.length;
    return (
      <FormItem
        label={""}
        className={
          "childworkflow-field-item from-label " +
          (_.size(props.field.selected_flag) ? " has-flag" : "")
        }
        style={{ display: "block", margin: "0" }}
        key={props.field.id}
        message=""
        hasFeedback
        autoComplete="new-password"
        {...field_error(props)}
      >
        {this.state.fetching ? (
          <div className="text-center mr-top-lg">
            <Icon type="loading" style={{ fontSize: 24 }} />
          </div>
        ) : (
          <div>
            <WrappedBulkActionFields
              actionDetail={this.state.actionSelected}
              open={this.state.isBulkActionModalOpen}
              onCloseBulkActionModal={this.onCloseBulkActionModal}
              bulkActionWorkflowChecked={this.state.bulkActionWorkflowChecked}
            />
            {/*show filters top*/}
            <Row>
              <Col
                span={12}
                style={{
                  display: "flex",
                  alignItems: "center",
                  paddingLeft: "40px"
                }}
              >
                {_.size(this.state.filteredChildWorkflow) ? (
                  <span style={{ marginRight: "10.5px" }}>
                    <Checkbox
                      className={css`
                        .ant-checkbox-inner {
                          width: 16px;
                          height: 16px;
                        }
                      `}
                      checked={isBulkCheck}
                      onChange={event =>
                        this.handleBulkActionCheck(event, bulkActionChilren)
                      }
                    />
                  </span>
                ) : null}
                {!this.state.bulkActionWorkflowChecked.length ? (
                  <span className="text-lighter">
                    {this.state.childWorkflow
                      ? this.state.childWorkflow.length
                      : 0}{" "}
                    results{" "}
                  </span>
                ) : null}
                {!this.state.bulkActionWorkflowChecked.length ? (
                  field.definition.extra.show_filters ? (
                    <span
                      className="mr-left-lg text-lighter text-anchor"
                      onClick={this.onToggleFilters}
                    >
                      Filters{" "}
                      <i className=" t-14 text-middle material-icons">
                        keyboard_arrow_down
                      </i>
                    </span>
                  ) : null
                ) : null}
                {this.state.bulkActionWorkflowChecked.length
                  ? this.getBulkAction(this.state.bulkActionWorkflowChecked)
                  : null}
              </Col>

              <Col span={12} className="text-right small">
                <span
                  onClick={this.getChildWorkflow}
                  title="Reload"
                  className="child-workflow-dropdown pd-ard-sm mr-right-sm text-secondary text-anchor"
                >
                  <i className="material-icons">refresh</i>
                </span>

                {this.props.workflowDetailsHeader.workflowDetailsHeader ? (
                  this.getAddMenu()
                ) : (
                  <span className="disabled child-workflow-dropdown pd-ard-sm text-lighter">
                    <i className="material-icons">add</i>{" "}
                    <Icon type="loading" />
                  </span>
                )}
              </Col>
            </Row>
            <br />

            {/*FILTERS BEGINS */}

            {this.state.showFilters ? (
              <Fragment>
                <Divider className="no-margin" />

                <div
                  style={{
                    background: "#FAFAFA",
                    padding: "24px",
                    overflow: "hidden"
                  }}
                  className="animated pd-bottom"
                >
                  {field.definition.extra.show_filters ? (
                    <div>
                      <Row className="mr-bottom">
                        <Col span={24}>
                          {/*ADJUDICATION FILTER*/}
                          <span className="mr-right">
                            {this.createFlagFilter()}
                          </span>
                          <br />
                        </Col>
                      </Row>

                      <Row className="mr-bottom">
                        <Col span={24}>
                          {/*CATEGORY FILTER*/}
                          {this.state.filterTags}
                        </Col>
                      </Row>
                      <Row className="mr-bottom">
                        <Col span={24}>
                          {/*KIND FILTER*/}
                          {this.createKindFilter()}
                        </Col>
                      </Row>
                    </div>
                  ) : null}

                  <Row className="mr-bottom">
                    {field.definition.extra.show_filters ? (
                      <Col span="18">
                        <div>
                          <span
                            className="text-lighter"
                            style={{ marginRight: "10px", float: "left" }}
                          >
                            Status:{" "}
                          </span>

                          {/*STATUS FILTER*/}
                          <span className="mr-right">
                            {this.createStatusFilterTag()}
                          </span>
                        </div>

                        {/*EXCLUDED FILTERS*/}
                        {_.size(this.state.excluded_filters) ? (
                          <span className="mr-left-lg">
                            <span className="text-lighter mr-right">
                              {" "}
                              Excluded:
                            </span>
                            {this.excludedFilter()}
                          </span>
                        ) : null}
                      </Col>
                    ) : (
                      <Col span="18" />
                    )}
                  </Row>

                  {_.size(this.state.selected_filters) ? (
                    <Row>
                      <Col span="12" style={{ marginTop: "10px" }}>
                        <span
                          className="text-lighter "
                          style={{ marginRight: "10px", float: "left" }}
                        >
                          Filtered:{" "}
                        </span>
                        <span>{this.selectedFilter()}</span>
                      </Col>
                    </Row>
                  ) : null}
                </div>
                <Divider className="no-margin" />
              </Fragment>
            ) : null}

            {/*FILTERS ENDS */}

            {/*WROKFLOW LIST*/}
            <div
              className="workflow-list workflows-list-embedded "
              style={{ margin: "2px" }}
            >
              {_.size(this.state.filteredChildWorkflow) ? (
                <WorkflowList
                  isEmbedded={true}
                  sortAscending={false}
                  {...this.props}
                  workflow={{ workflow: this.state.filteredChildWorkflow }}
                  statusView={true}
                  kind={workflowKind}
                  sortingEnabled={false}
                  workflowKind={workflowKind}
                  fieldExtra={field.definition.extra || null}
                  addComment={props.addComment}
                  showCommentIcon={true}
                  bulkActionWorkflowChecked={
                    this.state.bulkActionWorkflowChecked
                  }
                  handleChildWorkflowCheckbox={this.handleChildWorkflowCheckbox}
                />
              ) : (
                <div>No related workflows</div>
              )}
            </div>
          </div>
        )}
      </FormItem>
    );
  };
}

function mapPropsToState(state) {
  const { workflowDetailsHeader, workflowKind, currentStepFields } = state;

  return {
    workflowDetailsHeader,
    workflowKind,
    currentStepFields
  };
}

const ChildWorkflowFieldComponent = connect(mapPropsToState)(
  injectIntl(ChildWorkflowField2)
);

export const ChildWorkflowField = props => {
  return <ChildWorkflowFieldComponent {...props} />;
};
