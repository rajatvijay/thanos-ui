import React, { Component } from "react";
import _ from "lodash";
import { Form, Divider, Row, Col, Alert, Button, Tooltip } from "antd";
import { workflowStepActions } from "../../actions";
import { userService } from "../../services";
import Moment from "react-moment";
import { getFieldType } from "./field-types";

const FormItem = Form.Item;

class StepBodyForm extends Component {
  state = {
    version: false
  };

  componentDidUpdate = prev => {
    if (
      this.props.stepVersionFields.loading !== prev.stepVersionFields.loading
    ) {
      if (this.props.stepVersionFields.stepVersionFields) {
        this.setState({ version: true });
      }
    }
  };

  versionToggle = () => {
    this.setState({ showVersion: !this.state.showVersion });
  };

  handleSubmit = e => {
    e.preventDefault();
    this.props.dispatch(
      workflowStepActions.submitStepData(
        this.props.currentStepFields.currentStepFields
      )
    );
  };

  ///////////////////////////////////////
  //ON Field Change save or update data//
  //////////////////////////////////////
  onFieldChange = (e, payload, calculated) => {
    //sanitize this function later
    /*if (
      _.size(payload.field.answers) &&
      payload.field.answers[0].answer == e.target.value
    ) {
      console.log("not calling");
      return false;
    }*/

    if (calculated === "file") {
      let method = "save";
      let data = {
        attachment: e,
        field: payload.field.id,
        workflow: payload.workflowId
      };

      this.callDispatch(data, method, payload);

      // console.log(e.target);
    } else if (calculated) {
      let method = "save";
      let data = {
        answer: e,
        field: payload.field.id,
        workflow: payload.workflowId
      };

      this.callDispatch(data, method, payload);
    } else if (e.target) {
      let method = "save";
      let data = {
        answer: e.target.value,
        field: payload.field.id,
        workflow: payload.workflowId
      };

      if (e.type == "blur") {
        this.props.dispatch(workflowStepActions.saveField(data, "blur"));
      } else {
        this.callDispatch(data, method, payload);
      }
    }
  };

  //////////////////////////////////////
  //Dispatch field update /save actions/
  callDispatch = (data, method, payload) => {
    console.log(payload.field.definition.field_type);

    let saveNowType = [
      "dnb_duns_search",
      "bool",
      "file",
      "list",
      "date",
      "checkbox",
      "single_select",
      "multi_select",
      "cascader"
    ];
    if (saveNowType.includes(payload.field.definition.field_type)) {
      this.props.dispatch(workflowStepActions.saveField(data));
    } else {
      this.dispatchDebounced(data, method);
    }
  };

