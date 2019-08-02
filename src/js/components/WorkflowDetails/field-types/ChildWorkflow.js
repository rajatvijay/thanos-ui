//NEWER
import React, { Component, Fragment } from "react";
import { authHeader } from "../../../_helpers";
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
  Checkbox
} from "antd";
import _ from "lodash";
import { commonFunctions } from "./commons";
import { workflowKindActions, createWorkflow } from "../../../actions";
import { injectIntl } from "react-intl";
import WorkflowList from "../../Workflow/workflow-list";
import WrappedBulkActionFields from "./BulkActionFields";
import { apiBaseURL } from "../../../../config";

const Option = Select.Option;
const FormItem = Form.Item;
const { field_error } = commonFunctions;

//MOVE TO UTILS
const getKindName = (kindId, workflowKind) => {
  const kind = _.find(workflowKind, function(k) {
    return k.id === parseInt(kindId, 10);
  });

  if (kind) {
    return kind.name;
  } else {
    return;
  }
};

function countBy(collection, func) {
  const object = Object.create(null);

  collection.forEach(function(item) {
    const key = func(item);
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

  grouped_child_kinds = grouped_child_kinds.reduce((a, b) => a.concat(b), []);

  const kindlist = [...new Set(grouped_child_kinds)];
  const count = countBy(grouped_child_kinds, Math.floor);

  const filteredKind = kindlist.map(kind => {
    let item = {};
    item.id = kind;
    item.name = getKindName(kind, kinds);
    item.count = count[kind.toString()];
    return item;
  });

  return filteredKind;
};

const VTag = props => {
  const tag = (
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
      childWorkflow: null,
      sortOrderAsc: false,
      sortingEnabled: false,
      sortBy: undefined
    };
    this.onFilterTagChange = this.onFilterTagChange.bind(this);
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
    if (this.props.field.definition.extra["exclude_filters"]) {
      this.state.excluded_filters = this.props.field.definition.extra[
        "exclude_filters"
      ];
    }
    this.getChildWorkflow();
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

  objToParam = query => {
    const searchParams = new URLSearchParams();

    Object.keys(query).forEach(key => {
      if (query[key]) {
        return searchParams.append(key, query[key]);
      }
    });
    return searchParams.toString();
  };

  getChildWorkflow = () => {
    const parentId = this.props.workflowId;

    const kind = this.props.field.definition.extra.child_workflow_kind_id;

    const requestOptions = {
      method: "GET",
      headers: authHeader.get(),
      credentials: "include"
    };
    const { sortBy } = this.state;

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
    const param = this.objToParam({
      limit: 100,
      [paramName]: parentId,
      kind: `${kind}`,
      answer: `${valueFilter}`,
      ordering: sortBy,
      child_kinds: true
    });

    const url = `${apiBaseURL}workflows-list/?${param}`;

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
        this.excludeWorkflows();
      });
  };

  changeScoreOrder = order => {
    const isAscending = this.state.sortOrderAsc;
    const isSortingEnabled = this.state.sortingEnabled;
    if (!isSortingEnabled) {
      // Enable the sroting in descending mode
      this.setState(
        {
          sortOrderAsc: false,
          sortingEnabled: true,
          sortBy: "-sorting_primary_field"
        },
        function() {
          this.getChildWorkflow();
        }
      );
    } else if (isAscending) {
      // Disable the sorting
      this.setState({ sortingEnabled: false, sortBy: undefined }, function() {
        this.getChildWorkflow();
      });
    } else {
      // Enable sorting in the ascending mode
      this.setState(
        {
          sortOrderAsc: true,
          sortingEnabled: true,
          sortBy: "sorting_primary_field"
        },
        function() {
          this.getChildWorkflow();
        }
      );
    }
  };

  getValuefilter = () => {
    const filterList = this.props.field.definition.extra.filters;
    let filter = "";

    if (!_.size(filterList)) {
      return "";
    }

    _.forEach(filterList, (i, index) => {
      filter = filter + i.field + "__" + i.operator + "__" + i.value;
      if (!index + 1 === _.size(filterList)) {
        filter = filter + "|";
      }
    });

    return filter;
  };

  onChildSelect = e => {
    const kindTag = e.key;
    const kind = this.props.workflowKind.workflowKind.find(
      kind => kind.tag === kindTag
    );
    const payload = {
      status: kind && kind.default_status,
      kind: kindTag,
      name: "Draft",
      parent: this.props.workflowId,
      child_mapping: this.props.field.definition.extra.child_mapping || null
    };

    this.props.dispatch(createWorkflow(payload));
  };

  getRelatedTypes = () => {
    const related = this.props.workflowDetailsHeader.workflowDetailsHeader
      .definition.related_types;

    const that = this;

    let relatedType = [];
    if (related.length !== 0) {
      related.map(function(rtc) {
        _.filter(that.props.workflowKind.workflowKind, function(kind) {
          if (kind.tag === rtc) {
            relatedType.push(kind);
          }
        });
      });
    }

    return relatedType;
  };

  getKindMenu = () => {
    const that = this;
    let workflowKindFiltered = [];
    const relatedKind = this.getRelatedTypes();

    if (relatedKind.length) {
      relatedKind.map(function(item) {
        if (
          item.is_related_kind &&
          _.includes(item.features, "add_workflow") &&
          that.props.field.definition.extra.child_workflow_kind_id === item.id
        ) {
          workflowKindFiltered.push(item);
        }
      });
    }

    if (_.isEmpty(workflowKindFiltered)) {
      return null;
    }

    const menu = (
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

    return this.props.stepData.completed_at ||
      this.props.stepData.is_locked ? null : (
      <Dropdown
        overlay={kindMenu}
        className="child-workflow-dropdown"
        placement="bottomRight"
        size="small"
        disabled={this.props.currentStepFields.isSubmitting}
      >
        <span className="pd-ard-sm text-secondary text-anchor">
          <i className="material-icons">add</i>{" "}
          {this.state.fetching ? "loadin..." : null}
        </span>
      </Dropdown>
    );
  };

  createFlagFilter = () => {
    const that = this;
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
          value,
          key
        ) {
          return (
            <Option key={value.label} value={value.label}>
              {value.label}
            </Option>
          );
        })}
      </Select>
    );
  };

  filterByFlag = () => {
    const that = this;
    let flag_workflow_map = {};

    // getting lc data alerts count
    _.map(that.state.filteredChildWorkflow, function(val, key) {
      if (!_.size(val.selected_flag)) {
        return;
      }
      const flag = val.selected_flag[val.id]["flag_detail"]["label"];
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
    const that = this;
    let status_workflow_map = { All: that.state.childWorkflow };
    let workflow_status_count = {
      All: _.size(that.state.childWorkflow)
    };
    const selected = this.state.selected_filters.status;

    // getting workflow status count
    that.state.childWorkflow &&
      that.state.childWorkflow.map(function(value, key) {
        const wstatus = value["status"]["label"];
        if (workflow_status_count[wstatus]) {
          workflow_status_count[wstatus] += 1;
        } else {
          workflow_status_count[wstatus] = 1;
        }
        if (status_workflow_map[wstatus]) {
          status_workflow_map[wstatus].push(value);
        } else {
          status_workflow_map[wstatus] = [value];
        }
      });

    return _.map(workflow_status_count, function(value, key) {
      return (
        <VTag
          label={key + " (" + value + ")"}
          key={key}
          onClick={() => that.onFilterTagChange("status", key)}
          selected={
            key === "All" && !selected ? true : selected === key ? true : false
          }
        />
      );
    });
  };

  createFilterTag = () => {
    const that = this;
    const filter_tag_count = {
      All: _.size(that.state.filteredChildWorkflow)
    };
    const tag_workflow_map = {
      All: that.state.filteredChildWorkflow
    };

    let selectedFilter = this.state.selected_filters.category;

    // getting lc data alerts count
    if (this.state.childWorkflow) {
      this.state.childWorkflow.map(function(val, key) {
        _.map(val.lc_data, function(tag, i) {
          if (!tag.value) {
            return true;
          }
          if (tag.display_type === "normal") {
            return true;
          }
          if (filter_tag_count[tag.label]) {
            filter_tag_count[tag.label] += 1;
          } else {
            filter_tag_count[tag.label] = 1;
          }

          if (tag_workflow_map[tag.label]) {
            tag_workflow_map[tag.label].push(val);
          } else {
            tag_workflow_map[tag.label] = [val];
          }
        });
      });
    }

    const styling = this.props.field.definition.extra.lc_data_colorcodes || {};

    const filterTags = _.map(filter_tag_count, (value, key) => {
      let isSelected = false;
      if (key === "All" && selectedFilter && selectedFilter.length === 0) {
        isSelected = true;
      }

      if (selectedFilter && selectedFilter[0] === key) {
        isSelected = true;
      }

      return (
        <VTag
          label={
            <Tooltip title={key}>
              {key} ({value})
              {styling && styling[key] ? (
                <i
                  style={{
                    color: styling[key].color,
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
          key={value + key}
          selected={isSelected}
          onClick={this.onFilterTagChange.bind(that, key, "category")}
        />
      );
    });

    return filterTags;
  };

  onFilterTagChange = (tag, _type) => {
    //let filtered_workflow = this.state.filteredChildWorkflow;
    const { selected_filters } = this.state;
    if (tag === "status") {
      if (_type === "All") {
        delete selected_filters["status"];
      } else {
        selected_filters["status"] = _type;
      }
      this.setState({
        selected_filters: selected_filters
      });
    } else if (_type === "category") {
      if (tag === "All") {
        selected_filters["category"] = [];
        //delete this.state.selected_filters["category"];
      } else {
        selected_filters["category"] = [];
        if (_.size(selected_filters["category"])) {
          if (!_.includes(selected_filters["category"], tag)) {
            selected_filters["category"].push(tag);
          }
        } else {
          selected_filters["category"] = [tag];
        }
      }
      this.setState({
        selected_filters: selected_filters
      });
    } else if (tag === "flag") {
      selected_filters["flag"] = _type;
      this.setState({
        selected_filters: selected_filters
      });
    } else if (tag === "kind") {
      if (_type === "all") {
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
    const that = this;
    const selected_filters = this.state.selected_filters;
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
        if (key === "category" && fval.length) {
          _.forEach(cw.lc_data, function(lc_tag, i) {
            if (!lc_tag.value || lc_tag.display_type !== "alert") {
              found = null;
              return true;
            }
            if (_.includes(fval, lc_tag.label)) {
              found = cw;
              return false;
            }
          });
        }

        if (key === "status" && fval) {
          // search for fvalue in cw["status"]["label"]
          if (cw["status"]["label"] !== fval && fval !== "All") {
            found = null;
            return true;
          }
        }

        if (key === "flag" && fval) {
          if (
            !_.size(cw.selected_flag[cw.id]) ||
            cw.selected_flag[cw.id]["flag_detail"]["label"] !== fval
          ) {
            found = null;
            return true;
          }
        }

        if (key === "kind" && fval) {
          if (cw.child_kinds[0] === null || !cw.child_kinds.includes(fval)) {
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
    const that = this;
    const excluded_filters = this.state.excluded_filters;
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
        if (key === "category" && fval.length) {
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
        if (key === "status" && fval) {
          // search for fvalue in cw["status"]["label"]
          if (cw["status"]["label"] === fval && fval !== "All") {
            found = null;
            return true;
          }
        }
        if (key === "flag" && fval) {
          if (
            _.size(cw.selected_flag[cw.id]) &&
            cw.selected_flag[cw.id]["flag_detail"]["label"] === fval
          ) {
            found = null;
            return true;
          }
        }

        if (key === "kind" && fval) {
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

  removeSelectedFilter = (key, value) => {
    // remove filters from selected_filters
    let selected_filters = this.state.selected_filters;
    if ((key === "category") & (_.size(selected_filters[key]) > 1)) {
      selected_filters[key] = _.filter(selected_filters[key], function(cat) {
        return cat !== value;
      });
    } else {
      delete selected_filters[key];
    }
    this.setState({ selected_filters: selected_filters });
    this.filterWorkflows();
    //this.createFilterTag();
  };

  removeExcludedFilter = (key, value) => {
    let excluded_filters = this.state.excluded_filters;
    if ((key === "category") & (_.size(excluded_filters[key]) > 1)) {
      excluded_filters[key] = _.filter(excluded_filters[key], function(cat) {
        return cat !== value;
      });
    } else {
      delete excluded_filters[key];
    }
    this.setState({ excluded_filters: excluded_filters });
    this.filterWorkflows();
    //this.createFilterTag();
  };

  selectedFilter = () => {
    const that = this;
    if (!_.size(this.state.selected_filters)) {
      return <span />;
    }

    const closeIcon = (
      <i className="material-icons t-12 text-middle text-white pd-left-sm">
        cancel
      </i>
    );

    return (
      <span>
        {" "}
        {_.map(this.state.selected_filters, (value, key) => {
          if (key == "category") {
            return _.map(value, function(category) {
              if (!category) {
                return;
              }

              return (
                <VTag
                  label={
                    <Tooltip title={key}>
                      {category} {closeIcon}
                    </Tooltip>
                  }
                  selected={true}
                  onClick={that.removeSelectedFilter.bind(that, key, category)}
                  key={category + key + "selected"}
                />
              );
            });
          } else {
            if (!value) {
              return;
            }

            if (key !== "kind") {
              return (
                <VTag
                  label={
                    <Tooltip title={key}>
                      {value} {closeIcon}
                    </Tooltip>
                  }
                  key={value + key + "selected"}
                  onClick={that.removeSelectedFilter.bind(that, key, value)}
                  selected={true}
                />
              );
            } else {
              const { workflowKind } = this.props.workflowKind;
              const filterName = getKindName(value, workflowKind);

              return (
                <VTag
                  label={
                    <Tooltip title={key}>
                      {filterName} {closeIcon}
                    </Tooltip>
                  }
                  key={value + key + "selected"}
                  onClick={that.removeSelectedFilter.bind(that, key, value)}
                  selected={true}
                />
              );
            }
          }
        })}
      </span>
    );
  };

  excludedFilter = () => {
    if (!_.size(this.state.excluded_filters)) {
      return <span />;
    }

    return (
      <span>
        {_.map(this.state.excluded_filters, function(value, key) {
          if (key === "category") {
            return _.map(value, function(category) {
              return (
                <Tag
                  key={category + key + "selected"}
                  className="alert-tag-item alert-metal"
                  // closable
                  // onClose={that.removeExcludedFilter.bind(that, k, c)}
                >
                  <Tooltip title={key}>{category}</Tooltip>
                </Tag>
              );
            });
          } else {
            return (
              <Tag
                key={value + key + "selected"}
                className="alert-tag-item alert-metal"
              >
                <Tooltip title={key}>{value}</Tooltip>
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
    const that = this;
    const kindList = getChildKinds(
      this.state.childWorkflow,
      workflowKind.workflowKind
    );

    const selected = this.state.selected_filters.kind;

    if (kindList.length === 0) {
      return <span />;
    }

    return (
      <div>
        {kindList.length > 0 ? (
          <VTag
            label={`All (${kindList.length})`}
            key={"all"}
            onClick={() => this.onFilterTagChange("kind", "all")}
            selected={selected === "" ? true : false}
          />
        ) : null}

        {kindList.map(value => {
          return (
            <VTag
              label={`${value.name} (${value.count})`}
              key={value.id}
              onClick={() => this.onFilterTagChange("kind", value.id)}
              selected={selected === value.id ? true : false}
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
    const kindDetail = this.props.workflowKind.workflowKind.filter(
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
      const checkedChildren = this.state.bulkActionWorkflowChecked.filter(
        item => item.id !== id
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
          {commonBulkActions.map((action, index) => (
            <Button
              key={`${index}`}
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

  getSortingLabel() {
    const workflows = this.state.filteredChildWorkflow;

    if (
      workflows &&
      workflows.length &&
      Array.isArray(workflows[0].definition.extra_fields_json)
    ) {
      const workflow = workflows[0].definition.extra_fields_json.find(
        ({ label }) => label === "sorting_primary_field"
      );
      return workflow ? workflow.display_label : "";
    }
  }

  getSortingTooltipText() {
    if (!this.state.sortingEnabled) {
      return "";
    }

    if (this.state.sortOrderAsc) {
      return `Low to high ${this.getSortingLabel()}`;
    } else {
      return `High to low ${this.getSortingLabel()}`;
    }
  }

  render = () => {
    const { props } = this;
    const { field, workflowKind } = props;
    const { bulkActionWorkflowChecked, childWorkflow } = this.state;
    const kindList = workflowKind.workflowKind ? workflowKind.workflowKind : [];
    const workflowHeaderChild = childWorkflow ? childWorkflow : [];

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

    const isBulkCheck =
      bulkActionChilren.length &&
      bulkActionWorkflowChecked.length &&
      bulkActionChilren.length === bulkActionWorkflowChecked.length;

    const FilterComponent = props => {
      const { label, filter } = props;

      return (
        <Row className="mr-bottom">
          {label ? (
            <Col span={2} className="text-lighter">
              {label}:{" "}
            </Col>
          ) : null}

          <Col span={label ? 22 : 24}>{filter}</Col>
        </Row>
      );
    };

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
                span={16}
                style={{
                  display: "flex",
                  alignItems: "center",
                  paddingLeft: "30px"
                }}
              >
                {_.size(this.state.filteredChildWorkflow) ? (
                  <span style={{ marginRight: "10.5px" }}>
                    <Checkbox
                      className={css`
                        .ant-checkbox-inner {
                          width: 20px;
                          height: 20px;
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

                {_.size(this.state.filteredChildWorkflow) ? (
                  <Tooltip title={this.getSortingTooltipText()}>
                    <span
                      style={{ marginRight: 15, marginLeft: 15 }}
                      className="text-secondary text-anchor"
                      onClick={this.changeScoreOrder}
                    >
                      {this.getSortingLabel()}
                      {this.state.sortingEnabled ? (
                        <i className="material-icons t-14  text-middle">
                          {this.state.sortOrderAsc
                            ? "keyboard_arrow_up"
                            : "keyboard_arrow_down"}
                        </i>
                      ) : null}
                    </span>
                  </Tooltip>
                ) : null}
              </Col>

              <Col span={8} className="text-right small">
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
                      {/*ADJUDICATION FILTER*/}
                      <FilterComponent filter={this.createFlagFilter()} />

                      {/*Concerns ala CATEGORY FILTER*/}
                      <FilterComponent
                        label="Concerns"
                        filter={this.createFilterTag()}
                      />

                      {/*KIND FILTER*/}
                      <FilterComponent
                        label="Type"
                        filter={this.createKindFilter()}
                      />

                      {/*STATUS FILTER*/}
                      <FilterComponent
                        label="Status"
                        filter={this.createStatusFilterTag()}
                      />

                      {/*EXCLUDED FILTERS*/}
                      {this.state.excluded_filters ? (
                        <FilterComponent
                          label="Excluded"
                          filter={this.excludedFilter()}
                        />
                      ) : null}

                      {/*SELECTED FILTERS */}
                      {_.size(this.state.selected_filters) ? (
                        <FilterComponent
                          label="Filtered"
                          filter={this.selectedFilter()}
                        />
                      ) : null}
                    </div>
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
                  disableGrouping={true}
                  handleChildWorkflowCheckbox={this.handleChildWorkflowCheckbox}
                />
              ) : (
                <div>No results found</div>
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
