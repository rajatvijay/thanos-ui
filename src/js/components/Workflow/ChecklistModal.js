import React from "react";
import { Modal, Checkbox, Button } from "antd";
import { connect } from "react-redux";
import { css } from "emotion";
import { withRouter } from "react-router-dom";
import { authHeader } from "../../_helpers";
import { get as lodashObjectGet, set as lodashObjectSet } from "lodash";

class ChecklistModal extends React.Component {
  state = {
    // TODO: Add a loading key and loader on the button
    visible: false,
    pdfConfig: null
  };

  // To hold the user selection not the checkbox status
  userSelection = {};

  componentDidMount = () => {
    this.fetchWorkflowDetails();
    this.setState({
      visible: true
    });
  };

  fetchWorkflowDetails = () => {
    // TODO: Move this into a service
    // TODO: In the error case, show a placeholder UI
    fetch(
      "https://af3e2827-dd97-40a5-bb17-befe64b64f54.mock.pstmn.io/api/v1/workflow/pdf/config/2133/?trigger_step=step_tag"
    )
      .then(response => response.json())
      .then(workflow => {
        this.setState({
          pdfConfig: workflow
        });
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

  handleSubmit = () => {
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

        // TODO: Add checkboxes for them too (do this at the very end)
        include_flags: true,
        include_comments: true,
        include_archived_related_workflows: false
      })
    };

    // TODO: Move this into a service
    fetch(
      "https://af3e2827-dd97-40a5-bb17-befe64b64f54.mock.pstmn.io/api/v1/workflow/pdf/print/",
      requestOptions
    )
      .then(function(response) {
        console.log(response);
        // TODO: close modal on success, show notitifcation once successfull
      })
      .catch(function(error) {
        // TODO: Don't close the modal, but shoe the notification for error
        console.log(error);
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

  // TODO: Remove the useless/copied classes and styes
  render = () => {
    const { pdfConfig, visible } = this.state;
    return (
      <Modal
        footer={null}
        bodyStyle={{ padding: 0, maxHeight: 600 }}
        width="77vw"
        destroyOnClose={true}
        visible={visible}
        onOk={this.handleOk}
        onCancel={this.handleCancel}
        className="workflow-modal"
      >
        <div style={{ maxHeight: 600, overflowY: "auto", borderRadius: 5 }}>
          <div
            style={{
              background: "white"
            }}
          >
            <div>
              <div className="printOnly">
                <div style={{ margin: "0px 35px" }}>
                  <div className="text-metal">
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
                        <Button
                          className={css`
                            margin-top: 30px;
                          `}
                          onClick={this.handleSubmit}
                          type="primary"
                        >
                          SUBMIT
                        </Button>
                      </>
                    ) : null}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Modal>
    );
  };
}

// TODO: Do not connect this component
function mapPropsToState(state) {
  const { workflowChildren, expandedWorkflows, minimalUI } = state;
  return {
    workflowChildren,
    expandedWorkflows,
    minimalUI
  };
}

export default withRouter(connect(mapPropsToState)(ChecklistModal));
