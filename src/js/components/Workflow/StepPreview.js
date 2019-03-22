import React from "react";
import { connect } from "react-redux";
import { Layout, Icon, Tooltip, Divider, Form } from "antd";
import { Link } from "react-router-dom";
import { getFieldType } from "../WorkflowDetails/field-types";
import _ from "lodash";
import { IntlProvider, injectIntl } from "react-intl";

const FormItem = Form.Item;

class StepPreview extends React.Component {
  componentDidMount() {
    console.log("this.props-----");
    console.log(this.props);
  }

  render() {
    let currentField = this.props.currentStepFields;

    let param = {
      currentStepFields: this.props.currentStepFields,
      error: null,
      //onFieldChange: this.onFieldChange,
      workflowId: this.props.workflowId,
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

    if (this.props.currentStepFields.loading) {
      return <div className="text-center mr-top">loading...</div>;
    } else {
      return (
        <div>
          <Link to={"/workflows/instances/" + this.props.workflowId}>Edit</Link>
          <Divider />
          <RenderField />
        </div>
      );
    }
  }
}

function mapPropsToState(state) {
  const { currentStepFields } = state;
  return {
    currentStepFields
  };
}

export default connect(mapPropsToState)(injectIntl(StepPreview));
