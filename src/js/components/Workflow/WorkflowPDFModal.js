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
  renderStepsCheckboxes = (workflows, isLoading) => {
    if (isLoading) {
      return (
        <div style={{ width: "100%", textAlign: "center" }}>
          <Spin
            indicator={<Icon type="loading" style={{ fontSize: 48 }} spin />}
          />
        </div>
      );
    }

    return (
      <div>
        <p
          style={{
            fontSize: 20,
            fontWeight: 500,
            color: "black",
            marginBottom: "0.5rem"
          }}
        >
          Include the following sections:
        </p>
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
        <p style={{ textAlign: "center", color: "red" }}>{errorMessage}</p>
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
    console.log(JSON.stringify(payload, null, 4));
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

        // this.props.onOk();
        // message.success(
        //   "Request to generate PDF has been successfully created. You'll soon recieve PDF on you email."
        // );
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
          <p
            style={{
              fontSize: 20,
              fontWeight: 500,
              color: "black",
              marginBottom: "0.5rem"
            }}
          >
            Generate PDF
          </p>
          <p>
            Lorem Ipsum is simply dummy text of the printing and typesetting
            industry. Lorem Ipsum has been the industry's standard dummy text
            ever since the 1500s, when an unknown printer took a galley of type
            and scrambled it to make a.
          </p>
        </div>

        {workflows ? this.renderStepsCheckboxes(workflows, isLoading) : null}
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
    <CheckboxGroup onChange={onChange} style={{ marginBottom: 10 }}>
      <Row type="flex">
        {steps.map(step => (
          <Col xs={6}>
            <Checkbox value={step.value}>{step.label}</Checkbox>
          </Col>
        ))}
      </Row>
    </CheckboxGroup>
  );
}

function ChildStepsCheckboxes({ steps, onChange }) {
  return (
    <div
      type="flex"
      style={{ overflowX: "scroll", width: "100%", marginLeft: -15 }}
    >
      <div style={{ width: "10000px" }}>
        {steps.map(step => (
          <div
            style={{
              display: "inline-block",
              verticalAlign: "top",
              margin: "15px 0"
            }}
          >
            <p
              style={{
                marginBottom: "0.5rem",
                paddingLeft: 15,
                paddingRight: 15,
                fontWeight: 500,
                color: "black"
              }}
            >
              {step.name}
            </p>
            <CheckboxGroup
              style={{
                borderRight: "1px solid #eee",
                width: "100%"
              }}
              onChange={value => onChange(step.kind, value)}
            >
              <ul style={{ listStyleType: "none", padding: "0 20px" }}>
                {step.stepsForCheckboxes.map(option => (
                  <li>
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
  return _.flatMap(stepGroups, stepGroup =>
    stepGroup.steps.map(step => ({
      value: step.definition_tag,
      label: step.name
    }))
  );
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
