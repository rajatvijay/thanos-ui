import React, { Component } from "react";
import { Icon, Menu, Dropdown, Button, Divider, Tooltip, Row, Col } from "antd";
import { connect } from "react-redux";
import StepBodyForm from "./step-body-form";
import { workflowDetailsActions } from "../../actions";
import _ from "lodash";
import Moment from "react-moment";
import { FormattedMessage, injectIntl } from "react-intl";
import ProfileStepBody from "./ProfileStepBody";

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

  render = () => {
    const { displayProfile, workflowHead } = this.props;
    const loading =
      (this.props.currentStepFields[this.props.stepId] &&
        this.props.currentStepFields[this.props.stepId].loading) ||
      this.props.workflowDetails.loading;

    var stepData = null;

    if (!loading && this.props.currentStepFields[this.props.stepId]) {
      stepData = this.props.currentStepFields[this.props.stepId]
        .currentStepFields;
    } else {
      stepData = {};
    }
    console.log(
      "step",
      workflowHead,
      stepData,
      this.props.currentStepFields,
      this.props.stepId
    );

    var locked_tag = null;

    if (stepData.is_locked) {
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
          className={
            "text-right " + (this.state.printing ? "hide-print" : null)
          }
        >
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
          ) : stepData ? (
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
                currentStepFields={
                  this.props.currentStepFields[this.props.stepId]
                }
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
    workflowDetailsHeader
  } = state;
  return {
    currentStepFields,
    workflowDetails,
    stepVersionFields,
    config,
    workflowDetailsHeader
  };
}

export default connect(mapStateToProps)(injectIntl(StepBody));
