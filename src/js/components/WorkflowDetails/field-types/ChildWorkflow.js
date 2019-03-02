import React, { Component } from "react";
import { authHeader, baseUrl, handleResponse } from "../../../_helpers";
import Collapsible from "react-collapsible";
import { WorkflowHeader, WorkflowBody } from "../../Workflow/workflow-item";
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

const getKindName = (kindId, workflowKinds) => {
  let kind = _.find(workflowKinds, function(k) {
    return k.id === parseInt(kindId, 10);
  });

  if (kind) {
    return kind.name;
  } else {
    return;
  }
};

class ChildWorkflowField2 extends Component {
  constructor() {
    super();
    this.state = {
      field: null,
      country: null,
      statusView: true,
      kindChecked: false,
      showRelatedWorkflow: false
    };
  }

  componentDidMount = () => {
    let kind = this.props.field.definition.extra.child_workflow_kind_id;
    this.getChildWorkflow(this.props.workflowId, kind);

    if (
      !_.size(this.props.workflowKind.workflowKind) &&
      this.state.kindChecked === false
    ) {
      this.props.dispatch(workflowKindActions.getAll());
      this.setState({ kindChecked: true });
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

    let parent_id = parentId;
    //let kind = this.props.field.definition.extra.child_workflow_kind_id;

    let url =
      baseUrl +
      "workflows-list/?limit=100&parent_workflow_id=" +
      parent_id +
      "&kind=" +
      kind;

    this.setState({ fetching: true });

    fetch(url, requestOptions)
      .then(response => response.json())
      .then(body => {
        this.setState({
          childWorkflow: body.results,
          filteredChildWorkflow: body.results,
          fetching: false
        });
        this.createStatusFilterTag();
        this.createFilterTag();
        this.filterByFlag();
      });
  };

  getGroupedData = children => {
    let grouped = _.groupBy(children, function(child) {
      return child.definition.kind;
    });
    return grouped;
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
      if (item.is_related_kind && _.includes(item.features, "add_workflow")) {
        workflowKindFiltered.push(item);
      }
    });

    let menu = (
      <Menu onClick={this.onChildSelect}>
        {!_.isEmpty(workflowKindFiltered) ? (
          _.map(workflowKindFiltered, function(item, index) {
            if (
              that.props.field.definition.extra.child_workflow_kind_id ===
              item.id
            ) {
              return <Menu.Item key={item.tag}>{item.name}</Menu.Item>;
            }
          })
        ) : (
          <Menu.Item disabled>No related workflow kind</Menu.Item>
        )}
      </Menu>
    );