  dispatchDebounced = _.debounce((data, method) => {
    this.props.dispatch(workflowStepActions.saveField(data));
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
    this.props.dispatch(workflowStepActions.approveStep(step));
  };

  onUndoStep = step => {
    this.props.dispatch(workflowStepActions.undoStep(step));
  };

  //Calculate step completions and approval
  getStepStatus = stepData => {
    const step = stepData;

    if (step.completed_at || step.approved_at) {
      //this.getUserById(step.completed_by, 'completed');

      //if(step.approved_at ){this.getUserById(step.approved_by, 'approved')};

      return (
        <Alert
          message={
            <div className="">
              <span
                className="float-right text-anchor text-underline "
                onClick={this.onUndoStep.bind(this, step)}
              >
                Undo completion
              </span>
              {/*
              <span className="float-right pd-right-sm pd-left-sm">|</span>
              <span
                              className="float-right text-anchor text-underline text-primary"
                              onClick={this.onApproveStep.bind(this, step)}
                            >
                              {step.approved_at ? "Undo approval" : "Approve step"}
                            </span>*/}

              {step.completed_at ? (
                <span>
                  Completed by{" "}
                  <span className="text-medium ">
                    {step.completed_by
                      ? step.completed_by.first_name
                      : step.completed_by.email
                        ? step.completed_by.email
                        : "..."}
                  </span>{" "}
                  <Moment format="MM/DD/YYYY">{step.completed_at}</Moment>
                </span>
              ) : null}

              {/*
              {step.approved_at ? (
                <span>
                  {" "}
                  and approved by{" "}
                  <span className="text-medium ">
                    this.state.stepApprovedBy
                      ? this.state.stepApprovedBy.first_name
                      : "..."
                    ...
                  </span>{" "}
                  on <Moment format="MM/DD/YYYY">{step.approved_at}</Moment>
                </span>
              ) : null}
                  */}
            </div>
          }
          type="success"
          showIcon
        />
      );
    } else if (step.updated_at) {
      return (
        <Alert
          className="animated-long"
          message={
            <div className="">
              Last updated <Moment fromNow>{step.updated_at}</Moment>{" "}
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

  getFiledTypeRelatedVersionResponse = field => {
    switch (field.definition.type) {
      case "paragraph":
        return " ";
      case "bool":
        if (field.answers[0].answer === "true") {
          return "yes";
        } else {
          return "no";
        }
      case "break":
        return "";

      default:
        return field.answers[0].answer;
    }
  };

  getVersionField = fieldId => {
    let data = this.props.stepVersionFields.stepVersionFields.data_fields;

    let fieldReturn = _.find(data, function(field) {
      if (field.id === parseInt(fieldId)) {
        return field;
      }
    });

    return (
      <div className="version-item">
        <span className="float-right">
          <Tooltip
            placement="topRight"
            title={
              "completed by " +
              this.props.stepVersionFields.stepVersionFields.completed_by.email
            }
          >
            <i className="material-icons t-14 text-middle text-light">
              history
            </i>
          </Tooltip>
        </span>
        <div className="text-medium mr-bottom-sm">
          {fieldReturn ? fieldReturn.definition.body : ""}
        </div>
        {fieldReturn && fieldReturn.answers.length !== 0
          ? fieldReturn.answers[0] ? fieldReturn.answers[0].answer : " "
          : " "}
      </div>
    );
  };

  render = () => {
    let that = this;
    let row = [];
    let errors = this.props.currentStepFields.error;
    let currentStepFields = this.props.currentStepFields;
    let v =
      !_.isEmpty(this.props.stepVersionFields.stepVersionFields) &&
      this.props.showVersion;

    return (
      <Form
        layout="vertical"
        //hideRequiredMark={true}
        onSubmit={this.handleSubmit}
        className="step-form"
        autoComplete="off"
      >
        {v ? (
          <div className=" mr-bottom">
            <div className="version-item">
              <span className="float-right">
                <Tooltip placement="topRight" title={"Hide version"}>
                  <span
                    className="text-anchor"
                    onClick={this.props.versionToggle}
                  >
                    <i className="material-icons t-14 text-middle text-light ">
                      close
                    </i>
                  </span>
                </Tooltip>
              </span>
              <div className="text-medium mr-bottom-sm">
                Version submitted on{" "}
                <Moment format="MM/DD/YYYY">
                  <b>
                    {" "}
                    {
                      this.props.stepVersionFields.stepVersionFields
                        .completed_at
                    }
                  </b>
                </Moment>{" "}
                by {"  "}
                {
                  this.props.stepVersionFields.stepVersionFields.completed_by
                    .email
                }
              </div>
            </div>
          </div>
        ) : null}

        {_.map(
          _.orderBy(
            this.props.stepData.data_fields,
            [{ orderBy: Number }],
            ["asc"]
          ),
          function(f, index) {
            let wf_id =
              that.props.workflowDetails.workflowDetails.stepGroups.results[0]
                .workflow;
            let param = {
              field: f,
              currentStepFields: currentStepFields,
              error: errors,
              onFieldChange: that.onFieldChange,
              workflowId: wf_id,
              formProps: that.props.form,
              completed: that.props.stepData.completed_at ? true : false,
              is_locked: that.props.stepData.is_locked,
              addComment: that.props.toggleSidebar,
              getIntegrationComments: that.props.getIntegrationComments,
              dispatch: that.props.dispatch
            };

            // console.log('param---------')
            // console.log(param)

            let field = getFieldType(param);

            ///row size method
            //todo: clean up this mess
            if (row.length === 2) {
              row = [];
            }

            if (f.definition.size === 3) {
              //If size is 50%

              if (index === that.props.stepData.data_fields.length - 1) {
                row.push(field);

                return (
                  <Row gutter={16}>
                    {_.map(row, function(col) {
                      return (
                        <Col span={12}>
                          {col} {v ? that.getVersionField(col.key) : ""}{" "}
                        </Col>
                      );
                    })}
                  </Row>
                );
              } else {
                row.push(field);
                if (row.length === 2) {
                  return (
                    <Row gutter={16}>
                      {_.map(row, function(col) {
                        return (
                          <Col span={12}>
                            {col} {v ? that.getVersionField(col.key) : null}
                          </Col>
                        );
                      })}
                    </Row>
                  );
                }
              }
            } else if (f.definition.size === 1) {
              if (!_.isEmpty(row)) {
                row.push(field);
                let bow = (
                  <div>
                    {_.map(row, function(r, index) {
                      return (
                        <Row gutter={16}>
                          <Col span={index === 0 ? "12" : "24"}>
                            {r} {v ? that.getVersionField(r.key) : null}
                          </Col>
                        </Row>
                      );
                    })}
                  </div>
                );
                row = [];
                return bow;
              } else {
                return (
                  <Row gutter={16}>
                    <Col span="24">
                      {field} {v ? that.getVersionField(field.key) : null}
                    </Col>
                  </Row>
                );
              }
            }
            //return field;
            //ends
          }
        )}

        <Divider />
        <Row>
          <Col span="18">{this.getStepStatus(this.props.stepData)}</Col>
          <Col span="6" className="text-right">
            {this.props.stepData.completed_at ||
            this.props.stepData.is_locked ? null : (
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
