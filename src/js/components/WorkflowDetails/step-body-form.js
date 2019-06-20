import React, { Component } from "react";
import _ from "lodash";
import { Form, Divider, Row, Col, Alert, Button, Tooltip, Tabs } from "antd";
import { workflowStepActions } from "../../actions";
import { userService } from "../../services";
import Moment from "react-moment";
//import { getFieldType } from "./field-types";
import FieldItem from "./FieldItem";
import { FormattedMessage, injectIntl } from "react-intl";

const FormItem = Form.Item;
const TabPane = Tabs.TabPane;
const SIZE_33 = 4,
  SIZE_50 = 3,
  SIZE_66 = 2,
  SIZE_100 = 1;
const sizeFractions = {
  [SIZE_33]: 1 / 3,
  [SIZE_50]: 1 / 2,
  [SIZE_66]: 2 / 3,
  [SIZE_100]: 1
};

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
    if (this.haveNewFieldsBeenAdded(prev)) {
      this.updateAllAPIFields();
    }
  };

  componentDidMount = () => {
    this.updateAllAPIFields();
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
        answer: e || e === 0 ? e : "",
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
    this.updateDependentFields(payload.field, data.answer, true);
  };

  dispatchDebounced = _.debounce((data, method) => {
    this.props.dispatch(workflowStepActions.saveField(data));
  }, 1500);

  updateDependentFields = (targetField, answer, clear) => {
    _.map(this.props.stepData.data_fields, field => {
      let extra = field.definition.extra;
      if (extra && extra.trigger_field_tag == targetField.definition.tag) {
        clear && this.clearFieldValue(field);
        this.props.dispatch(workflowStepActions.fetchFieldExtra(field, answer));
      }
    });
  };

  haveNewFieldsBeenAdded = prev => {
    let anythingNew = false;
    if (this.props.stepData.data_fields != prev.stepData.data_fields) {
      _.forEach(this.props.stepData.data_fields, field => {
        let somethingNew = true;
        _.forEach(prev.stepData.data_fields, oldField => {
          if (oldField.id == field.id) {
            somethingNew = false;
            return false;
          }
        });
        if (somethingNew) {
          anythingNew = true;
          return false;
        }
      });
    }
    return anythingNew;
  };

  clearFieldValue = field => {
    if (field.answers[0]) {
      field.answers[0].answer = "";
      this.onFieldChange(
        "",
        {
          field: field,
          workflowId: field.workflow
        },
        true
      );
    }
  };

  updateAllAPIFields = () => {
    _.map(this.props.stepData.data_fields, field => {
      let answer = field.answers[0]
        ? field.answers[0].answer
        : field.definition.defaultValue;
      this.updateDependentFields(field, answer);
      this.updateIndependentAPIField(field, answer);
    });
  };

  updateIndependentAPIField = (field, answer) => {
    let extra = field.definition.extra;
    // check if independent API field
    if (extra && extra.api_url && !extra.trigger_field_tag) {
      this.props.dispatch(workflowStepActions.fetchFieldExtra(field, answer));
    }
  };

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

  getCompletedBy = step => {
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
          {step.completed_at ? this.getCompletedBy(step) : null}

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

    let showAnswer =
      fieldReturn &&
      fieldReturn.answers.length !== 0 &&
      fieldReturn.answers[0].answer !== "";

    if (showAnswer)
      if (showAnswer && fieldReturn.definition.field_type !== "paragraph") {
        let tooltip = (
          <span className="float-right ">
            {fieldReturn.answers[0].submitted_by_email ? (
              <Tooltip
                placement="topRight"
                title={
                  "Answered by " + fieldReturn.answers[0].submitted_by_email
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
        );

        return (
          <div className="version-item no-print ">
            {tooltip}
            <div className="text-medium">
              {fieldReturn.definition.body || ""}
            </div>
            {fieldReturn.answers[0].answer ? (
              <mark>{fieldReturn.answers[0].answer}</mark>
            ) : (
              ""
            )}
          </div>
        );
      } else {
        return <div />;
      }
  };

  render = () => {
    let that = this;
    let row = [];
    let showFieldVersion =
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
      currentStepFields: this.props.currentStepFields,
      error: this.props.currentStepFields.error,
      onFieldChange: this.onFieldChange,
      workflowId: this.props.currentStepFields.currentStepFields
        ? this.props.currentStepFields.currentStepFields.workflow
        : this.getWorkflowId(),
      formProps: this.props.form,
      completed: !!this.props.stepData.completed_at,
      is_locked: this.props.stepData.is_locked,
      addComment: this.props.toggleSidebar,
      changeFlag: this.props.changeFlag,
      getIntegrationComments: this.props.getIntegrationComments,
      dispatch: this.props.dispatch,
      intl: this.props.intl,
      permission: this.props.permission,
      dynamicUserPerms: this.props.dynamicUserPerms
    };

    let rowGroup = {
      fields: [],
      get currentOccupancy() {
        return this.fields.reduce((accumulator, rawField) => {
          return accumulator + this.getSizeFraction(rawField);
        }, 0);
      },
      get shouldRender() {
        return this.currentOccupancy > 0.9;
      },
      get hasElements() {
        return this.fields.length > 0;
      },
      addToRenderGroup(field) {
        this.fields.push(field);
      },
      reset() {
        this.fields = [];
      },
      getFieldForRender(field) {
        let fieldParams = Object.assign({}, param);
        fieldParams["field"] = field;
        return <FieldItem fieldParams={fieldParams} />;
      },
      getSizeFraction(field) {
        // Get the current field size in fraction
        if (field.definition && field.definition.size in sizeFractions) {
          return sizeFractions[field.definition.size];
        } else {
          return 1;
        }
      },
      canAccommodateField(field) {
        // Check if current field can fit into the current rendering group
        const fieldSizeFraction = this.getSizeFraction(field);
        return 1 - this.currentOccupancy >= fieldSizeFraction;
      },
      render() {
        // render the current group
        const _rowGroup = Object.assign(this);
        const fields = _rowGroup.fields;

        this.reset();
        return (
          <Row gutter={60}>
            {_.map(fields, rawField => {
              let field = this.getFieldForRender(rawField);
              let ftype = rawField.definition.field_type;
              return (
                <Col
                  key={"field-" + rawField.id}
                  span={Math.ceil(24 * this.getSizeFraction(rawField))}
                >
                  {field}
                  {showFieldVersion ? that.getVersionField(rawField.id) : null}
                </Col>
              );
            })}
          </Row>
        );
      }
    };

    let groupedField = [];

    _.forEach(orderedStep, function(step) {
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
        key="step-body-form"
        layout="vertical"
        onSubmit={this.handleSubmit}
        className="step-form"
        autoComplete="off"
        style={{
          padding: "29px 44px 27px 37px",
          marginBottom: "100px"
        }}
      >
        <div>
          {showFieldVersion ? (
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
                  {this.props.stepVersionFields.stepVersionFields
                    .completed_by ? (
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
                    {_.map(group.steps, function(field, index) {
                      if (index !== 0) {
                        let renderQueue = [];
                        if (!rowGroup.canAccommodateField(field)) {
                          // This field cannot be accommodated in the current group
                          // render the current group and append this to next batch for rendering
                          renderQueue.push(rowGroup.render());
                        }
                        rowGroup.addToRenderGroup(field);
                        if (
                          rowGroup.shouldRender ||
                          (index === group.steps.length - 1 &&
                            rowGroup.hasElements)
                        ) {
                          // Row is full or
                          // this is the last field & rowGroup still has elements remaining
                          renderQueue.push(rowGroup.render());
                        }
                        return renderQueue;
                      }
                    })}
                  </TabPane>
                );
              })}
            </Tabs>
          ) : (
            _.map(orderedStep, function(field, index) {
              let renderQueue = [];
              if (!rowGroup.canAccommodateField(field)) {
                // This field cannot be accommodated in the current group
                // render the current group and append this to next batch for rendering
                renderQueue.push(rowGroup.render());
              }
              rowGroup.addToRenderGroup(field);
              if (
                rowGroup.shouldRender ||
                (index === orderedStep.length - 1 && rowGroup.hasElements)
              ) {
                // Row is full or
                // this is the last field & rowGroup still has elements remaining
                renderQueue.push(rowGroup.render());
              }
              return renderQueue;
            })
          )}
        </div>
        <Divider className="no-margin" />

        <div style={{ paddingTop: 30 }}>
          <Row>
            <Col span={8}>
              {this.props.stepData.completed_at ||
              this.props.stepData.is_locked ||
              !_.includes(this.props.permission, "Can submit a step") ||
              !editable ? (
                <Button
                  type="primary "
                  className="no-print  disabled"
                  size="large"
                >
                  <FormattedMessage id="commonTextInstances.submitButtonText" />
                </Button>
              ) : (
                <div style={{ display: "flex", alignItems: "center" }}>
                  <Button
                    type="primary"
                    size="large"
                    className="no-print pd-ard"
                    htmlType="submit"
                    disabled={this.props.isSubmitting}
                  >
                    {this.props.isSubmitting ? (
                      <FormattedMessage id="commonTextInstances.submittingButtonText" />
                    ) : (
                      <FormattedMessage id="commonTextInstances.submitButtonText" />
                    )}
                  </Button>
                  <p
                    style={{
                      color: "#D40000",
                      fontSize: "12px",
                      fontWeight: "bold",
                      letterSpacing: "-0.02px",
                      lineHeight: "15px",
                      marginLeft: "30px",
                      marginTop: "10px"
                    }}
                  >
                    {this.props.currentStepFields.error &&
                    Object.values(this.props.currentStepFields.error).length
                      ? "Please fill out required fields"
                      : ""}
                  </p>
                </div>
              )}
            </Col>
            <Col span={16} className="text-right">
              {this.getStepStatus(this.props.stepData)}
            </Col>
          </Row>
        </div>
      </Form>
    );
  };
}

const WrappedStepBodyForm = Form.create()(injectIntl(StepBodyForm));

export default WrappedStepBodyForm;
