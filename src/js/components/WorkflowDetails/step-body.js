import React, { Component } from "react";
import {
  Icon,
  Menu,
  Dropdown,
  Divider,
  Tooltip,
  Row,
  Col,
  Tag,
  Spin
} from "antd";
import { connect } from "react-redux";
import StepBodyForm from "./step-body-form";
import { workflowDetailsActions, stepBodyActions } from "../../actions";
import _ from "lodash";
import Moment from "react-moment";
import { FormattedMessage, injectIntl } from "react-intl";
import ProfileStepBody from "./ProfileStepBody";
import StepAssignmentUsers from "./StepAssignmentUsers";

class StepBody extends Component {
  constructor(props) {
    super(props);
    this.state = {
      stepCompletedBy: null,
      stepApprovedBy: null,
      printing: false
    };
  }

  addComment = stepData => {
    this.props.toggleSidebar(stepData.id, "step");
  };
  componentDidMount() {
    const { stepId, getAssignedUser } = this.props;

    this.props.getAssignedUser(stepId);
  }

  onVersionChange = e => {
    this.versionToggle();
    const currentStepFields = this.props.currentStepFields[this.props.stepId]
      .currentStepFields;
    let stepTrack = {
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
            let str = i.label;
            let strMod = str.replace(/Created/g, "Submitted");
            return <Menu.Item key={i.value}> {strMod}</Menu.Item>;
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
                postStepUser({ step: stepId, user: user.id })
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

  render = () => {
    //console.log("render",this.props.stepUsers)
    const {
      displayProfile,
      workflowHead,
      stepUsers,
      stepId,
      deleteStepUser,
      workflowId
    } = this.props;
    //console.log("step", stepId);
    const loading =
      (this.props.currentStepFields[this.props.stepId] &&
        this.props.currentStepFields[this.props.stepId].loading) ||
      this.props.workflowDetails.loading;

    var stepData = null;
    // console.log("l", loading);
    // console.log("ids", this.props.stepId);

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
    // console.log(
    //   "step",
    //   workflowHead,
    //   stepData,
    //   this.props.currentStepFields,
    //   this.props.stepId,
    //   stepData
    // );

    var locked_tag = null;

    if (stepData && stepData.is_locked) {
      let dependent_steps = stepData.definition.dependent_steps;
      let dependent_step_name = _.map(dependent_steps, function(ds) {
        return ds["label"];
      });
      locked_tag = (
        <div>
          <div data-show="true" className="ant-tag">
            To initiate this step, please complete the following steps
            first:&nbsp;
            <b>{dependent_step_name.join(", ")}</b>
          </div>
        </div>
      );
    }

    var step_comment_btn = null;

    if (_.size(stepData)) {
      var step_comment_btn = (
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
          {/* //&& stepUsers[stepId].display */}
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
                  {stepUsers[stepId].user.user_full_name}
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

    let dynamicUserPerms = this.props.workflowDetailsHeader
      .workflowDetailsHeader
      ? this.props.workflowDetailsHeader.workflowDetailsHeader.definition
          .dynamic_group_names_with_perm
      : null;

    return (
      <div style={{ background: "#FFFFFF" }}>
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

        <Row style={{ padding: "29px 44px 27px 37px" }}>
          <Col span={16}>
            <span className="t-18 text-black">
              {displayProfile
                ? workflowHead
                  ? workflowHead.name
                  : null
                : stepData.name}
            </span>
          </Col>
          <Col span={8}>
            {locked_tag}
            {locked_tag ? <br /> : null}
            {!loading ? step_comment_btn : null}
          </Col>
        </Row>

        <Divider className="no-margin" />

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
                <h4>Step: {stepData.name}</h4>
                <p>
                  Printed on: <Moment format="MM/DD/YYYY">{Date.now()}</Moment>
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
                permission={this.props.config.permissions}
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
    stepUsers
  } = state;
  return {
    currentStepFields,
    workflowDetails,
    stepVersionFields,
    config,
    workflowDetailsHeader,
    stepUsers
  };
}

export default connect(
  mapStateToProps,
  stepBodyActions
)(injectIntl(StepBody));
