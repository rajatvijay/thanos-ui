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
    let { field } = props;
    let that = this;

    console.log("this.props");
    console.log(this.state);

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
                    let gottenkind = null;
                    if (
                      workflow.children_count &&
                      that.props.workflowKind.workflowKind
                    ) {
                      gottenkind = that.getKindID(
                        workflow.definition.related_types[0]
                      );
                    }

                    return (
                      <div class="workflow-list-item">
                        <WorkflowHeader
                          workflow={workflow}
                          link={true}
                          kind={""}
                          statusView={true}
                          isChild={true}
                          hasChild={workflow.children_count}
                        />

                        {workflow.children_count > 0 ? (
                          <span
                            className="child-workflow-expande text-anchor "
                            onClick={that.getChildWorkflow.bind(
                              that,
                              workflow.id,
                              gottenkind,
                              true
                            )}
                            title="Show child workflow"
                          >
                            <i
                              className="material-icons"
                              style={{ verticalAlign: "middle" }}
                            >
                              {that.state.showRelatedWorkflow
                                ? "remove"
                                : "add"}
                            </i>
                          </span>
                        ) : null}

                        {that.state.fetchingChild ? (
                          <div>loading...</div>
                        ) : that.state[workflow.id] ? (
                          <div className="pd-left-lg">
                            <WorkflowHeader
                              workflow={that.state[workflow.id][0]}
                              link={true}
                              kind={""}
                              statusView={true}
                              isChild={true}
                              //hasChild={workflow.children_count}
                            />
                          </div>
                        ) : null}
                      </div>
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
