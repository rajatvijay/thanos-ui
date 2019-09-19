import React, { Component, useEffect, useState } from "react";
import {
  Icon,
  Menu,
  Dropdown,
  Divider,
  Tooltip,
  Row,
  Col,
  Tag,
  Spin,
  Alert
} from "antd";
import { connect } from "react-redux";
import StepBodyForm from "./step-body-form";
import { workflowDetailsActions, stepBodyActions } from "../../actions";
import _ from "lodash";
import Moment from "react-moment";
import { FormattedMessage, injectIntl } from "react-intl";
import ProfileStepBody from "./ProfileStepBody";
import StepAssignmentUsers from "./StepAssignmentUsers";
import PDFChecklistModal from "../Workflow/PDFChecklistModal";
import { get as lodashGet } from "lodash";
import styled from "@emotion/styled";

class StepBody extends Component {
  constructor(props) {
    super(props);
    this.state = {
      stepCompletedBy: null,
      stepApprovedBy: null,
      printing: false,
      showWorkflowPDFModal: false
    };
  }

  addComment = stepData => {
    this.props.toggleSidebar(stepData.id, "step");
  };
  componentDidMount() {
    const { stepId } = this.props;
    this.props.getAssignedUser(stepId);
  }

  onVersionChange = e => {
    this.versionToggle();
    const currentStepFields = this.props.currentStepFields[this.props.stepId]
      .currentStepFields;
    const stepTrack = {
      workflowId: currentStepFields.workflow,
      groupId: currentStepFields.step_group,
      stepId: currentStepFields.id,
      versionId: e.key
    };

    this.props.dispatch(workflowDetailsActions.getStepVersionFields(stepTrack));
  };

  versionToggle = () => {
    this.setState({ showVersion: !this.state.showVersion });
  };

  versionDropDown = () => {
    const currentStepFields = this.props.currentStepFields[this.props.stepId]
      .currentStepFields;
    const versionList = (
      <Menu onClick={this.onVersionChange}>
        {currentStepFields.versions.length > 0 ? (
          _.map(currentStepFields.versions, function(i) {
            const str = i.label;
            const strMod = str.replace(/Created/g, "Submitted");
            return <Menu.Item key={`${i.value}`}> {strMod}</Menu.Item>;
          })
        ) : (
          <Menu.Item key={0} disabled>
            {" "}
            <FormattedMessage id="stepBodyFormInstances.noOtherVersionAvailable" />
          </Menu.Item>
        )}
      </Menu>
    );

    return (
      <Dropdown overlay={versionList}>
        <Tooltip
          title={this.props.intl.formatMessage({
            id: "stepBodyFormInstances.previousVersion"
          })}
        >
          <span className="text-anchor pd-ard-sm">
            <i className="material-icons text-middle   t-18">restore</i>
          </span>
        </Tooltip>
      </Dropdown>
    );
  };

  renderStepUsers = () => {
    const { stepUsers, stepId, postStepUser } = this.props;

    // Loading Case
    if (stepUsers[stepId].isLoading) {
      return (
        <Spin
          indicator={<Icon type="loading" style={{ fontSize: 24 }} spin />}
        />
      );
    }

    const hasUserWithEditAccess = stepUsers[stepId].data;
    const hasUserAlreadyAssigned = stepUsers[stepId].user;
    if (hasUserWithEditAccess && !hasUserAlreadyAssigned) {
      return (
        <Dropdown
          overlayStyle={{
            boxShadow: "1px 3px 5px rgba(0, 0, 0, 0.12)"
          }}
          disabled={stepUsers[stepId].disabled}
          overlay={
            <StepAssignmentUsers
              onSelectUser={user =>
                postStepUser({
                  step: stepId,
                  user: user.id,
                  getStepUserTag: this.props.getStepUserTag
                })
              }
              users={stepUsers[stepId].data}
            />
          }
          trigger={["click"]}
        >
          <Icon type="user-add" />
        </Dropdown>
      );
    }

    return null;
  };

  get stepData() {
    try {
      return this.props.currentStepFields[this.props.stepId].currentStepFields;
    } catch (e) {
      return null;
    }
  }
  shouldDisplayPDFModal = () => {
    const stepId = this.props.stepId;
    return (
      _.get(this.props.currentStepFields, [
        stepId,
        "currentStepFields",
        "definition",
        "extra",
        "display_pdf_modal"
      ]) || false
    );
  };

