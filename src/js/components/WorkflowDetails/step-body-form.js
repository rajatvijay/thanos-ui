import React, { Component } from "react";
import { connect } from "react-redux";
import _ from "lodash";
import { Form, Divider, Row, Col, Alert, Button } from "antd";
import { workflowStepActions } from "../../actions";
import { userService } from "../../services";
import Moment from "react-moment";
import { getFieldType } from "./field-types";

const FormItem = Form.Item;

class StepBodyForm extends Component {
  handleSubmit = e => {
    e.preventDefault();
    this.props.dispatch(
      workflowStepActions.submitStepData(
        this.props.currentStepFields.currentStepFields
      )
    );
  };

  onFieldChange = (e, payload, calculated) => {
    //sanitize this function later
    if (calculated === "file") {
      console.log("file type");
      console.log(e, payload);

      let method = "save";
      let data = {
        attachment: e,
        field: payload.field.id,
        workflow: payload.workflowId
      };

      if (payload.field.answers.length !== 0) {
        method = "update";
        data.answerId = payload.field.answers[0].id;
      }

      this.callDispatch(data, method);

      // console.log(e.target);
    } else if (calculated) {
      let method = "save";
      let data = {
        answer: e,
        field: payload.field.id,
        workflow: payload.workflowId
      };

      if (payload.field.answers.length !== 0) {
        method = "update";
        data.answerId = payload.field.answers[0].id;
      }
      this.callDispatch(data, method);
    } else if (e.target) {
      let method = "save";
      let data = {
        answer: e.target.value,
        field: payload.field.id,
        workflow: payload.workflowId
      };

      if (payload.field.answers.length !== 0) {
        method = "update";
        data.answerId = payload.field.answers[0].id;
      }

      this.callDispatch(data, method);
    }
  };

  callDispatch = _.debounce((data, method) => {
    if (method === "save") {
      this.props.dispatch(workflowStepActions.saveField(data));
    } else {
      this.props.dispatch(workflowStepActions.updateField(data));
    }
  }, 1500);

  getUserById = (id, status) => {
    let that = this;
    userService.getById(id).then(
      function(result, error) {
        if (status === "completed") {
          that.setState({ stepCompletedBy: result });
        } else if (status === "approved") {
          that.setState({ stepApprovedBy: result });
        } else {
          return "...";
        }
      },
      function(error) {
        console.log(error);
        //notify eorro;
      }
    );
  };

  onApproveStep = step => {
    //console.log(this.props, step)
    this.props.dispatch(workflowStepActions.approveStep(step));
  };

  getStepStatus = stepData => {
    const step = stepData;
    // step.completed_at = "12 march 2018";
    // step.completed_by = "Jagmeet Lamba";

    if (step.completed_at || step.approved_at) {
      //this.getUserById(step.completed_by, 'completed');

      //if(step.approved_at ){this.getUserById(step.approved_by, 'approved')};

      return (
        <Alert
          message={
            <div className="">
              <span className="float-right text-anchor text-underline text-primary">
                Undo completion
              </span>
              <span className="float-right pd-right-sm pd-left-sm">|</span>
              <span
                className="float-right text-anchor text-underline text-primary"
                onClick={this.onApproveStep.bind(this, step)}
              >
                {step.approved_at ? "Undo approval" : "Approve step"}
              </span>

              {step.completed_at ? (
                <span>
                  Completed by{" "}
                  <span className="text-medium ">
                    ...
                    {/*this.state.stepCompletedBy
                      ? this.state.stepCompletedBy.first_name
                      : "..."*/}
                  </span>{" "}
                  on <Moment format="MM/DD/YYYY">{step.completed_at}</Moment>
                </span>
              ) : null}

              {step.approved_at ? (
                <span>
                  {" "}
                  and approved by{" "}
                  <span className="text-medium ">
                    {this.state.stepApprovedBy
                      ? this.state.stepApprovedBy.first_name
                      : "..."}
                  </span>{" "}
                  on <Moment format="MM/DD/YYYY">{step.approved_at}</Moment>
                </span>
              ) : null}
            </div>
          }
          type="success"
          showIcon
        />
      );
    } else if (step.updated_at) {
      return (
        <Alert
          message={
            <div className="">
              Last updated at{" "}
              <Moment format="MM/DD/YYYY">{step.updated_at}</Moment>{" "}
            </div>
          }
          type="info"
          showIcon
        />
      );
    } else {
      return <span />;
    }
  };

  render = () => {
    let that = this;
    const { getFieldDecorator } = this.props.form;

    return (
      <Form
        layout="vertical"
        //hideRequiredMark={true}
        onSubmit={this.handleSubmit}
        className="step-form"
      >
        {console.log("this.props.stepData-------")}
        {console.log(this.props.stepData)}

        {_.map(this.props.stepData.data_fields, function(f) {
          let wf_id =
            that.props.workflowDetails.workflowDetails.stepGroups.results[0]
              .workflow;
          let param = {
            field: f,
            onFieldChange: that.onFieldChange,
            workflowId: wf_id,
            formProps: that.props.form,
            completed: that.props.stepData.completed_at ? true : false
          };
          let field = getFieldType(param);

          return field;
        })}

        <Divider />
        <Row>
          <Col span="18">{this.getStepStatus(this.props.stepData)}</Col>
          <Col span="6" className="text-right">
            {this.props.stepData.completed_at ? null : (
              <FormItem>
                <Button type="primary" htmlType="submit">
                  Submit
                </Button>
              </FormItem>
            )}
          </Col>
        </Row>
      </Form>
    );
  };
}

const WrappedStepBodyForm = Form.create()(StepBodyForm);

export default WrappedStepBodyForm;