    return menu;
  };

  getAddMenu = () => {
    let menu = (
      <Dropdown
        overlay={this.getKindMenu()}
        className="child-workflow-dropdown"
        placement="bottomRight"
        //disabled={isDisabled(this.props)}
      >
        <Button
          type="primary"
          loading={this.props.workflowKind.loading ? true : false}
          className="btn-o"
        >
          + create new {this.state.fetching ? "loadin..." : ""}
          <i className="material-icons t-14">keyboard_arrow_down</i>
        </Button>
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
        placeholder="Filter by Adjudication Code"
        onChange={that.onFilterTagChange.bind(that, "flag")}
        style={{ width: "150px" }}
      >
        {_.map(that.state.childWorkflow[0].comment_flag_options, function(
          v,
          k
        ) {
          return <Option value={v.label}>{v.label}</Option>;
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
      <div>
        {_.map(workflow_status_count, function(v, k) {
          return (
            <Tag
              key={v}
              className="alert-tag-item alert-metal"
              onClick={that.onFilterTagChange.bind(that, k, "status")}
            >
              <Tooltip title={k}>
                <span className="ellip-small s50">{k} </span>
                <span className="ellip-small s50">({v}) </span>
              </Tooltip>
            </Tag>
          );
        })}
      </div>
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
        {_.map(filter_tag_count, function(v, k) {
          return (
            <Tag
              key={v + k}
              className="alert-tag-item alert-metal"
              onClick={that.onFilterTagChange.bind(that, k, "category")}
            >
              <Tooltip title={k}>
                <span className="ellip-small s50">{k} </span>
                <span className="ellip-small s50">({v}) </span>

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
            </Tag>
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
    console.log(tag, _type);
    let filtered_workflow = this.state.filteredChildWorkflow;
    if (this.state.status_workflow_map[tag] && _type == "status") {
      filtered_workflow = this.state.status_workflow_map[tag];
      this.state.filteredChildWorkflow = filtered_workflow;
      this.setState({
        filteredChildWorkflow: filtered_workflow,
        filterTags: null
      });
      this.createFilterTag();
      this.filterByFlag();
    } else if (_type == "category") {
      filtered_workflow = this.state.tag_workflow_map[tag];
      this.setState({ filteredChildWorkflow: filtered_workflow });
      this.filterByFlag();
    } else if (tag == "flag") {
      console.log(this.state.flag_workflow_map, _type);
      filtered_workflow = this.state.flag_workflow_map[_type];
      this.state.filteredChildWorkflow = filtered_workflow;
      this.setState({ filteredChildWorkflow: filtered_workflow });
    }
  };

  // expandChildWorkflow = () => {
  //   this.setState({ showRelatedWorkflow: !this.state.showRelatedWorkflow });

  //   this.props.dispatch(
  //     workflowActions.getChildWorkflow(this.props.workflow.id)
  //   );
  // };

  render = () => {
    let props = this.props;
    let { field, workflowKind } = props;
    let that = this;

    //const childWorkflowMenu = this.getKindMenu();
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
            <Row className="mr-bottom">
              <Col span="18">
                <span
                  className="text-metal"
                  style={{ marginRight: "10px", float: "left" }}
                >
                  Status:{" "}
                </span>
                <span>{this.state.statusfilterTags}</span>
              </Col>
            </Row>

            <Row className="mr-bottom">
              <Col span="18">
                <span className="text-metal text-bold t-12 ellip-small s100 pd-right-sm float-left">
                  <FormattedMessage id="commonTextInstances.categoryText" />:
                </span>
                <span>{this.state.filterTags}</span>
              </Col>
              <Col span="6" className="text-right text-light small">
                {this.props.workflowDetailsHeader.workflowDetailsHeader
                  ? this.getAddMenu()
                  : null}
              </Col>
            </Row>

            <Row>
              <Col span="12">
                <span
                  className="text-metal"
                  style={{ marginRight: "10px", float: "left" }}
                >
                  Adjudication Code:{" "}
                </span>
                <span>{this.createFlagFilter()}</span>
              </Col>

              <Col
                span="12"
                className="text-right"
                style={{ marginTop: "10px" }}
              >
                <span
                  onClick={this.getChildWorkflow}
                  className="text-anchor text-secondary"
                >
                  Reload
                </span>
              </Col>
            </Row>

            <Divider />

            <Row className="text-metal">
              <Col span="10">Name</Col>
              <Col span="9" />
              <Col span="2">Status</Col>
              <Col span="3" />
            </Row>

            <br />

            <div className="workflow-list workflows-list-embedded">
              <div className="paper" style={{ padding: "7px" }}>
                {_.size(this.state.filteredChildWorkflow) ? (
                  _.map(this.state.filteredChildWorkflow, function(workflow) {
                    return (
                      <ChildItem
                        key={workflow.id}
                        workflow={workflow}
                        field={field}
                        currentStepFields={props.currentStepFields}
                        workflowKind={workflowKind}
                        addComment={props.addComment}
                      />
                    );
                  })
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

class ChildItem extends Component {
  constructor() {
    super();
    this.state = {
      hasChild: false,
      isExpanded: false,
      childWorkflow: null,
      kind: null
    };
  }

  componentDidMount = () => {
    //this.setKind();
  };

  toggleExpand = (parent, kind) => {
    this.setState({ isExpanded: !this.state.isExpanded });
    if (!this.state.childWorkflow) {
      this.getWorkflows(parent, kind);
    }
  };

  setKind = () => {
    let rKind = null;

    console.log("workflow-->" + this.props.workflow);
    console.log(this.props.workflow.definition.related_types[0]);

    let workflowKind = this.props.workflowKind.workflowKind;
    if (_.size(workflowKind)) {
      rKind = getKindID(
        this.props.workflow.definition.related_types[0],
        workflowKind
      );
      this.setState({ kind: rKind });
      console.log(rKind);
    }
  };

  componentDidUpdate = prevProps => {
    if (
      this.props.workflowKind !== prevProps.workflowKind ||
      (this.props.workflowKind && !this.state.kind)
    ) {
      this.setKind();
    }
  };

  getWorkflows = (parent, kind) => {
    let resp = { fetching: true };

    const requestOptions = {
      method: "GET",
      headers: authHeader.get(),
      credentials: "include"
    };

    let url =
      baseUrl +
      "workflows-list/?limit=100&parent_workflow_id=" +
      parent +
      "&kind=" +
      kind;

    this.setState({ fetching: true });

    fetch(url, requestOptions)
      .then(response => {
        if (response.ok) {
          return response.json();
        } else {
          throw new Error("Something went wrong");
        }
      })
      .then(body => {
        this.setState({ fetching: false, childWorkflow: body.results });
      })
      .catch(error => {
        this.setState({ fetching: false, error: error });
        console.log(error);
      });
  };

  render = () => {
    let that = this;
    let props = this.props;
    const { workflow, workflowKind, field } = props;
    const { isExpanded, kind, fetching } = this.state;

    let groupedChildren = null;
    if (this.state.childWorkflow) {
      groupedChildren = _.groupBy(this.state.childWorkflow, function(child) {
        return child.definition.kind;
      });

      console.log("this.groupedChildren");
      console.log(groupedChildren);
    }

    return (
      <div className={"workflow-list-item " + (isExpanded ? "expanded " : "")}>
        <div className="collapse-wrapper">
          <Collapsible
            trigger={
              <div className="ant-collapse-item ant-collapse-no-arrow lc-card">
                <WorkflowHeader
                  workflow={workflow}
                  field={field}
                  link={true}
                  kind={""}
                  statusView={true}
                  isChild={true}
                  hasChild={workflow.children_count}
                  isEmbedded={true}
                  showCommentIcon={true}
                  addComment={props.addComment}
                  currentStepFields={props.currentStepFields}
                />
              </div>
            }
            lazyRender={true}
            transitionTime={200}
            onOpen={this.onOpen}
            onClose={this.onClose}
            //hasChildren={hasChildren}
          >
            <div className="lc-card">
              <WorkflowBody
                isChild={true}
                //relatedKind={this.state.relatedWorkflow}
                //onChildSelect={this.onChildSelect}
                workflow={workflow}
                //ondata={this.ondata}
                statusView={true}
                pData={getProcessedData(workflow.step_groups)}
              />
            </div>
          </Collapsible>

          {fetching ? (
            <div className="text-center pd-ard">loading...</div>
          ) : that.state.childWorkflow && isExpanded ? (
            <div className="child-container">
              <ChildCollapse
                groupedChildren={groupedChildren}
                workflowKind={workflowKind}
                kind={kind}
              />
            </div>
          ) : null}

          {workflow.children_count > 0 ? (
            <span
              className="child-workflow-expand text-anchor "
              onClick={that.toggleExpand.bind(that, workflow.id, kind)}
              title="Show related workflow"
            >
              {kind ? (
                <i
                  className="material-icons t-16"
                  style={{ verticalAlign: "middle" }}
                >
                  {isExpanded ? "remove" : "add"}
                </i>
              ) : workflow.children_count > 0 ? (
                <Icon type="loading" style={{ fontSize: 12 }} />
              ) : null}
            </span>
          ) : null}
        </div>
      </div>
    );
  };
}

const ChildCollapse = props => {
  const customPanelStyle = {
    borderRadius: 0,
    border: 0,
    overflow: "hidden",
    backgroud: "#FFF"
  };

  return (
    <div
      defaultActiveKey={Object.keys(props.groupedChildren)}
      bordered={false}
      className="embed-child-collapse"
    >
      {_.map(props.groupedChildren, function(group, key) {
        return (
          <Collapsible
            trigger={
              <div className="text-metal">
                <b>{getKindName(key, props.workflowKind.workflowKind)}</b>
              </div>
            }
            lazyRender={true}
            transitionTime={200}
            open={true}
          >
            {_.map(group, function(child, key) {
              return (
                <ChildItem
                  key={child.id}
                  workflow={child}
                  workflowKind={props.kind}
                />
              );
            })}
          </Collapsible>
        );
      })}
    </div>
  );
};

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
