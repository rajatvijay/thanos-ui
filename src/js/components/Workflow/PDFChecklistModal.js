import React from "react";
import { Modal, Checkbox, Button, Icon } from "antd";
import { css } from "emotion";
import { get as lodashObjectGet, set as lodashObjectSet } from "lodash";
import {
  submitWorkflows,
  fetchWorkflowDetails
} from "../../services/workflowPdfApi";
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

class PDFChecklistModal extends React.Component {
  state = {
    pdfConfig: null,
    loading: false,
    error: false,
    tickMarkAtleastOne: false
  };

  // To hold the user selection not the checkbox status
  userSelection = {};

  componentDidMount = () => {
    this.fetchWorkflowDetails();
  };

  getUserSelectionObjectPath = (parentTag, workflowType) => {
    if (["PARENT_WORKFLOW", "STATIC_SECTIONS"].includes(workflowType)) {
      return parentTag;
    } else {
      return `childWorkflow.${parentTag}`;
    }
  };

  onSelectWorkflow = (e, tag, parentTag, workflowType) => {
    const { checked } = e.target;
    const path = this.getUserSelectionObjectPath(parentTag, workflowType);

    this.setState({
      tickMarkAtleastOne: false
    });

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
  };

  onSelectMetaInformation = (e, tag) => {
    const { checked } = e.target;
    this.userSelection[tag] = checked;
  };

  handleOk = () => {
    this.props.handleModalVisibility(true);
  };

  handleCancel = () => {
    this.props.handleModalVisibility(false);
  };

  setLoding = loading => this.setState({ loading });

  validateSelection = () => {
    const {
      parentWorkflow,
      childWorkflow,
      staticSections
    } = this.userSelection;
    if (!parentWorkflow || !childWorkflow || !staticSections) {
      this.setState({ tickMarkAtleastOne: true });
      return true;
    }
  };

  handleSubmit = () => {
    const {
      parentWorkflow,
      childWorkflow,
      staticSections,
      include_comments,
      include_archived_related_workflows,
      include_flags
    } = this.userSelection;

    if (this.validateSelection()) return;

    const { workflowId } = this.props;
    const { config_id: configId } = this.state.pdfConfig.results[0];
    const body = {
      config_id: configId,
      workflow_id: workflowId,
      parent_steps_to_print: parentWorkflow,
      child_steps_to_print: childWorkflow,
      extra_sections: staticSections,
      include_flags: !!include_flags,
      include_comments: !!include_comments,
      include_archived_related_workflows: !!include_archived_related_workflows
    };

    this.setLoding(true);
    submitWorkflows(body)
      .then(response => {
        if (!response.ok) {
          this.setLoding(false);
          return openNotificationWithIcon({
            type: "error",
            message: "Error in performing the action!"
          });
        } else {
          this.handleCancel();
          this.setLoding(false);
          return openNotificationWithIcon({
            type: "success",
            message:
              "Your request has been submitted, action will be performed shortly."
          });
        }
      })
      .catch(() => {
        this.setLoding(false);
        openNotificationWithIcon({
          type: "error",
          message: "Please try again later!"
        });
      });
  };

  fetchWorkflowDetails = () => {
    const { definition } = this.props;
    // TODO: Remove this hardcoding also
    const stepTag = "pdf_modal";
    const definitionId = definition.workflowdef;
    this.setLoding(true);
    fetchWorkflowDetails(stepTag, definitionId)
      .then(workflow => {
        this.setState({
          // pdfConfig: WORKFLOW_DATA,
          pdfConfig: workflow,
          error: false
        });
        this.setLoding(false);
      })
      .catch(() => {
        this.setState({
          error: true
        });
        this.setLoding(false);
      });
  };

  renderParentWorkflow = steps => {
    if (!steps) return null;
    return steps.map((step, key) => {
      return (
        <div key={key}>
          {/* TODO: Make this into a styled component */}
          <Checkbox
            className={css`
              font-size: 17px;
              margin-left: 10px;
              margin-top: 3px;
            `}
            // TODO: Extract this into a separate component,
            // so that render does not create a new function everytime
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
    return (
      <div
        className={css`
          width: 100%;
          margin-top: 35px;
        `}
      >
        <h2 style={{ fontSize: 18 }}>Child Workflows</h2>
        <div
          className={css`
            white-space: nowrap;
            overflow-x: scroll;
            display: flex;
            padding-bottom: 20px;
          `}
        >
          {workflows.map((workflow, key) => {
            return (
              <div
                key={key}
                className={css`
                  display: flex;
                  flex-direction: column;
                  width: 50%;
                  margin-top: 20px;
                `}
              >
                <h2 style={{ fontSize: 18 }}>{workflow.label}</h2>

                {workflow.steps.map(step => (
                  <Checkbox
                    key={step}
                    className={css`
                      font-size: 17px;
                      margin-left: 10px !important;
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
                ))}
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  renderStaticWorkflow = sections => {
    if (!sections) return null;
    return sections.map((section, key) => (
      <div key={key}>
        <Checkbox
          className={css`
            font-size: 17px;
            margin-left: 10px;
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
            margin-left: 10px;
            margin-top: 3px;
          `}
          onChange={event => this.onSelectMetaInformation(event, field.value)}
        >
          {field.label}
        </Checkbox>
      </div>
    ));
  };

  renderFetchFailPlaceholder = () => {
    return (
      <div className="mr-top-lg text-center text-bold text-metal">
        <FormattedMessage id="errorMessageInstances.noWorkflowDetails" />
        <div
          className={css`
            margin-top: 15px;
            cursor: pointer;
          `}
          onClick={this.fetchWorkflowDetails}
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

  renderWorkflowDetails = () => {
    const { pdfConfig, loading, tickMarkAtleastOne } = this.state;

    return (
      <div style={{ margin: "0px 35px" }}>
        <h2 style={{ fontSize: 18 }}>
          Parent Workflow: {pdfConfig.results[0].parent_workflows.label}
        </h2>
        {this.renderParentWorkflow(pdfConfig.results[0].parent_workflows.steps)}
        <div
          className={css`
            display: flex;
            flex-direction: row;
            flex-wrap: wrap;
            margin-top: 30px;
            width: 100%;
          `}
        >
          {this.renderChildWorkflow(pdfConfig.results[0].child_workflows)}
        </div>
        <div
          className={css`
            margin-top: 30px;
          `}
        >
          <h2 style={{ fontSize: 18 }}>Static Section</h2>
          {this.renderStaticWorkflow(pdfConfig.results[0].extra_sections)}
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
          {tickMarkAtleastOne ? (
            <span
              className={css`
                margin-left: 10px;
                color: red;
              `}
            >
              &#9432; Please select atleast one from all categories to continue.
            </span>
          ) : null}
        </div>
      </div>
    );
  };

  renderEmptyDataMessage = () => {
    return (
      <div className="mr-top-lg text-center text-bold text-metal">
        <FormattedMessage id="errorMessageInstances.resultIsEmpty" />
      </div>
    );
  };

  renderModalContent = () => {
    const { pdfConfig, error } = this.state;

    return error
      ? this.renderFetchFailPlaceholder()
      : !!pdfConfig
      ? !pdfConfig.results.length
        ? this.renderEmptyDataMessage()
        : this.renderWorkflowDetails()
      : null;
  };

  render = () => {
    const { visible } = this.props;
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
            {this.renderModalContent()}
          </div>
        </div>
      </Modal>
    );
  };
}

export default PDFChecklistModal;
