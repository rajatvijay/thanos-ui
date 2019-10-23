import React, { Component } from "react";
import { authHeader } from "../../../_helpers";
import { connect } from "react-redux";
import { Form, Icon } from "antd";
import _ from "lodash";
import { commonFunctions } from "./commons";
import { dunsFieldActions, workflowDetailsActions } from "../../../actions";
import { apiBaseURL } from "../../../../config";
import WorkflowList from "../../Workflow/workflow-list";
import { Pagination } from "antd";
import { FormattedMessage } from "react-intl";
import IntegrationLoadingWrapper from "../utils/IntegrationLoadingWrapper";

const FormItem = Form.Item;

const { getIntegrationSearchButton } = commonFunctions;

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
      error: null,
      currentPage: 1
    };
  }

  onSearch = () => {
    const payload = {
      workflow: this.props.workflowId,
      fieldId: this.props.field.id
    };

    this.props.dispatch(dunsFieldActions.dunsSaveField(payload), function() {
      this.getDuplicateWorkflow();
    });
  };

  componentDidMount = () => {
    if (this.props.field.integration_json.status_code !== "fetching") {
      this.getDuplicateWorkflow();
    }
    if (
      this.props.currentStepFields &&
      this.props.stepData &&
      this.props.stepData.id &&
      this.props.currentStepFields[this.props.stepData.id].currentStepFields
    ) {
      const {
        step_group: groupId,
        workflow: workflowId,
        id: stepId
      } = this.props.currentStepFields[
        this.props.stepData.id
      ].currentStepFields;
      this.props.dispatch(
        workflowDetailsActions.getStepFields(
          {
            workflowId,
            groupId,
            stepId
          },
          true,
          this.props.field.id
        )
      );
    }
  };

  componentDidUpdate = previousProps => {
    if (
      this.props.field.integration_json.status_code !==
        previousProps.field.integration_json.status_code &&
      this.props.field.integration_json.status_code !== "fetching"
    ) {
      // setTimeout(() => {
      this.getDuplicateWorkflow();
      // }, 1000);
    }
  };

  onPageChange = val => {
    this.setState({ currentPage: val });
    this.getDuplicateWorkflow(val);
  };

  fetchWorkflows = url => {
    this.setState({ fetching: true });
    const requestOptions = {
      method: "GET",
      headers: authHeader.get(),
      credentials: "include"
    };
    fetch(url, requestOptions)
      .then(response => response.json())
      .then(body => {
        this.setState({
          childWorkflow: body,
          fetching: false,
          error: null
        });
      })
      .catch(error => {
        this.setState({ error });
        console.log(error);
      });
  };

  getDuplicateWorkflow = page => {
    let pageNumber = page || 1;
    if (
      !_.size(this.props.field.integration_json) &&
      !_.size(this.props.field.integration_json.data)
    ) {
      return;
    }
    const duplicate_data = this.props.field.integration_json.data;

    let workflow_ids = [];

    _.map(duplicate_data, function(v, k) {
      if (_.size(v.workflow_id)) {
        workflow_ids = workflow_ids.concat(v.workflow_id);
      }
    });

    workflow_ids = workflow_ids.join(",");

    if (_.size(workflow_ids)) {
      const url =
        apiBaseURL +
        "workflows-list/?workflow_ids=" +
        workflow_ids +
        "&page=" +
        pageNumber +
        "&limit=100&lean=True";

      this.fetchWorkflows(url);
    } else {
      this.setState({ error: "No duplicates found" });
    }
  };

  render = () => {
    const { field, currentStepFields } = this.props;
    const { childWorkflow } = this.state;

    const props = {
      field: field,
      onSearch: this.onSearch,
      currentStepFields: this.props.currentStepFields,
      is_locked: this.props.is_locked,
      completed: this.props.completed,
      permission: this.props.permission
    };

    const finalHTML = (
      <IntegrationLoadingWrapper
        currentStepFields={currentStepFields}
        field={field}
        step={field.step}
        check={
          _.size(field.integration_json) && _.size(field.integration_json.data)
        }
      >
        <FormItem
          className={
            "from-label " +
            (_.size(props.field.selected_flag) ? " has-flag" : "")
          }
          style={{ display: "block" }}
          key={props.field.id}
        >
          {childWorkflow && childWorkflow.count ? (
            <div className="mr-bottom">
              {" "}
              <Pagination
                defaultCurrent={1}
                current={this.state.currentPage}
                total={childWorkflow.count}
                defaultPageSize={100}
                onChange={this.onPageChange}
              />
            </div>
          ) : null}

          {this.state.fetching ? (
            <div className="text-center mr-top-lg">
              <Icon type="loading" style={{ fontSize: 24 }} />
            </div>
          ) : _.size(this.state.error) ? (
            <div>
              <FormattedMessage id="workflowsInstances.noDuplicatesFound" />
            </div>
          ) : (
            <div className="workflow-list">
              {childWorkflow && childWorkflow.count ? (
                <WorkflowList
                  isEmbedded={true}
                  sortAscending={false}
                  {...this.props}
                  workflow={{ workflow: childWorkflow.results }}
                  statusView={true}
                  kind={""}
                  sortingEnabled={false}
                  workflowKind={""}
                  fieldExtra={field.definition.extra || null}
                  addComment={this.props.addComment}
                  // showCommentIcon={true}
                  // bulkActionWorkflowChecked={
                  //   this.state.bulkActionWorkflowChecked
                  // }
                  disableGrouping={true}
                  //handleChildWorkflowCheckbox={this.handleChildWorkflowCheckbox}
                />
              ) : (
                <div>
                  <FormattedMessage id="workflowsInstances.noDuplicatesFound" />
                </div>
              )}
            </div>
          )}
        </FormItem>
      </IntegrationLoadingWrapper>
    );

    return (
      <div>
        {getFields(props)} {finalHTML}
      </div>
    );
  };
}

function mapPropsToState(state) {
  const { currentStepFields, config } = state;
  return {
    currentStepFields,
    config
  };
}

const DuplicateCheckComponent = connect(mapPropsToState)(DuplicateCheckComp);

export const DuplicateCheck = props => {
  return <DuplicateCheckComponent {...props} />;
};