  componentDidUpdate(previousProps) {
    const previousStepTag = lodashGet(
      previousProps,
      `currentStepFields[${previousProps.stepId}].currentStepFields.definition_tag`
    );
    const currentStepTag = lodashGet(
      this.props,
      `currentStepFields[${this.props.stepId}].currentStepFields.definition_tag`
    );
    if (previousStepTag !== currentStepTag && this.shouldDisplayPDFModal()) {
      this.setState({ showWorkflowPDFModal: true });
    }
  }

  handleModalVisibility = status => {
    this.setState({
      showWorkflowPDFModal: status
    });
  };

  get dependentSteps() {
    return lodashGet(
      this.props.currentStepFields[this.props.stepId],
      "currentStepFields.definition.dependent_steps",
      []
    );
  }

  render = () => {
    const {
      displayProfile,
      workflowHead,
      stepUsers,
      stepId,
      deleteStepUser,
      workflowId
    } = this.props;
    const { showWorkflowPDFModal } = this.state;
    const loading =
      (this.props.currentStepFields[this.props.stepId] &&
        this.props.currentStepFields[this.props.stepId].loading) ||
      this.props.workflowDetails.loading;

    let stepData = null;

    if (
      !loading &&
      this.props.currentStepFields[this.props.stepId] &&
      this.props.currentStepFields[this.props.stepId].currentStepFields
    ) {
      stepData = this.props.currentStepFields[this.props.stepId]
        .currentStepFields;
    } else {
      stepData = {};
    }

    let step_comment_btn = null;

    if (_.size(stepData)) {
      step_comment_btn = (
        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
            alignItems: "center"
          }}
          className={
            "text-right " + (this.state.printing ? "hide-print" : null)
          }
        >
          {stepUsers[stepId] && (
            <div>
              {stepUsers[stepId].user && (
                <Tag
                  color="#104774"
                  closable
                  onClose={() =>
                    deleteStepUser(stepId, stepUsers[stepId].user.id)
                  }
                >
                  <span>
                    <i
                      className="material-icons t-18 text-middle"
                      style={{ marginRight: 4 }}
                    >
                      person
                    </i>
                    {stepUsers[stepId].user.user_full_name
                      ? stepUsers[stepId].user.user_full_name
                      : stepUsers[stepId].user.user_email}
                  </span>
                </Tag>
              )}

              {this.renderStepUsers()}
            </div>
          )}

          {this.versionDropDown()}

          <span className="display-inline-block pd-right-sm"> </span>
          <span
            style={{ cursor: "pointer" }}
            onClick={this.addComment.bind(this, stepData)}
          >
            <i className="material-icons t-18 text-middle">message</i>
          </span>
        </div>
      );
    }

    const dynamicUserPerms = this.props.workflowDetailsHeader
      .workflowDetailsHeader
      ? this.props.workflowDetailsHeader.workflowDetailsHeader.definition
          .dynamic_group_names_with_perm
      : null;

    return (
      <div style={{ background: "#FFFFFF" }}>
        {this.stepData && (
          <PDFChecklistModal
            definition={this.stepData.definition}
            workflowId={workflowId}
            visible={showWorkflowPDFModal}
            handleModalVisibility={this.handleModalVisibility}
          />
        )}
        {this.state.printing ? (
          <style
            dangerouslySetInnerHTML={{
              __html: `

                .printOnly .hide-print {
                  display: none;
                }
                .printOnly .print-header {
                  display: block !important;
                  margin: 48px 48px;
                }
                .printOnly .logo {
                  max-width: 150px;
                }
                .printOnly #StepBody .pd-ard-lg {
                  padding: 0px !important;
                }
                .printOnly #StepBody .add_comment_btn {
                  display:none;
                }
                .hide-print {
                  display: none !important;
                }
              `
            }}
          />
        ) : (
          <style
            dangerouslySetInnerHTML={{
              __html: `
                .printOnly .print-header {
                  display:none;
                }
                .hide-print {
                  display: block;
                }
              `
            }}
          />
        )}
        <Row
          style={{
            padding: "29px 44px 27px 37px",
            alignItems: "center",
            display: "flex"
          }}
        >
          <Col span={16}>
            <span className="t-18 text-black">
              {displayProfile
                ? workflowHead
                  ? workflowHead.name
                  : null
                : stepData.name}
            </span>
          </Col>
          <Col span={8}>{!loading ? step_comment_btn : null}</Col>
        </Row>

        <Divider className="no-margin" />
        <LockedAlert
          isLocked={stepData.is_locked}
          dependentSteps={this.dependentSteps}
          workflowId={this.props.workflowId}
        />

        <div>
          {displayProfile ? (
            <ProfileStepBody workflowHead={this.props.workflowHead} />
          ) : loading ? (
            <div className="text-center mr-top-lg">
              <Icon type={"loading"} />
            </div>
          ) : stepData && this.props.workflowHead ? (
            <div
              className={
                this.state.printing ? "step-printing" : "step-not-printing"
              }
            >
              <div className="print-header ">
                <img
                  alt={this.props.config.name}
                  src={this.props.config.logo}
                  className="logo"
                />
                <br />
                <br />
                <h3>{this.props.workflowHead.name}</h3>
                <h4>
                  <FormattedMessage id="stepBodyFormInstances.step" /> :{" "}
                  {stepData.name}
                </h4>
                <p>
                  <FormattedMessage id="stepBodyFormInstances.printedOn" /> :{" "}
                  <Moment format="MM/DD/YYYY">{Date.now()}</Moment>
                </p>
                <Divider />
              </div>
              <StepBodyForm
                workflowId={workflowId}
                stepData={stepData}
                {...this.props}
                version={this.props.stepVersionFields}
                showVersion={this.state.showVersion}
                versionToggle={this.versionToggle}
                permission={this.props.permissions.permissions}
                isSubmitting={
                  this.props.currentStepFields[this.props.stepId] &&
                  this.props.currentStepFields[this.props.stepId].isSubmitting
                }
                dynamicUserPerms={dynamicUserPerms}
                currentStepFields={{
                  ...this.props.currentStepFields,
                  ...this.props.currentStepFields[this.props.stepId]
                }}
                dispatch={this.props.dispatch}
                extraFilters={this.props.extraFilters[workflowId] || null}
              />
            </div>
          ) : (
            <div className="text-center mr-top-lg">
              <Icon type={"loading"} />
            </div>
          )}
        </div>
      </div>
    );
  };
}

