import React, { Component } from "react";
import {
  Icon,
  Menu,
  Dropdown,
  Button,
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
import addUser from "../../../images/addUser.svg";

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

  userList = data => {
    // return <Menu>
    //   <Menu.Item key="0">
    //     <a href="http://www.alipay.com/">1st menu item</a>
    //   </Menu.Item>
    //   <Menu.Item key="1">
    //     <a href="http://www.taobao.com/">2nd menu item</a>
    //   </Menu.Item>
    //   <Menu.Divider />
    //   <Menu.Item key="3">3rd menu item</Menu.Item>
    // </Menu>

    const { stepId, postStepUser } = this.props;

    console.log("data", data);

    return data.map(item => (
      <Menu.Item>
        <a onClick={() => postStepUser({ step: stepId, user: item.id })}>
          {item.full_name}
        </a>
      </Menu.Item>
    ));
  };

  renderStepUsers = () => {
    const { stepUsers, stepId } = this.props;

    console.log("result", stepUsers, stepId, stepUsers[stepId]);

    if (stepUsers[stepId] && !stepUsers[stepId].isLoading) {
      if (stepUsers[stepId].data) {
        return (
          <Dropdown
            disabled={stepUsers[stepId].disabled}
            overlay={<Menu>{this.userList(stepUsers[stepId].data)}</Menu>}
            trigger={["click"]}
          >
            <img style={{ width: "6%" }} src={addUser} />
          </Dropdown>
        );
      }
      return;
    }
    return <Spin />;
  };

  render = () => {
    //console.log("render",this.props.stepUsers)
    const {
      displayProfile,
      workflowHead,
      stepUsers,
      stepId,
      deleteStepUser
    } = this.props;
    console.log("step", stepId);
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
                  style={{ marginRight: 30 }}
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
