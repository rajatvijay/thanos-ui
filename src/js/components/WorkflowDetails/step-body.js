import React, { Component } from "react";
import { Form, Input, Button, Icon, Row, Col, Alert, Divider } from "antd";
import Moment from "react-moment";
import { connect } from "react-redux";
import _ from "lodash";
import { getFieldType } from "./field-types";
import { workflowStepActions } from "../../actions";
import { userService } from "../../services";

const FormItem = Form.Item;

class StepBody extends Component {
  constructor(props) {
    super(props);
    this.state = {
      stepCompletedBy: null,
      stepApprovedBy: null
    };
  }

  handleSubmit = e => {
    e.preventDefault();
    this.props.dispatch(
      workflowStepActions.submitStepData(
        this.props.currentStepFields.currentStepFields
      )
    );
  };

  onFieldChange = (e, payload) => {
    console.log("payload------>");
    console.log(payload);

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
  };

  callDispatch = _.debounce((data, method) => {
    if (method === "save") {
      this.props.dispatch(workflowStepActions.saveField(data));
    } else {
      this.props.dispatch(workflowStepActions.updateField(data));
    }
  }, 1000);

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
                    {this.state.stepCompletedBy
                      ? this.state.stepCompletedBy.first_name
                      : "..."}
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

  renderForm = stepData => {
    let that = this;

    return (
      <Form
        layout="vertical"
        //hideRequiredMark={true}
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

        <Divider />
        <Row>
          <Col span="18">{this.getStepStatus(stepData)}</Col>
          <Col span="6" className="text-right">
            {stepData.completed_at ? null : (
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
