import React, { Component } from "react";
import { Modal, Checkbox, Spin, Icon } from "antd";
import { connect } from "react-redux";
import _ from "lodash";
import { getChildWorkflow, workflowKindService } from "../../services";

const CheckboxGroup = Checkbox.Group;

class WorkflowPDFModal extends Component {
  state = {
    selectedSteps: [],
    isLoading: false,
    errorMessage: null,
    workflows: null
  };
  static defaultProps = {
    visible: false,
    width: "80vw"
  };
  parseWorkflowsForCheckboxes = (parentWorkflow, childWorkflows) => {
    return {
      parent: [],
      child: []
    };
  };
  getWorkflows = async () => {
    // TODO: Take these from store
    const { workflow: parentWorkflow } = this.props;
    const workflowId = parentWorkflow.id;
    const kindId = parentWorkflow.definition.kind;

    try {
      this.setState({ isLoading: true });
      const childWrokflows = await getChildWorkflows(workflowId, kindId);
      this.setState({
        isLoading: false,
        workflows: this.parseWorkflowsForCheckboxes(
          parentWorkflow,
          childWrokflows
        )
      });
    } catch (err) {
      this.setState({
        isLoading: false,
        errorMessage: err.message,
        workflows: null
      });
    }
  };
  componentDidMount() {
    if (!this.props.workflow) {
      // TODO: Put a check
    }
    this.getWorkflows();
    if (!this.props.onOk || !this.props.onCancel) {
      console.warn("WorkflowPDFModal: onOk and onCancel are required props");
    }
    return null;
  }
  onCheckboxStateChange = selectedSteps => {
    this.setState({ selectedSteps });
  };
  renderStepsCheckboxes = (workflows, isLoading) => {
    if (isLoading) {
      return <Spin indicator={<Icon type="" spin />} />;
    }

    return (
      <div>
        <h2>Include the following sections: </h2>
        <CheckboxGroup
          options={workflows}
          onChange={this.onCheckboxStateChange}
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
  render() {
    const { visible, width, onOk, onCancel } = this.props;
    const { isLoading, workflows, errorMessage } = this.state;
    return (
      <Modal width={width} visible={visible} onOk={onOk} onCancel={onCancel}>
        <div>
          <h2>Generate PDF</h2>
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

// Utils
async function getChildWorkflows(workflowId, kindId) {
  try {
    // Fetch all kinds
    const { results: kindMap } = await workflowKindService.getAll();

    const workflowTag = kindMap.find(m => m.id === kindId);
    if (!workflowTag) {
      throw new Error("Cant find the workflow Id!");
    }

    // Fetching child workflows
    const { results: childWorkflows } = await getChildWorkflow(
      workflowId,
      workflowTag.tag
    );
    return childWorkflows;
  } catch (err) {
    throw new Error("Some error occurred!");
  }
}
