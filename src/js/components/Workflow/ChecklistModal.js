import React from "react";
import { Modal, Checkbox, Button, Icon } from "antd";
import { css } from "emotion";
import { authHeader } from "../../_helpers";
import { get as lodashObjectGet, set as lodashObjectSet } from "lodash";
import {
  submitWorkflows,
  fetchWorkflowDetails
} from "../../services/checklistModalApi";
import { notification } from "antd";
import { FormattedMessage } from "react-intl";

const openNotificationWithIcon = data => {
  notification[data.type]({
    message: data.message,
    description: data.body,
    placement: "bottomLeft"
  });
};
const META_INFO = [
  { value: "include_flags", label: "Flags" },
  { value: "include_comments", label: "Comments" },
  { value: "include_archived_related_workflows", label: "Related Worflow" }
];

class ChecklistModal extends React.Component {
  state = {
    visible: false,
    pdfConfig: null,
    loading: false,
    error: false
  };

  // To hold the user selection not the checkbox status
  userSelection = {};

  componentDidMount = () => {
    this.fetchWorkflowDetails();
    this.setState({
      visible: true
    });
  };

  getUserSelectionObjectPath = (parentTag, workflowType) => {
    if (["PARENT_WORKFLOW", "STATIC_SECTIONS"].includes(workflowType)) {
      return parentTag;
    } else {
      return `childWorkflow.${parentTag}`;
    }
  };

  onSelectWorkflow = (e, tag, parentTag, workflowType) => {
    const checked = e.target.checked;
    const path = this.getUserSelectionObjectPath(parentTag, workflowType);

    if (checked) {
      // Add
      lodashObjectSet(this.userSelection, path, [
        ...lodashObjectGet(this.userSelection, path, []),
        tag
      ]);
    } else {
      // Remove
      lodashObjectSet(
        this.userSelection,
        path,
        lodashObjectGet(this.userSelection, path, []).filter(
          step => step !== tag
        )
      );
    }
    console.log(this.userSelection);
  };

  onSelectMetaInformation = (e, tag) => {
    const checked = e.target.checked;
    this.userSelection[tag] = checked;
  };

  handleOk = e => {
    this.setState({
      visible: false
    });
  };

  handleCancel = e => {
    this.setState({
      visible: false
    });
  };

  handleLoadingStatus = () => {
    const { loading } = this.state;
    this.setState({
      loading: !loading
    });
  };

  handleSubmit = () => {
    this.handleLoadingStatus();
    const { condfigId, workflowId } = this.props;
    const requestOptions = {
      method: "POST",
      headers: authHeader.post(),
      body: JSON.stringify({
        config_id: condfigId || 863,
        workflow_id: workflowId || 28157,
        parent_steps_to_print: this.userSelection.parentWorkflow,
        child_steps_to_print: this.userSelection.childWorkflow,
        static_sections: this.userSelection.staticSections,
        include_flags: this.userSelection.include_flags || false,
        include_comments: this.userSelection.include_comments || false,
        include_archived_related_workflows:
          this.userSelection.include_archived_related_workflows || false
      })
    };

    submitWorkflows(requestOptions)
      .then(response => {
        if (!response.ok) {
          return openNotificationWithIcon({
            type: "error",
            message: "Error in performing the action!"
          });
        } else {
          this.handleCancel();
          this.handleLoadingStatus();
          return openNotificationWithIcon({
            type: "success",
            message:
              "Your request has been submitted, action will be performed shortly."
          });
        }
      })
      .catch(() => {
        openNotificationWithIcon({
          type: "error",
          message: "Please try again later!"
        });
        this.handleLoadingStatus();
      });
  };

  fetchWorkflowDetails = () => {
    fetchWorkflowDetails()
      .then(workflow => {
        this.setState({
          pdfConfig: workflow,
          error: false
        });
      })
      .catch(() => {
        this.setState({
          error: true
        });
      });
  };

  renderParentWorkflow = steps => {
    if (!steps) return null;
    return steps.map((step, key) => {
      return (
        <div key={key}>
          <Checkbox
            className={css`
              font-size: 17px;
              margin-left: 15px;
              margin-top: 3px;
            `}
            onChange={event =>
              this.onSelectWorkflow(
                event,
                step.value,
                "parentWorkflow",
                "PARENT_WORKFLOW"
              )
            }
          >
            {step.label}
          </Checkbox>
        </div>
      );
    });
  };

