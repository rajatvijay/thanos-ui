import React, { Component } from "react";
import { authHeader, baseUrl, handleResponse } from "../../../_helpers";
import { WorkflowHeader } from "../../Workflow/workflow-item";
import { connect } from "react-redux";

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
  Tooltip,
  Collapse
} from "antd";
import _ from "lodash";
import { commonFunctions } from "./commons";
import {
  dunsFieldActions,
  workflowStepActions,
  workflowDetailsActions
} from "../../../actions";

const FormItem = Form.Item;

//const dunsResponse = JSON.parse(dunsData);

const {
  getLabel,
  field_error,
  getRequired,
  feedValue,
  addCommentBtn,
  getIntegrationSearchButton
} = commonFunctions;

//Field Type DUNS SEARCH
const getFields = props => {
  return getIntegrationSearchButton(props);
};

//duns field
class DuplicateCheckComp extends Component {
  constructor() {
    super();
    this.state = {
      field: null,
      childWorkflow: null,
      fetching: false,
      error: null
    };
  }

  onSearch = () => {
    let payload = {
      workflow: this.props.workflowId,
      fieldId: this.props.field.id
    };

    this.props.dispatch(dunsFieldActions.dunsSaveField(payload), function() {
      this.getDuplicateWorkflow();
    });
  };

  componentDidMount = () => {
    this.getDuplicateWorkflow();
  };

  componentWillReceiveProps = nextProps => {
    let that = this;

    if (
      this.props.field.integration_json !== nextProps.field.integration_json
    ) {
      setTimeout(function() {
        that.getDuplicateWorkflow();
      }, 1000);
    }
  };

  getDuplicateWorkflow = () => {
    if (
      !_.size(this.props.field.integration_json) &&
      !_.size(this.props.field.integration_json.data)
    ) {
      return;
    }
    let duplicate_data = this.props.field.integration_json.data;
    const requestOptions = {
      method: "GET",
      headers: authHeader.get(),
      credentials: "include"
    };

    let workflow_ids = [];

    _.map(duplicate_data, function(v, k) {
      if (_.size(v.workflow_id)) {
        workflow_ids = workflow_ids.concat(v.workflow_id);
      }
    });

    workflow_ids = workflow_ids.join(",");

    if (_.size(workflow_ids)) {
      let url = baseUrl + "workflows-list/?workflow_ids=" + workflow_ids;
      this.setState({ fetching: true });

      fetch(url, requestOptions)
        .then(response => response.json())
        .then(body => {
          this.setState({
            childWorkflow: body.results,
            fetching: false
          });
        });
    } else {
      this.setState({ error: "No duplicates found" });
    }
  };

  render = () => {
    let { field } = this.props;
    const props = {
      field: field,
      onSearch: this.onSearch,
      currentStepFields: this.props.currentStepFields,
      is_locked: this.props.is_locked,
      completed: this.props.completed,
      permission: this.props.permission
    };
    let final_html = null;
    if (this.props.currentStepFields.integration_data_loading) {
      final_html = (
        <div>
          <div className="text-center mr-top-lg">
            <Icon type={"loading"} />
          </div>
        </div>
      );
    } else if (
      _.size(field.integration_json) &&
      _.size(field.integration_json.data)
    ) {
      final_html = (
        <FormItem
          className={
            "from-label " +
            (_.size(props.field.selected_flag) ? " has-flag" : "")
          }
          style={{ display: "block" }}
          key={props.field.id}
        >
          {this.state.fetching ? (
            <div className="text-center mr-top-lg">
              <Icon type="loading" style={{ fontSize: 24 }} />
            </div>
          ) : _.size(this.state.error) ? (
            <div className="">No duplicates found</div>
          ) : (
            <div className="workflow-list">
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
                                  statusView={true}
                                />
                              </div>
                            </span>
                          </div>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div>No duplicates found</div>
                )}
              </div>
            </div>
          )}
        </FormItem>
      );
    }

    return (
      <div>
        {getFields(props)} {final_html}
      </div>
    );
  };
}

function mapPropsToState(state) {
  const { currentStepFields } = state;
  return {
    currentStepFields
  };
}

const DuplicateCheckComponent = connect(mapPropsToState)(DuplicateCheckComp);

export const DuplicateCheck = props => {
  return <DuplicateCheckComponent {...props} />;
};
