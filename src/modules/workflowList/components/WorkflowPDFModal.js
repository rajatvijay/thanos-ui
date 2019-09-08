import React, { Component } from "react";
import { Modal, Checkbox, Spin, Icon, Row, Col, Button, message } from "antd";
import _ from "lodash";
import {
  getChildWorkflow,
  workflowKindService,
  requestWorflowPDF
} from "../../services";

const CheckboxGroup = Checkbox.Group;

/**
 * TODO:
 */

class WorkflowPDFModal extends Component {
  state = {
    selectedSteps: [],
    isLoading: false,
    errorMessage: null,
    workflows: null,
    workflowKinds: [],
    requestingPDF: false,
    pdfConfig: [],
    childWorkflowStepsSelected: {},
    parentWorkflowStepsSelected: []
  };
  static defaultProps = {
    visible: false,
    width: "80vw"
  };
  parseWorkflowsForCheckboxes = ({
    parentWorkflow,
    childWorkflows,
    workflowKinds
  }) => {
    const parent = extractStepsFromWorkflow(parentWorkflow);
    const child = childWorkflows.map(childWorkflow => {
      return {
        kind: extractKindTagFromWorkflow(childWorkflow, workflowKinds),
        stepsForCheckboxes: extractStepsFromWorkflow(childWorkflow),
        name: childWorkflow.name
      };
    });
    return {
      parent,
      child
    };
  };
  fetchWorkflowsAndKinds = async () => {
    const { workflow: parentWorkflow } = this.props;
    const workflowId = parentWorkflow.id;

    try {
      this.setState({ isLoading: true });
      const { results: workflowKinds } = await workflowKindService.getAll();
      const { results: childWorkflows } = await getChildWorkflow(workflowId);
      this.setState({
        isLoading: false,
        workflowKinds,
        workflows: this.parseWorkflowsForCheckboxes({
          parentWorkflow,
          childWorkflows,
          workflowKinds
        })
      });
    } catch (err) {
      console.error(err);
      this.setState({
        isLoading: false,
        errorMessage: err.message,
        workflows: null
      });
    }
  };
  componentDidMount() {
    if (!this.props.workflow) {
      throw new Error("No parent workflow found");
    }

    this.fetchWorkflowsAndKinds();

    if (!this.props.onOk || !this.props.onCancel) {
      console.warn("WorkflowPDFModal: onOk and onCancel are required props");
    }
    return null;
  }
  handlePDFConfigChange = config => {
    this.setState({
      pdfConfig: config
    });
  };
  handleParentCheckboxStateChange = stepTags => {
    this.setState({
      parentWorkflowStepsSelected: stepTags
    });
  };
  handleChildWorkflowStateChange = (childWorkflow, steps) => {
    this.setState(state => ({
      childWorkflowStepsSelected: {
        ...state.childWorkflowStepsSelected,
        [childWorkflow]: steps
      }
    }));
  };
  renderLoader = () => {
    return (
      <div className="loader">
        <Spin
          indicator={<Icon type="loading" style={{ fontSize: 48 }} spin />}
        />
      </div>
    );
  };
  renderStepsCheckboxes = workflows => {
    return (
      <div>
        <p className="heading">Include the following sections:</p>
        <ParentStepCheckboxes
          steps={workflows.parent}
          onChange={this.handleParentCheckboxStateChange}
        />
        <ChildStepsCheckboxes
          steps={workflows.child}
          onChange={this.handleChildWorkflowStateChange}
        />
      </div>
    );
  };
  renderErrorMessage = errorMessage => {
    return (
      <div>
        <p className="error-message">{errorMessage}</p>
      </div>
    );
  };
  requestPDF = () => {
    const {
      childWorkflowStepsSelected,
      parentWorkflowStepsSelected,
      pdfConfig
    } = this.state;
    const { workflow: parentWorkflow } = this.props;

    const payload = makeRequestPDFPayload({
      parentWorkflow,
      childWorkflowStepsSelected,
      parentWorkflowStepsSelected,
      pdfConfig,
      pdfConfigOptions: this.pdfConfigOptions
    });
    this.setState({ requestingPDF: true });
    requestWorflowPDF(payload)
      .then(() => {
        this.setState({ requestingPDF: false });
        this.props.onOk();
        message.success(
          "Request to generate PDF has been successfully created. You'll soon recieve PDF on you email."
        );
      })
      .catch(err => {
        this.setState({ requestingPDF: false });
        message.error("Oops! Some error occurred. Please try again!");
      });
  };
  pdfConfigOptions = [
    { value: "include_comments", label: "Include Comments" },
    { value: "include_flags", label: "Include Flags" },
    { value: "include_archived_related_workflows", label: "Include Archived" }
  ];
  render() {
    const { visible, width, onOk, onCancel } = this.props;
    const { isLoading, workflows, errorMessage, requestingPDF } = this.state;
    return (
      <Modal
        width={width}
        visible={visible}
        onOk={onOk}
        onCancel={onCancel}
        className="workflow-pdf"
        footer={
          <WorkflowPDFModalFooter
            options={this.pdfConfigOptions}
            onOk={this.requestPDF}
            onCancel={onCancel}
            onChange={this.handlePDFConfigChange}
            isLoading={requestingPDF}
          />
        }
      >
        <div>
          <p className="heading">Generate PDF</p>
          <p>Please select steps to be printed in the CAR report</p>
        </div>

        {isLoading ? this.renderLoader() : null}
        {workflows ? this.renderStepsCheckboxes(workflows) : null}
        {errorMessage ? this.renderErrorMessage(errorMessage) : null}
      </Modal>
    );
  }
}

