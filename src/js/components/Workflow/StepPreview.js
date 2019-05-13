import React from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { Layout, Icon, Tooltip, Divider, Form } from "antd";
import { getFieldType } from "../WorkflowDetails/field-types";
import _ from "lodash";
import { IntlProvider, injectIntl } from "react-intl";

const FormItem = Form.Item;

class StepPreview extends React.Component {
  render() {
    let currentField = this.props.stepPreviewFields;

    let param = {
      currentStepFields: currentField,
      error: null,
      //onFieldChange: this.onFieldChange,
      workflowId: currentField.currentStepFields.workflow,
      formProps: this.props.form,
      //completed: !!this.props.stepData.completed_at,
      is_locked: true,
      //addComment: this.props.toggleSidebar,
      //changeFlag: this.props.changeFlag,
      //getIntegrationComments: this.props.getIntegrationComments,
      dispatch: this.props.dispatch,
      intl: this.props.intl,
      permission: [],
      dynamicUserPerms: []
    };

    const RenderField = () => {
      let body = (
        <Form
          layout="vertical"
          //hideRequiredMark={true}
          onSubmit={this.handleSubmit}
          className="step-form"
          autoComplete="off"
        >
          {_.map(currentField.currentStepFields.data_fields, field => {
            return (
              <div className="mr-bottom-sm">
                {getFieldType({ field: field, ...param })}
              </div>
            );
          })}
        </Form>
      );

      return body;
    };

    if (currentField.loading) {
      return (
        <div className="text-center mr-top">
          {" "}
          <Icon type="loading" />
        </div>
      );
    } else {
      let step = currentField.currentStepFields;
      return (
        <div>
          <div>
            <Link
              className="float-right"
              to={{
                pathname: "/workflows/instances/" + step.workflow,
                search: "?group=" + step.step_group + "&step=" + step.id,
                state: {
                  step: step.id,
                  group: step.step_group
                }
              }}
            >
              Go to step <Icon type="arrow-right" />
            </Link>
            <span className="text-metal text-medium">
              {currentField.currentStepFields.name}{" "}
            </span>
          </div>
          <Divider />
          <RenderField />
        </div>
      );
    }
  }
}

function mapPropsToState(state) {
  const { stepPreviewFields } = state;
  return {
    stepPreviewFields
  };
}

export default connect(mapPropsToState)(injectIntl(StepPreview));
