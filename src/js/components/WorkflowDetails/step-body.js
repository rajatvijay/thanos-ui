import React, { Component } from "react";
import { Form, Input, Button, Icon } from "antd";
import { connect } from "react-redux";
import _ from "lodash";
import { getFieldType } from "./field-types";

const FormItem = Form.Item;

class StepBody extends Component {
  constructor(props) {
    super(props);
  }

  renderField() {
    return <div>ewfsdf</div>;
  }

  handleSubmit(e) {
    e.preventDefault();
    console.log("submit");
  }

  renderForm(stepData) {
    return (
      <Form
        layout="vertical"
        onSubmit={this.handleSubmit}
        className="step-form"
      >
        {_.map(stepData.data_fields, function(f) {
          let field = getFieldType(f);
          return field;
        })}

        <FormItem>
          <Button type="primary" htmlType="submit">
            Submit
          </Button>
        </FormItem>
      </Form>
    );
  }

  render() {
    const loading =
      this.props.currentStepFields.loading ||
      this.props.workflowDetails.loading;

    var stepData = null;
    if (!loading && this.props.currentStepFields) {
      stepData = this.props.currentStepFields.currentStepFields;
    } else {
      stepData = "dddlll";
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
  }
}

function mapStateToProps(state) {
  const { currentStepFields, workflowDetails } = state;
  return {
    currentStepFields,
    workflowDetails
  };
}

export default connect(mapStateToProps)(StepBody);