export default WorkflowPDFModal;

////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////

// Util Component

function ParentStepCheckboxes({ steps, onChange }) {
  return (
    <CheckboxGroup
      onChange={onChange}
      style={{ marginBottom: 10, width: "100%" }}
    >
      <Row type="flex">
        {steps.map((step, index) => (
          <Col xs={6} key={`${index}`}>
            <Checkbox value={step.value}>{step.label}</Checkbox>
          </Col>
        ))}
      </Row>
    </CheckboxGroup>
  );
}

function ChildStepsCheckboxes({ steps, onChange }) {
  return (
    <div type="flex" className="child-checkboxes-outer">
      <div className="child-checkboxes-inner">
        {steps.map((step, index) => (
          <div className="child-checkbox-group-container" key={`${index}`}>
            <p>{step.name}</p>
            <CheckboxGroup
              className="child-checkbox-group"
              onChange={value => onChange(step.kind, value)}
            >
              <ul>
                {step.stepsForCheckboxes.map((option, index) => (
                  <li key={`${index}`}>
                    <Checkbox value={option.value}>{option.label}</Checkbox>
                  </li>
                ))}
              </ul>
            </CheckboxGroup>
          </div>
        ))}
      </div>
    </div>
  );
}

function WorkflowPDFModalFooter({
  options,
  onOk,
  onCancel,
  onChange,
  isLoading
}) {
  return (
    <Row type="flex" justify="space-between">
      <Col xs={16} style={{ textAlign: "left" }}>
        <CheckboxGroup onChange={onChange} options={options} />
      </Col>
      <Col>
        <Button type="default" onClick={onCancel}>
          Cancel
        </Button>
        <Button loading={isLoading} type="primary" onClick={onOk}>
          OK
        </Button>
      </Col>
    </Row>
  );
}

// Utils
function extractStepsFromWorkflow(workflow) {
  const { step_groups: stepGroups } = workflow;
  return _.flatMap(stepGroups, stepGroup => {
    return (stepGroup.steps || []).map(step => ({
      value: step.definition_tag,
      label: step.name
    }));
  });
}

function extractKindTagFromWorkflow(workflow, kinds) {
  const kind = kinds.find(({ id }) => id === workflow.definition.kind);
  return kind ? kind.tag : "none";
}

function makeRequestPDFPayload({
  parentWorkflow,
  childWorkflowStepsSelected,
  parentWorkflowStepsSelected,
  pdfConfig,
  pdfConfigOptions
}) {
  return {
    workflow_id: parentWorkflow.id,
    parent_steps_to_print: parentWorkflowStepsSelected,
    child_steps_to_print: childWorkflowStepsSelected,
    ...pdfConfigOptions.reduce(
      (acc, option) => ({
        ...acc,
        [option.value]: pdfConfig.includes(option.value)
      }),
      {}
    )
  };
}
