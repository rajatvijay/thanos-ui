import React, { Component } from "react";
import { Icon, Menu, Dropdown, Button, Divider } from "antd";
import { connect } from "react-redux";
import StepBodyForm from "./step-body-form";
import { workflowDetailsActions } from "../../actions";
import _ from "lodash";
import Moment from "react-moment";

class StepBody extends Component {
  constructor(props) {
    super(props);
    this.state = {
      stepCompletedBy: null,
      stepApprovedBy: null,
      printing: false
    };
  }

  shouldComponentUpdated = nextProps => {
    if (
      this.props.currentStepFields.currentStepFields !== {} &&
      this.props.currentStepFields.currentStepFields !==
        nextProps.currentStepFields.currentStepFields
    ) {
      return true;
    } else {
      return false;
    }
  };

  addComment = stepData => {
    this.props.toggleSidebar(stepData.id, "step");
  };

  onVersionChange = e => {
    this.versionToggle();
    let stepTrack = {
      workflowId: this.props.currentStepFields.currentStepFields.workflow,
      groupId: this.props.currentStepFields.currentStepFields.step_group,
      stepId: this.props.currentStepFields.currentStepFields.id,
      versionId: e.key
    };

    this.props.dispatch(workflowDetailsActions.getStepVersionFields(stepTrack));
  };

  versionToggle = () => {
    this.setState({ showVersion: !this.state.showVersion });
  };

  versionDropDown = () => {
    const versionList = (
      <Menu onClick={this.onVersionChange}>
        {this.props.currentStepFields.currentStepFields.versions.length > 0 ? (
          _.map(
            this.props.currentStepFields.currentStepFields.versions,
            function(i) {
              return <Menu.Item key={i.value}> {i.label}</Menu.Item>;
            }
          )
        ) : (
          <Menu.Item key={0} disabled>
            {" "}
            No other version available
          </Menu.Item>
        )}
      </Menu>
    );

    return (
      <Dropdown overlay={versionList}>
        <Button
          style={{ position: "relative", top: "-62px", right: "-25px" }}
          className="ant-btn-sm"
        >
          Previous versions <Icon type="down" />{" "}
        </Button>
      </Dropdown>
    );
  };

  printDiv = () => {
    var that = this;
    this.setState({ printing: true });

    setTimeout(function() {
      var printContents = document.getElementById("StepBody").innerHTML;
      var docHead = document.querySelector("head").innerHTML;
      var body =
        "<!DOCTYPE html><html><head>" +
        docHead +
        "</head><body>" +
        printContents +
        "</body></html>";
      var myWindow = window.open();
      myWindow.document.write(body);
      myWindow.document.close();
      myWindow.focus();

      setTimeout(function() {
        myWindow.print();
        myWindow.close();
      }, 1000);
      that.setState({ printing: false });
    }, 500);
  };

  render = () => {
    const loading =
      this.props.currentStepFields.loading ||
      this.props.workflowDetails.loading;

    var stepData = null;

    if (!loading && this.props.currentStepFields) {
      stepData = this.props.currentStepFields.currentStepFields;
    } else {
      stepData = {};
    }

    var locked_tag = null;

    if (stepData.is_locked) {
      let dependent_steps = stepData.definition.dependent_steps;
      let dependent_step_name = _.map(dependent_steps, function(ds) {
        return ds["label"];
      });
      locked_tag = (
        <div>
          <div data-show="true" class="ant-tag">
            To initiate this step, please complete the following steps
            first:&nbsp;
            <b>{dependent_step_name.join(", ")}</b>
          </div>
        </div>
      );
    }

    var step_comment_btn = null;

    if (_.size(stepData)) {
      let comment_btn_text = "Add comment";
      if (stepData.comment_count == 1) {
        comment_btn_text = "1 comment";
      } else if (stepData.comment_count > 1) {
        comment_btn_text = stepData.comment_count + " comments";
      }

      var step_comment_btn = (
        <div
          className={
            "text-right " + (this.state.printing ? "hide-print" : null)
          }
        >
          <span
            onClick={this.printDiv}
            className=" ant-btn ant-btn-sm "
            style={{ position: "relative", top: "-62px", right: "-18px" }}
          >
            Print <i className="material-icons t-14 text-middle">print</i>
          </span>

          {this.versionDropDown()}
          <span className="display-inline-block pd-right-sm"> </span>
          <span
            style={{ position: "relative", top: "-62px", right: "-25px" }}
            onClick={this.addComment.bind(this, stepData)}
            className="ant-btn ant-btn-sm"
          >
            {comment_btn_text}
          </span>
        </div>
      );
    }

    return (
      <div className="pd-ard-lg">
        {this.state.printing ? (
          <style
            dangerouslySetInnerHTML={{
              __html: `
                @page {
                  margin-top: 20px ;
                }
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
        {locked_tag}
        {locked_tag ? <br /> : null}
        {!loading ? step_comment_btn : null}
        {loading ? (
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
            />
          </div>
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
  const {
    currentStepFields,
    workflowDetails,
    stepVersionFields,
    config
  } = state;
  return {
    currentStepFields,
    workflowDetails,
    stepVersionFields,
    config
  };
}

export default connect(mapStateToProps)(StepBody);
