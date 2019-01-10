import React, { Component } from "react";
import _ from "lodash";
import { Form, Divider, Row, Col, Alert, Button, Tooltip, Tabs } from "antd";
import { workflowStepActions } from "../../actions";
import { userService } from "../../services";
import Moment from "react-moment";
import { getFieldType } from "./field-types";
import { FormattedMessage } from "react-intl";

const FormItem = Form.Item;
const TabPane = Tabs.TabPane;

class StepBodyForm extends Component {
  state = {
    version: false
  };

  getWorkflowId = () => {
    let path = document.location.pathname;
    let pathLast = path.split("/")[3];
    let workflowID = pathLast.split("?")[0];
    return workflowID;
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
        answer: e || "",
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

  getComletedBy = step => {
    let completed_by = null;
    if (step.completed_by.first_name !== "") {
      completed_by = step.completed_by.first_name;
    } else if (step.completed_by.email !== "") {
      completed_by = step.completed_by.email;
    } else {
      completed_by = "...";
    }

    return (
      <span className="text-secondary pd-right-sm ">
        <i className="material-icons pd-right-sm t-20 text-bottom">
          check_circle_outline
        </i>
        Submitted by <span className="text-medium ">{completed_by}</span> on{" "}
        <Moment format="MM/DD/YYYY">{step.completed_at}</Moment>
      </span>
    );
  };

  //Calculate step completions and approval
  getStepStatus = stepData => {
    const step = stepData;
    let editable = step.is_editable !== undefined ? step.is_editable : true;

    if ((step.completed_at || step.approved_at) && editable) {
      //this.getUserById(step.completed_by, 'completed');

      //if(step.approved_at ){this.getUserById(step.approved_by, 'approved')};

      return (
        <div className=" step-status-box pd-top-sm">
          {step.completed_at ? this.getComletedBy(step) : null}

          {_.includes(this.props.permission, "Can undo a step") ? (
            <span>
              <Divider type="vertical" />
              <span
                className="text-anchor text-secondary text-underline pd-left-sm"
                onClick={this.onUndoStep.bind(this, step)}
              >
                Undo submission
              </span>
            </span>
          ) : null}

          {/*
              <span className="float-right pd-right-sm pd-left-sm">|</span>
              <span
                  className="float-right text-anchor text-underline text-primary"
                  onClick={this.onApproveStep.bind(this, step)}
                >
                  {step.approved_at ? "Undo approval" : "Approve step"}
                </span>
              */}

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
      );
    } else if (step.updated_at) {
      {
        /**  return (
        <Alert
          className="animated-long page-break"
          message={
            <div className="">
              Last updated <Moment fromNow>{step.updated_at}</Moment>{" "}
            </div>
          }
          type="info"
          showIcon
        />
      )**/
      }
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
          {this.props.stepVersionFields.stepVersionFields.completed_by ? (
            <Tooltip
              placement="topRight"
              title={
                "Submitted by " +
                this.props.stepVersionFields.stepVersionFields.completed_by
                  .email
              }
            >
              <i className="material-icons t-14 text-middle text-light">
                history
              </i>
            </Tooltip>
          ) : (
            <span>
              <i className="material-icons t-14 text-middle text-light">
                history
              </i>
            </span>
          )}
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
    let editable =
      this.props.currentStepFields.currentStepFields.is_editable !== undefined
        ? this.props.currentStepFields.currentStepFields.is_editable
        : true;

    let orderedStep = _.orderBy(
      this.props.stepData.data_fields,
      [{ orderBy: Number }],
      ["asc"]
    );

    let param = {
      currentStepFields: currentStepFields,
      error: errors,
      onFieldChange: that.onFieldChange,
      workflowId: that.getWorkflowId(),
      formProps: that.props.form,
      completed: that.props.stepData.completed_at ? true : false,
      is_locked: that.props.stepData.is_locked,
      addComment: that.props.toggleSidebar,
      changeFlag: that.props.changeFlag,
      getIntegrationComments: that.props.getIntegrationComments,
      dispatch: that.props.dispatch,
      permission: that.props.permission
    };

    let groupedField = [];

    _.map(orderedStep, function(step) {
      if (
        step.definition.field_type === "paragraph" &&
        _.size(step.definition.extra) &&
        step.definition.extra.section
      ) {
        let groupItem = { label: step.definition.body, steps: [step] };
        groupedField.push(groupItem);
      } else if (_.size(groupedField)) {
        let index = groupedField.length - 1;
        groupedField[index].steps.push(step);
      }
    });

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
                {this.props.stepVersionFields.stepVersionFields.completed_by ? (
                  <span>
                    by {"  "}
                    {
                      this.props.stepVersionFields.stepVersionFields
                        .completed_by.email
                    }
                  </span>
                ) : null}
              </div>
            </div>
          </div>
        ) : null}

        {_.size(groupedField) ? (
          <Tabs defaultActiveKey="group_0" onChange={this.callback}>
            {_.map(groupedField, function(group, index) {
              return (
                <TabPane tab={group.label} key={"group_" + index}>
                  {_.map(group.steps, function(f, index) {
                    let param = {
                      field: f,
                      currentStepFields: currentStepFields,
                      error: errors,
                      onFieldChange: that.onFieldChange,
                      workflowId: that.getWorkflowId(),
                      formProps: that.props.form,
                      completed: that.props.stepData.completed_at
                        ? true
                        : false,
                      is_locked: that.props.stepData.is_locked,
                      addComment: that.props.toggleSidebar,
                      changeFlag: that.props.changeFlag,
                      getIntegrationComments: that.props.getIntegrationComments,
                      dispatch: that.props.dispatch,
                      permission: that.props.permission
                    };

                    let field = getFieldType(param);

                    ///row size method
                    //todo: clean up this mess
                    if (row.length === 2) {
                      row = [];
                    }

                    if (f.definition.size === 3) {
                      //If size is 50%

                      if (
                        index ===
                        that.props.stepData.data_fields.length - 1
                      ) {
                        row.push(field);

                        return (
                          <Row gutter={16}>
                            {_.map(row, function(col, index) {
                              return (
                                <Col span={12} key={"col-1-" + index}>
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
                              {_.map(row, function(col, index) {
                                return (
                                  <Col span={12} key={"col-" + index}>
                                    {col}{" "}
                                    {v ? that.getVersionField(col.key) : null}
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
                                <Row gutter={16} key={index}>
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
                          <Row gutter={16} key={index}>
                            <Col span="24">
                              {field}{" "}
                              {v ? that.getVersionField(field.key) : null}
                            </Col>
                          </Row>
                        );
                      }
                    }
                    //return field;
                    //ends
                  })}
                </TabPane>
              );
            })}
          </Tabs>
        ) : (
          _.map(orderedStep, function(f, index) {
            let param = {
              field: f,
              currentStepFields: currentStepFields,
              error: errors,
              onFieldChange: that.onFieldChange,
              workflowId: that.getWorkflowId(),
              formProps: that.props.form,
              completed: that.props.stepData.completed_at ? true : false,
              is_locked: that.props.stepData.is_locked,
              addComment: that.props.toggleSidebar,
              changeFlag: that.props.changeFlag,
              getIntegrationComments: that.props.getIntegrationComments,
              dispatch: that.props.dispatch,
              permission: that.props.permission
            };

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
                    {_.map(row, function(col, index) {
                      return (
                        <Col span={12} key={"col-1-" + index}>
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
                      {_.map(row, function(col, index) {
                        return (
                          <Col span={12} key={"col-" + index}>
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
                        <Row gutter={16} key={index}>
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
                  <Row gutter={16} key={index}>
                    <Col span="24">
                      {field} {v ? that.getVersionField(field.key) : null}
                    </Col>
                  </Row>
                );
              }
            }
            //return field;
            //ends
          })
        )}

        <Divider />
        <div className="break-avoid">
          <Row>
            <Col span="6 ant-row  ">
              <FormItem>
                {this.props.stepData.completed_at ||
                this.props.stepData.is_locked ||
                !_.includes(this.props.permission, "Can submit a step") ||
                !editable ? (
                  <Button type="primary " className="no-print  disabled">
                    Submit
                  </Button>
                ) : (
                  <Button
                    type="primary"
                    className="no-print"
                    htmlType="submit"
                    disabled={this.props.isSubmitting}
                  >
                    {this.props.isSubmitting ? (
                      <FormattedMessage id="commonTextInstances.submittingButtonText" />
                    ) : (
                      "Submit"
                    )}
                  </Button>
                )}
              </FormItem>
            </Col>
            <Col span="18 ant-row " className="text-right">
              {this.getStepStatus(this.props.stepData)}
            </Col>
          </Row>
        </div>
      </Form>
    );
  };
}

const WrappedStepBodyForm = Form.create()(StepBodyForm);

export default WrappedStepBodyForm;