function mapStateToProps(state) {
  const {
    currentStepFields,
    workflowDetails,
    stepVersionFields,
    config,
    workflowDetailsHeader,
    stepUsers,
    permissions,
    extraFilters
  } = state;
  return {
    currentStepFields,
    workflowDetails,
    stepVersionFields,
    config,
    workflowDetailsHeader,
    stepUsers,
    permissions,
    extraFilters
  };
}

export default connect(
  mapStateToProps,
  stepBodyActions
)(injectIntl(StepBody));

const LockedAlertComponent = React.memo(
  ({ dependentSteps, isLocked, stepGroups, workflowId }) => {
    if (!isLocked || !dependentSteps || dependentSteps.length === 0)
      return null;
    const [links, setLinks] = useState({});

    useEffect(() => {
      // Filter out the steps that are dependent and not completed;
      // Create link to those steps.
      let links = {};
      const dependentStepsDefinitionIds = dependentSteps.map(
        step => step.value
      );

      // Let's go through each step group looking for incomplete steps
      stepGroups.forEach(stepGroup => {
        // Now lets find the incomplete dependent steps that exist in this step group
        stepGroup.steps.forEach(step => {
          const key = step.definition.toString();
          if (!step.completed_at && dependentStepsDefinitionIds.includes(key)) {
            // We gave one of the incomplete dependent steps.
            // Create a link to that step.
            links[
              key
            ] = `/workflows/instances/${workflowId}?group=${stepGroup.id}&step=${step.id}`;
          }
        });
      });

      // Saving the links in state.
      setLinks(links);
    }, [dependentSteps, stepGroups, workflowId]); // Will not update until one of these dependencies' reference changes

    const stepLabels = dependentSteps.map(step =>
      links[step.value] ? (
        <li key={step.label}>
          <StyledAnchorTag href={links[step.value]} rel="noopener noreferrer">
            {step.label}
          </StyledAnchorTag>
        </li>
      ) : (
        <li key={step.label}>{step.label}</li>
      )
    );

    return (
      <Row style={{ padding: "29px 37px 12px 37px" }}>
        <Col span={24}>
          <Alert
            message={
              <FormattedMessage id="stepBodyFormInstances.stepIsLocked" />
            }
            description={
              <>
                <FormattedMessage id="stepBodyFormInstances.toInitiatePleaseComplete" />
                :
                <br />
                <ul>{stepLabels}</ul>
              </>
            }
            type="error"
            showIcon
          />
        </Col>
      </Row>
    );
  }
);

const lockedAlertMapStateToProps = (state, ownProps) => {
  return {
    stepGroups: lodashGet(
      state.workflowDetails,
      `${ownProps.workflowId}.workflowDetails.stepGroups.results`,
      []
    )
  };
};

const LockedAlert = connect(lockedAlertMapStateToProps)(LockedAlertComponent);

const StyledAnchorTag = styled.a`
  color: #000;
`;
