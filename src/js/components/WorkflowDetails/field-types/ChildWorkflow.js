//NEWER
import React, { Component } from "react";
import { authHeader, baseUrl, handleResponse } from "../../../_helpers";
import Collapsible from "react-collapsible";
import { WorkflowHeader } from "../../Workflow/WorkflowHeader";
import { WorkflowBody } from "../../Workflow/WorkflowBody";
import { calculatedData } from "../../Workflow/calculated-data";
import { connect } from "react-redux";
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
  Collapse
} from "antd";
import _ from "lodash";
import { commonFunctions } from "./commons";
import { workflowKindActions, createWorkflow } from "../../../actions";
import { FormattedMessage, injectIntl } from "react-intl";
import WorkflowList from "../../Workflow/workflow-list";

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

class ChildWorkflowField2 extends Component {
  constructor() {
    super();
    this.state = {
      field: null,
      country: null,
      statusView: true,
      kindChecked: false,
      showRelatedWorkflow: false,
      selected_filters: { category: [], status: "", flag: "", kind: "" }
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
    const url = `${baseUrl}workflows-list/?limit=100&${paramName}=${
      parentId
    }&kind=${kind}${valueFilter}&child_kinds=true`;

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

    return this.props.stepData &&
      (this.props.stepData.completed_at || this.props.stepData.is_locked) ? (
      <Dropdown
        overlay={kindMenu}
        className="child-workflow-dropdown"
        placement="bottomRight"
        size="small"
        disabled={true}
      >
        <Button type="primary" size="small">
          + create new
        </Button>
      </Dropdown>
    ) : (
      <Dropdown
        overlay={kindMenu}
        className="child-workflow-dropdown"
        placement="bottomRight"
        size="small"
        disabled={this.props.currentStepFields.isSubmitting}
      >
        <Button
          type="primary"
          loading={this.props.workflowKind.loading ? true : false}
          size="small"
        >
          + create new {this.state.fetching ? "loadin..." : ""}
        </Button>
      </Dropdown>
    );
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
    let status_workflow_map = { "All Status": that.state.childWorkflow };
    let workflow_status_count = {
      "All Status": _.size(that.state.childWorkflow)
    };

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

    let statusfilterTags = (
      <Select
        placeholder="Status"
        onChange={that.onFilterTagChange.bind(that, "status")}
        style={{ width: "150px" }}
        size="small"
        allowClear={true}
      >
        {_.map(workflow_status_count, function(v, k) {
          return (
            <Option key={k} value={k}>
              {k} ({v})
            </Option>
          );
        })}
      </Select>
    );

    this.setState({
      statusfilterTags: statusfilterTags,
      status_workflow_map: status_workflow_map
    });
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
      "All Categories": _.size(that.state.filteredChildWorkflow)
    };
    let tag_workflow_map = {
      "All Categories": that.state.filteredChildWorkflow
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
        <span className="text-metal mr-right-sm">Areas of Concern: </span>
        {_.map(filter_tag_count, (v, k) => {
          return (
            <span
              key={v + k}
              className="alert-tag-item alert-basic ant-tag"
              onClick={this.onFilterTagChange.bind(that, k, "category")}
            >
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
            </span>
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
      if (_type == "All Status") {
        delete this.state.selected_filters["status"];
      } else {
        this.state.selected_filters["status"] = _type;
      }
      this.setState({
        selected_filters: this.state.selected_filters
      });
    } else if (_type == "category") {
      if (tag == "All Categories") {
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
          if (cw["status"]["label"] != fval && fval != "All Status") {
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
          if (cw["status"]["label"] == fval && fval != "All Status") {
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
                <Tag
                  key={c + k + "selected"}
                  className="alert-tag-item alert-metal"
                  closable
                  onClose={that.removeSelectedFilter.bind(that, k, c)}
                >
                  <Tooltip title={k}>{c}</Tooltip>
                </Tag>
              );
            });
          } else {
            if (!v) {
              return;
            }

            return (
              <Tag
                key={v + k + "selected"}
                className="alert-tag-item alert-metal"
                closable
                onClose={that.removeSelectedFilter.bind(that, k, v)}
              >
                <Tooltip title={k}>{v}</Tooltip>
              </Tag>
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

    if (kindList.length === 0) {
      return <span />;
    }

    return (
      <div>
        <span className="text-metal mr-right-sm">Type of Search: </span>

        {kindList.length > 0 ? (
          <span
            key={"all"}
            className="alert-tag-item alert-basic ant-tag"
            onClick={this.onFilterTagChange.bind(that, "kind", "all")}
          >
            All searches
          </span>
        ) : null}

        {kindList.map(v => {
          return (
            <span
              key={v.id}
              className="alert-tag-item alert-basic ant-tag"
              onClick={this.onFilterTagChange.bind(that, "kind", v.id)}
            >
              {`${v.name} (${v.count})`}
            </span>
          );
        })}
      </div>
    );
  };

  render = () => {
    const { props } = this;
    const { field, workflowKind } = props;
    let that = this;

    return (
      <FormItem
        label={""}
        className={
          "from-label " + (_.size(props.field.selected_flag) ? " has-flag" : "")
        }
        style={{ display: "block" }}
        key={props.field.id}
        message=""
        required={getRequired(props)}
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
            <div className="">
              {field.definition.extra.show_filters ? (
                <div>
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
                    <span
                      className="text-metal"
                      style={{ marginRight: "10px", float: "left" }}
                    >
                      Filter by:{" "}
                    </span>

                    {/*STATUS FILTER*/}
                    <span className="mr-right">
                      {this.state.statusfilterTags}
                    </span>

                    {/*ADJUDICATION FILTER*/}
                    <span className="mr-right">{this.createFlagFilter()}</span>

                    {/*EXCLUDED FILTERS*/}
                    {_.size(this.state.excluded_filters) ? (
                      <span className="mr-left-lg">
                        <span className="text-metal mr-right"> Excluded:</span>
                        {this.excludedFilter()}
                      </span>
                    ) : null}
                  </Col>
                ) : (
                  <Col span="18" />
                )}

                <Col span="6" className="text-right text-light small">
                  <Button
                    type="primary"
                    className="btn-o mr-right-sm"
                    onClick={this.getChildWorkflow}
                    size="small"
                  >
                    Reload
                  </Button>

                  {this.props.workflowDetailsHeader.workflowDetailsHeader ? (
                    this.getAddMenu()
                  ) : (
                    <span className="ant-btn disabled child-workflow-dropdown ant-btn-primary ant-btn-sm">
                      + create new <Icon type="loading" />
                    </span>
                  )}
                </Col>
              </Row>

              {/*_.size(this.state.selected_filters) ? (
                <Row>
                  <Col span="12" style={{ marginTop: "10px" }}>
                    <span
                      className="text-metal "
                      style={{ marginRight: "10px", float: "left" }}
                    >
                      Filtered:{" "}
                    </span>
                    <span>{this.selectedFilter()}</span>
                  </Col>
                </Row>
              ) : null*/}
            </div>

            <Divider />

            {_.size(this.state.filteredChildWorkflow) ? (
              <Row className="text-metal">
                <Col span="10">Name</Col>
                <Col span="8" />
                <Col span="3">Status</Col>
                <Col span="3" />
              </Row>
            ) : null}

            <br />

            <div
              className="workflow-list workflows-list-embedded "
              style={{ margin: "2px" }}
            >
              <div>
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
                  />
                ) : (
                  <div>No related workflows</div>
                )}
              </div>
            </div>
          </div>
        )}
      </FormItem>
    );
  };
}

function mapPropsToState(state) {
  const { workflowDetailsHeader, workflowKind } = state;

  return {
    workflowDetailsHeader,
    workflowKind
  };
}

const ChildWorkflowFieldComponent = connect(mapPropsToState)(
  injectIntl(ChildWorkflowField2)
);

export const ChildWorkflowField = props => {
  return <ChildWorkflowFieldComponent {...props} />;
};
