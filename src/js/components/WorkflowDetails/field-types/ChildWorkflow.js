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
  getLink
} = commonFunctions;

class ChildWorkflowField2 extends Component {
  constructor() {
    super();
    this.state = {
      field: null,
      country: null,
      statusView: false
    };
  }

  componentDidMount = () => {
    let kind = this.props.field.definition.extra.child_workflow_kind_id;
    this.getChildWorkflow();
  };

  getChildWorkflow = () => {
    const requestOptions = {
      method: "GET",
      headers: authHeader.get(),
      credentials: "include"
    };

    let parent_id = this.props.workflowId;
    let kind = this.props.field.definition.extra.child_workflow_kind_id;

    let url =
      baseUrl +
      "workflows-list/?parent_workflow_id=" +
      parent_id +
      "&kind=" +
      kind;

    this.setState({ fetching: true });

    fetch(url, requestOptions)
      .then(response => response.json())
      .then(body => {
        this.setState({
          childWorkflow: body.results,
          fetching: false,
          relatedWorkflow: this.getRelatedTypes(body.results)
        });
      });
  };

  getGroupedData = children => {
    let grouped = _.groupBy(children, function(child) {
      return child.definition.kind;
    });
    return grouped;
  };

  toggleListView = status => {
    this.setState({ statusView: status });
  };

  getRelatedTypes = childWorkflow => {
    return _.map(childWorkflow, function(workflow) {
      let that = this;
      let rt = [];
      if (workflow.definition.related_types.length !== 0) {
        _.map(workflow.definition.related_types, function(rtc) {
          _.filter(that.props.workflowKind.workflowKind, function(kind) {
            if (kind.tag === rtc) {
              rt.push(kind);
            }
          });
        });
      }
      return rt;
    });
  };

  render = () => {
    let props = this.props;
    let { field } = props;
    let that = this;

    const menuItems = () => {
      const relatedKind = this.state.relatedWorkflow;
      return (
        <Menu onClick={props.onChildSelect}>
          {!_.isEmpty(relatedKind) ? (
            _.map(props.relatedKind, function(item, index) {
              return <Menu.Item key={item.tag}>{item.name}</Menu.Item>;
            })
          ) : (
            <Menu.Item disabled>No related workflow</Menu.Item>
          )}
        </Menu>
      );
    };

    const childWorkflowMenu = menuItems(props);

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
            <Col span="6" className="text-right text-light small">
              <Dropdown
                overlay={childWorkflowMenu}
                className="child-workflow-dropdown"
                placement="bottomRight"
              >
                <a className="ant-dropdown-link ant-btn secondary-btn" href="#">
                  Add <i className="material-icons t-14">keyboard_arrow_down</i>
                </a>
              </Dropdown>
            </Col>
            <div className="workflow-list">
              <div className="list-view-header">
                <div className="text-right list-toggle-btn">
                  <span className="pd-right t-14">Details view</span>
                  <Switch onChange={this.toggleListView} />
                  <span className="pd-left  t-14">Workflow view</span>
                </div>
              </div>
            </div>
            <br />
            <div className="paper">
              {_.size(this.state.childWorkflow) ? (
                _.map(this.state.childWorkflow, function(workflow) {
                  console.log(workflow, "workflow bench");
                  return (
                    <div class="workflow-list-item ">
                      <div class="collapse-wrapper">
                        <div class="Collapsible">
                          <span class="Collapsible__trigger is-closed">
                            <div class="ant-collapse-item ant-collapse-no-arrow lc-card">
                              <WorkflowHeader
                                workflow={workflow}
                                link={true}
                                kind={""}
                                statusView={that.state.statusView}
                              />
                            </div>
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })
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
  const { workflowKind, workflowFilterType, workflowChildren } = state;
  return {
    workflowKind,
    workflowFilterType,
    workflowChildren
  };
}

const ChildWorkflowFieldComponent = connect(mapPropsToState)(
  ChildWorkflowField2
);

export const ChildWorkflowField = props => {
  return <ChildWorkflowFieldComponent {...props} />;
};
