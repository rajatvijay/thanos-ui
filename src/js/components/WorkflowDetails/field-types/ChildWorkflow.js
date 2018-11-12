import React, { Component } from "react";
import { authHeader, baseUrl, handleResponse } from "../../../_helpers";
import { WorkflowHeader } from "../../Workflow/workflow-item";
import {
  Form,
  Input,
  Button,
  Row,
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
import { ChildWorkflow } from "../../Workflow/workflow-list";

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
        this.setState({ childWorkflow: body.results, fetching: false });
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

  render = () => {
    let props = this.props;
    let { field } = props;
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
          <div className="workflow-list">
            <div className="list-view-header">
              <div className="text-right list-toggle-btn">
                <span className="pd-right t-14">Details view</span>
                <Switch onChange={this.toggleListView} />
                <span className="pd-left  t-14">Workflow view</span>
              </div>
            </div>
            <br />
            <div className="paper">
              {_.size(this.state.childWorkflow) ? (
                _.map(this.state.childWorkflow, function(workflow) {
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

export const ChildWorkflowField = props => {
  return <ChildWorkflowField2 {...props} />;
};
