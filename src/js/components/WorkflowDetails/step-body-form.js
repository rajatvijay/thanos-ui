import React, { Component } from "react";
import _ from "lodash";
import { Form, Divider, Row, Col, Button, Tooltip, Tabs } from "antd";
import { workflowStepActions } from "../../actions";
import { userService } from "../../services";
import Moment from "react-moment";
import "moment-timezone";
import FieldItem from "./FieldItem";
import { FormattedMessage, injectIntl } from "react-intl";
import IntlTooltip from "../common/IntlTooltip";
import { getIntlBody } from "../../_helpers/intl-helpers";

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
  constructor() {
    super();
    this.state = {
      version: false,
      error: {}
    };
  }

  getWorkflowId = () => {
    const path = document.location.pathname;
    const pathLast = path.split("/")[3];
    const workflowID = pathLast.split("?")[0];
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
    const { workflowId } = this.props;

    e.preventDefault();
    this.props.dispatch(
      workflowStepActions.submitStepData({
        ...this.props.currentStepFields.currentStepFields,
        workflowId
      })
    );
  };

  ///////////////////////////////////////
  //ON Field Change save or update data//
  //////////////////////////////////////
  onFieldChange = (e, payload, calculated) => {
    const id = payload.field.id;

    const { regex_value } = payload.field;
    const re = new RegExp(regex_value);
    const error = this.state.error;
    let ans = null;
    let isvalid = true;

    if (regex_value) {
      if (calculated) {
        ans = e || e === 0 ? e : "";
      } else if (e.target) {
        ans = e.target.value;
      }

      isvalid = re.test(ans);

      if (!isvalid) {
        error[id] = payload.field.regex_error;
        this.setState({ error: error });
      } else {
        error[id] = "";
        this.setState({ error: error });
      }
    }

    if (isvalid) {
      if (calculated === "file") {
        const method = "save";
        const data = {
          attachment: e,
          field: payload.field.id,
          workflow: payload.workflowId
        };
        this.callDispatch(data, method, payload);
      } else if (calculated) {
        const method = "save";
        const data = {
          answer: e || e === 0 ? e : "",
          field: payload.field.id,
          workflow: payload.workflowId
        };

        this.callDispatch(data, method, payload);
      } else if (e.target) {
        const method = "save";
        const data = {
          answer: e.target.value,
          field: payload.field.id,
          workflow: payload.workflowId
        };

        if (e.type === "blur") {
          this.props.dispatch(workflowStepActions.saveField(data, "blur"));
        } else {
          this.callDispatch(data, method, payload);
        }
      }
    }
  };

  //////////////////////////////////////
  //Dispatch field update /save actions/
  callDispatch = (data, method, payload) => {
    const saveNowType = [
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

    // Check for `extra` (esp if loaded from `api_url`)
    const extrasFromAPI = this.props.currentStepFields.extrasFromAPI || {};
    const extra =
      extrasFromAPI[payload.field.definition.tag] ||
      payload.field.definition.extra;
    if (_.isArray(extra)) {
      // Find the item from `extra` for selected value
      const extra_json = _.find(extra, item => item.value === data.answer);
      // If `extra` has fields other than `label` and `value`
      if (extra_json && Object.keys(extra_json).length > 2) {
        // Add as `extra_json` to enable mapping to other field responses
        data.extra_json = extra_json;
      }
    }

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
      const extra = field.definition.extra;
      if (extra && extra.trigger_field_tag === targetField.definition.tag) {
        clear && this.clearFieldValue(field);
        this.props.dispatch(
          workflowStepActions.fetchFieldExtra(
            field,
            this.fieldAnswerFunction(answer)
          )
        );
      }
    });
  };

  haveNewFieldsBeenAdded = prev => {
    let anythingNew = false;
    if (this.props.stepData.data_fields !== prev.stepData.data_fields) {
      _.forEach(this.props.stepData.data_fields, field => {
        let somethingNew = true;
        _.forEach(prev.stepData.data_fields, oldField => {
          if (oldField.id === field.id) {
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

  fieldAnswerFunction = defaultAnswer => {
    /*//////////////////////////////////////////////////
    This function returns a function that can return answer
    of a field with tag `fieldName` (and default to `defaultAnswer`
    if no fieldName is specified
    //////////////////////////////////////////////////// */
    return fieldName => {
      if (!fieldName) return defaultAnswer;

      const field = _.find(
        this.props.stepData.data_fields,
        field => field.definition.tag === fieldName
      );
      if (field && field.answers[0]) {
        return field.answers[0].answer;
      }
      //TODO: Should it return `undefined` or ...
    };
  };

  updateAllAPIFields = () => {
    _.map(this.props.stepData.data_fields, field => {
      const answer = field.answers[0]
        ? field.answers[0].answer
        : field.definition.defaultValue;
      this.updateDependentFields(field, answer);
      this.updateIndependentAPIField(field);
    });
  };

  updateIndependentAPIField = field => {
    const extra = field.definition.extra;
    // check if independent API field
    if (extra && extra.api_url && !extra.trigger_field_tag) {
      this.props.dispatch(
        workflowStepActions.fetchFieldExtra(field, this.fieldAnswerFunction())
      );
    }
  };

  getUserById = (id, status) => {
    const that = this;
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
      function(error) {}
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
        <FormattedMessage id={"commonTextInstances.submittedByText"} />{" "}
        <span className="text-medium ">{completed_by}</span> on
        {"  "}
        <Tooltip
          title={
            <Moment tz="UTC" format="YYYY/MM/DDTHH:mm:ssz">
              {step.completed_at}
            </Moment>
          }
        >
          <Moment format="YYYY/MM/DD">{step.completed_at}</Moment>
        </Tooltip>
      </span>
    );
  };

  //Calculate step completions and approval
  getStepStatus = stepData => {
    const step = stepData;
    const editable = step.is_editable !== undefined ? step.is_editable : true;

    if ((step.completed_at || step.approved_at) && editable) {
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
        </div>
      );
    } else if (step.updated_at) {
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
    const data = this.props.stepVersionFields.stepVersionFields.data_fields;

    const fieldReturn = _.find(data, function(field) {
      if (field.id === parseInt(fieldId)) {
        return field;
      }
    });

    const showAnswer =
      fieldReturn &&
      fieldReturn.answers.length !== 0 &&
      fieldReturn.answers[0].answer !== "";

    if (showAnswer)
      if (showAnswer && fieldReturn.definition.field_type !== "paragraph") {
        const tooltip = (
          <span className="float-right ">
            {fieldReturn.answers[0].submitted_by_email ? (
              <IntlTooltip
                placement="topRight"
                title={"tooltips.answeredBy"}
                values={{
                  name: fieldReturn.answers[0].submitted_by_email
                }}
              >
                <i className="material-icons t-14 text-middle text-light">
                  history
                </i>
              </IntlTooltip>
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

  getUnifiedErrors = () => {
    const currentStepErrors = this.props.currentStepFields.error;
    const currentFieldError = this.state.error;
    const consolidatedErrors = Object.assign(
      {},
      currentStepErrors,
      currentFieldError
    );

    return consolidatedErrors;
  };

  render = () => {
    if (!this.props.currentStepFields) {
      return null;
    }
    const that = this;
    const showFieldVersion =
      !_.isEmpty(this.props.stepVersionFields.stepVersionFields) &&
      this.props.showVersion;
    const editable =
      this.props.currentStepFields.currentStepFields.is_editable !== undefined
        ? this.props.currentStepFields.currentStepFields.is_editable
        : true;

    const orderedStep = _.orderBy(
      this.props.stepData.data_fields,
      [{ orderBy: Number }],
      ["asc"]
    );

    const param = {
      currentStepFields: this.props.currentStepFields,
      error: this.getUnifiedErrors(),
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

    const rowGroup = {
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
        const fieldParams = Object.assign({}, param);
        fieldParams["field"] = field;
        fieldParams.workflowId = that.props.workflowIdFromPropsForModal
          ? that.props.workflowIdFromPropsForModal
          : fieldParams.workflowId;
        return (
          <FieldItem stepData={that.props.stepData} fieldParams={fieldParams} />
        );
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
              const field = this.getFieldForRender(rawField);

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

    const groupedField = [];

    _.forEach(orderedStep, function(step) {
      if (
        step.definition.field_type === "paragraph" &&
        _.size(step.definition.extra) &&
        step.definition.extra.section
      ) {
        const groupItem = {
          label: getIntlBody(step.definition),
          steps: [step]
        };
        groupedField.push(groupItem);
      } else if (_.size(groupedField)) {
        const index = groupedField.length - 1;
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
      >
        <div style={{ padding: "29px 44px 27px 37px" }}>
          <div>
            {showFieldVersion ? (
              <div className=" mr-bottom">
                <div className="version-item">
                  <span className="float-right">
                    <IntlTooltip
                      placement="topRight"
                      title={"tooltips.hideVersionText"}
                    >
                      <span
                        className="text-anchor"
                        onClick={this.props.versionToggle}
                      >
                        <i className="material-icons t-14 text-middle text-light ">
                          close
                        </i>
                      </span>
                    </IntlTooltip>
                  </span>
                  <div className="text-medium mr-bottom-sm">
                    <FormattedMessage id="stepBodyFormInstances.versionSubmittedOn" />
                    {"  "}
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
                        <FormattedMessage id="commonTextInstances.by" />
                        {"  "}
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
              <Tabs
                defaultActiveKey="group_0"
                onChange={this.callback}
                className="paragraph-section"
              >
                {_.map(groupedField, function(group, index) {
                  return (
                    <TabPane tab={group.label} key={"group_" + index}>
                      {_.map(group.steps, function(field, index) {
                        if (index !== 0) {
                          const renderQueue = [];
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
                const renderQueue = [];
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
        </div>
        <Divider className="no-margin" />

        <div
          style={{
            padding: "29px 44px 27px 37px",
            marginBottom: "100px"
          }}
        >
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
                    onClick={this.handleSubmit}
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
