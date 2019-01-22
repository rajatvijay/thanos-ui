import React, { Component } from "react";
import { authHeader, baseUrl, handleResponse } from "../../../_helpers";
import { WorkflowHeader } from "../../Workflow/workflow-item";
import { connect } from "react-redux";
import {
  Form,
  Input,
  Button,
  Dropdown,
  Row,
  Menu,
  Col,
  Table,
  Icon,
  Divider,
  Select,
  Tag,
  Switch
} from "antd";
import _ from "lodash";
import { commonFunctions } from "./commons";
import { workflowKindActions, createWorkflow } from "../../../actions";

const FormItem = Form.Item;
const Option = Select.Option;
const { Column, ColumnGroup } = Table;
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

  getChildWorkflow = (parentId, kind, isChildWorkflow) => {
    const requestOptions = {
      method: "GET",
      headers: authHeader.get(),
      credentials: "include"
    };

    let parent_id = parentId;
    //let kind = this.props.field.definition.extra.child_workflow_kind_id;

    let url =
      baseUrl +
      "workflows-list/?parent_workflow_id=" +
      parent_id +
      "&kind=" +
      kind;

    if (isChildWorkflow) {
      this.setState({ fetchingChild: true });
    } else {
      this.setState({ fetching: true });
    }

    fetch(url, requestOptions)
      .then(response => response.json())
      .then(body => {
        if (isChildWorkflow) {
          this.setState({
            [parentId]: body.results,
            fetchingChild: false
          });
        } else {
          this.setState({
            childWorkflow: body.results,
            fetching: false
          });
        }
      });
  };

  getKindID = kindTag => {
    let kind = _.find(this.props.workflowKind.workflowKind, function(k) {
      return k.tag === kindTag;
    });
    return kind.id;
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
            return <Menu.Item key={item.tag}>{item.name}</Menu.Item>;
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
        >
          Add {this.state.fetching ? "loadin..." : ""}
          <i className="material-icons t-14">keyboard_arrow_down</i>
        </Button>
      </Dropdown>
    );

    return menu;
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
            <Row>
              <Col span="18">
                <span className="text-metal">Filters: </span>
              </Col>
              <Col span="6" className="text-right text-light small">
                {this.props.workflowDetailsHeader.workflowDetailsHeader
                  ? this.getAddMenu()
                  : null}
              </Col>
            </Row>
            <Divider />

            <Row className="text-metal">
              <Col span="7">Name</Col>
              <Col span="12">Alerts</Col>
              <Col span="2" />
              <Col span="3">Status</Col>
            </Row>

            <br />

            <div className="workflow-list workflows-list-embedded">
              <div className="paper">
                {_.size(this.state.childWorkflow) ? (
                  _.map(this.state.childWorkflow, function(workflow) {
                    return (
                      <ChildItem
                        workflow={workflow}
                        workflowKind={workflowKind}
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

  getKindID = kindTag => {
    let kind = null;
    console.log("this.props.workflowKind----");
    kind = _.find(this.props.workflowKind.workflowKind, function(k) {
      return k.tag === kindTag;
    });
    console.log(kind);

    if (kind) {
      return kind.id;
    } else {
      return;
    }
  };

  toggleExpand = (parent, kind) => {
    this.setState({ isExpanded: !this.state.isExpanded });
    if (!this.state.childWorkflow) {
      this.getWorkflows(parent, kind);
    }
  };

  componentDidUpdate = prevProps => {
    let rKind = null;
    if (this.props.workflowKind !== prevProps.workflowKind) {
      if (_.size(this.props.workflowKind.workflowKind)) {
        rKind = this.getKindID(this.props.workflow.definition.related_types[0]);
        this.setState({ kind: rKind });
      }
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
      "workflows-list/?parent_workflow_id=" +
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
    const { workflow, workflowKind } = props;
    const { isExpanded, kind, fetching } = this.state;

    return (
      <div class={"workflow-list-item " + (isExpanded ? "expanded " : "")}>
        <WorkflowHeader
          workflow={workflow}
          link={true}
          kind={""}
          statusView={true}
          isChild={true}
          hasChild={workflow.children_count}
          isEmbedded={true}
        />

        {workflow.children_count > 0 ? (
          <span
            className="child-workflow-expand text-anchor "
            onClick={that.toggleExpand.bind(that, workflow.id, kind)}
            title="Show child workflow"
          >
            <i
              className="material-icons t-18"
              style={{ verticalAlign: "middle" }}
            >
              {isExpanded ? "remove" : "add"}
            </i>
          </span>
        ) : null}

        {fetching ? (
          <div className="text-center pd-ard">loading...</div>
        ) : that.state.childWorkflow && isExpanded ? (
          <div className="pd-left-lg">
            {_.map(this.state.childWorkflow, function(child) {
              return <ChildItem workflow={child} workflowKind={kind} />;
            })}
          </div>
        ) : null}
      </div>
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
  ChildWorkflowField2
);

export const ChildWorkflowField = props => {
  return <ChildWorkflowFieldComponent {...props} />;
};
