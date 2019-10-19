// TODO: This component should not be a part of this modal
import React, { Component } from "react";
import { Modal } from "antd";
import ModalHeader from "./ModalHeader";
import ModalFooter from "./ModalFooter";
import WorkflowDetails from "../../../../js/components/WorkflowDetails";
import { connect } from "react-redux";
import { workflowActions, toggleMinimalUI } from "../../../../js/actions";
import { withRouter } from "react-router-dom";

class WorkflowDetailsModal extends Component {
  state = {
    selectedStep: null,
    selectedGroup: null
  };
  // TODO: Expanded workflow list is used to show cascading position of the modal
  // when more than one modal are open at the same time
  calcTopPos = () => {
    const { list } = this.props.expandedWorkflows;
    const index = list.indexOf(this.props.workflow);
    const style = {
      left: "21vw",
      margin: 0,
      top: "calc((100vh - 600px) / 2)"
    };

    if (index > -1) {
      const topPosition = (600 - index * 120).toString() + "px";
      style.top = `calc((100vh - ${topPosition}) / 2)`;
    }

    return style;
  };
  handleOk = e => {
    this.props.close();
    this.removeFromOpenModalList();
  };

  handleCancel = e => {
    this.props.toggleMinimalUI();
    this.props.close();
    this.removeFromOpenModalList();
  };
  removeFromOpenModalList = () => {
    const { list } = this.props.expandedWorkflows;
    const index = list.indexOf(this.props.workflow);

    if (index > -1) {
      list.splice(index, 1);
      this.props.dispatch(workflowActions.expandedWorkflowsList(list));
    }
  };
  setCurrentGroupAndStep = (selectedStep, selectedGroup) => {
    this.setState({ selectedGroup, selectedStep });
  };
  addToOpenModalList = () => {
    const { list } = this.props.expandedWorkflows;

    if (!list.find(item => item.id === this.props.workflow.id)) {
      list.push(this.props.workflow);
      this.props.dispatch(workflowActions.expandedWorkflowsList(list));
    }
  };
  componentDidMount() {
    if (!this.props.minimalUI) this.props.toggleMinimalUI();
  }
  componentDidUpdate(prevProps) {
    if (prevProps.workflow !== this.props.workflow) {
      if (!this.props.minimalUI) this.props.toggleMinimalUI();
    }
  }
  render() {
    const { visible, workflow } = this.props;
    if (!workflow || !visible) {
      return null;
    }
    return (
      <Modal
        style={this.calcTopPos()}
        footer={null}
        bodyStyle={{ padding: 0, maxHeight: 600 }}
        width="77vw"
        destroyOnClose={true}
        visible={visible}
        onOk={this.handleOk}
        onCancel={this.handleCancel}
        className="workflow-modal"
      >
        <ModalHeader
          workflow={workflow}
          stepId={this.state.selectedStep}
          groupId={this.state.selectedGroup}
          toggleMinimalUI={this.props.toggleMinimalUI}
        />
        <div style={{ maxHeight: 600, overflowY: "scroll" }}>
          <WorkflowDetails
            workflowItem={this.props.workflow}
            location={this.props.location}
            minimalUI={this.props.minimalUI}
            closeModal={this.handleCancel}
            workflowIdFromPropsForModal={this.props.workflow.id}
            setCurrentGroupAndStep={this.setCurrentGroupAndStep}
            // fieldExtra={this.props.fieldExtra}
          />
        </div>

        <ModalFooter
          workflowIdFromPropsForModal={this.props.workflow.id}
          stepId={this.state.selectedStep}
          groupId={this.state.selectedGroup}
          toggleMinimalUI={this.props.toggleMinimalUI}
        />
      </Modal>
    );
  }
}

function mapPropsToState(state) {
  const { expandedWorkflows, minimalUI } = state;
  return {
    expandedWorkflows,
    minimalUI
  };
}

export default connect(
  mapPropsToState,
  { toggleMinimalUI }
)(withRouter(WorkflowDetailsModal));
