import React, { Component } from "react";
import { Form, Input, Button, Icon } from "antd";
import { connect } from "react-redux";
import _ from "lodash";
import { getFieldType } from "./field-types";
import { workflowFieldActions } from "../../actions";

const FormItem = Form.Item;

class StepBody extends Component {
  constructor(props) {
    super(props);
  }

  handleSubmit = e => {
    e.preventDefault();
    console.log("submit");
  };

  onFieldChange = (e, payload) => {
    let answer_id = payload.field.answers[0].id;
    let data = {
      answer: e.target.value,
      answerId: answer_id,
      fieldId: payload.field.id,
      workflowId: payload.workflowId
    };

    if (payload.field.answers.length === 0) {
      this.props.dispatch(workflowFieldActions.saveField(data));
    } else {
      this.props.dispatch(workflowFieldActions.updateField(data));
    }
  };

  renderForm = stepData => {
    let that = this;
    return (
      <Form
        layout="vertical"
        onSubmit={this.handleSubmit}
        className="step-form"
      >
        {_.map(stepData.data_fields, function(f) {
          let wf_id =
            that.props.workflowDetails.workflowDetails.stepGroups.results[0]
              .workflow;
          let payload = {
            field: f,
            onFieldChange: that.onFieldChange,
            workflowId: wf_id
          };
          let field = getFieldType(payload);
          return field;
        })}

        <FormItem>
          <Button type="primary" htmlType="submit">
            Submit
          </Button>
        </FormItem>
      </Form>
    );
  };

  render = () => {
    const loading =
      this.props.currentStepFields.loading ||
      this.props.workflowDetails.loading;

    var stepData = null;
    if (!loading && this.props.currentStepFields) {
      stepData = this.props.currentStepFields.currentStepFields;
    } else {
      stepData = "no data";
    }
    return (
      <div className="pd-ard-lg">
        {loading ? (
          <div className="text-center mr-top-lg">
            <Icon type={"loading"} />
          </div>
        ) : stepData ? (
          this.renderForm(stepData)
        ) : (
          <div className="text-center mr-top-lg">
            <Icon type={"loading"} />
          </div>
        )}
      </div>
    );
  };
}

function mapStateToProps(state) {
  const { currentStepFields, workflowDetails } = state;
  return {
    currentStepFields,
    workflowDetails
  };
}

export default connect(mapStateToProps)(StepBody);