  renderChildWorkflow = workflows => {
    if (!workflows) return null;
    return workflows.map((workflow, key) => {
      return workflow.steps.map(step => (
        <div
          key={key}
          className={css`
            width: 50%;
          `}
        >
          <h2>{workflow.label}</h2>
          <Checkbox
            className={css`
              font-size: 17px;
              margin-left: 15px;
              margin-top: 3px;
            `}
            onChange={event =>
              this.onSelectWorkflow(
                event,
                step.value,
                workflow.value,
                "CHILD_WORKFLOW"
              )
            }
          >
            {step.label}
          </Checkbox>
        </div>
      ));
    });
  };

  renderStaticWorkflow = sections => {
    if (!sections) return null;
    return sections.map((section, key) => (
      <div key={key}>
        <Checkbox
          className={css`
            font-size: 17px;
            margin-left: 15px;
            margin-top: 3px;
          `}
          onChange={event =>
            this.onSelectWorkflow(
              event,
              section.value,
              "staticSections",
              "STATIC_SECTIONS"
            )
          }
        >
          {section.label}
        </Checkbox>
      </div>
    ));
  };

  renderMetaInformation = () => {
    return META_INFO.map((field, key) => (
      <div
        className={css`
          width: 33%;
        `}
        key={key}
      >
        <Checkbox
          className={css`
            font-size: 17px;
            margin-left: 15px;
            margin-top: 3px;
          `}
          onChange={event => this.onSelectMetaInformation(event, field.value)}
        >
          {field.label}
        </Checkbox>
      </div>
    ));
  };

  renderFetchAgain = () => {
    return (
      <div className="mr-top-lg text-center text-bold text-metal">
        <FormattedMessage id="errorMessageInstances.noWorkflowDetails" />
        <div
          className={css`
            margin-top: 15px;
            cursor: pointer;
          `}
          onClick={() => this.fetchWorkflowDetails()}
        >
          <FormattedMessage
            className="mr-bottom-lg"
            id="commonTextInstances.reloadWorkflowDetails"
          />
          <Icon type="reload" style={{ marginLeft: "5px" }} />
        </div>
      </div>
    );
  };

  render = () => {
    const { pdfConfig, visible, loading, error } = this.state;
    return (
      <Modal
        footer={null}
        bodyStyle={{ padding: "30px 0px", maxHeight: 530, overflowY: "auto" }}
        width="77vw"
        destroyOnClose={true}
        visible={visible}
        onOk={this.handleOk}
        onCancel={this.handleCancel}
        className="workflow-modal"
      >
        <div style={{ borderRadius: 5 }}>
          <div
            style={{
              background: "white"
            }}
          >
            <div>
              {error ? (
                this.renderFetchAgain()
              ) : (
                <div style={{ margin: "0px 35px" }}>
                  {pdfConfig ? (
                    <>
                      <h2>{pdfConfig.results[0].parent_workflows.label}</h2>
                      {this.renderParentWorkflow(
                        pdfConfig.results[0].parent_workflows.steps
                      )}
                      <div
                        className={css`
                          display: flex;
                          flex-direction: row;
                          margin-top: 30px;
                          width: 100%;
                        `}
                      >
                        {this.renderChildWorkflow(
                          pdfConfig.results[0].child_workflows
                        )}
                      </div>
                      <div
                        className={css`
                          margin-top: 30px;
                        `}
                      >
                        <h2>Static Section</h2>
                        {this.renderStaticWorkflow(
                          pdfConfig.results[0].extra_sections
                        )}
                      </div>
                      <div
                        className={css`
                          margin-top: 30px;
                          display: flex;
                          width: 100%;
                        `}
                      >
                        {this.renderMetaInformation()}
                      </div>
                      <div
                        className={css`
                          .ant-btn-primary:focus,
                          .ant-btn-primary:hover,
                          .ant-btn-primary:active {
                            background-color: #025fb5;
                            border-color: #025fb5;
                          }
                        `}
                      >
                        <Button
                          loading={loading}
                          className={css`
                            margin-top: 30px;
                          `}
                          onClick={this.handleSubmit}
                          type="primary"
                        >
                          SUBMIT
                        </Button>
                      </div>
                    </>
                  ) : null}
                </div>
              )}
            </div>
          </div>
        </div>
      </Modal>
    );
  };
}

export default ChecklistModal;
