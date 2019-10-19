import React from "react";
import { Modal } from "antd";
import { connect } from "react-redux";
import {
  createWorkflow,
  workflowActions,
  toggleMinimalUI
} from "../../actions";
import _ from "lodash";
import { WorkflowHeader } from "./WorkflowHeader";
import WorkflowDetails from "../../components/WorkflowDetails";
import ModalHeader from "./ModalHeader";
import ModalFooter from "./ModalFooter";
import { withRouter } from "react-router-dom";

class WorkflowItem extends React.Component {
  state = {
    // TODO: Opened what? Better naming
    opened: false,
    // TODO: Visible what? Better naming
    visible: false,
    selectedStep: null,
    selectedGroup: null
  };

  setParameter = (selectedStep, selectedGroup) => {
    this.setState({ selectedGroup, selectedStep });
  };

  showModal = id => {
    if (!this.props.minimalUI) this.props.toggleMinimalUI();

    this.setState({
      visible: true,
      workflowId: id
    });

    // TODO: Move this to the redux layer
    this.addToOpenModalList();
  };

  // TODO: Move this to the redux layer
  addToOpenModalList = () => {
    const { list } = this.props.expandedWorkflows;

    if (!list.find(item => item.id === this.props.workflow.id)) {
      list.push(this.props.workflow);
      this.props.dispatch(workflowActions.expandedWorkflowsList(list));
    }
  };

  // TODO: Move this to the redux layer
  removeFromOpenModalList = () => {
    const { list } = this.props.expandedWorkflows;
    const index = list.indexOf(this.props.workflow);

    if (index > -1) {
      list.splice(index, 1);
      this.props.dispatch(workflowActions.expandedWorkflowsList(list));
    }
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
    this.setState({
      visible: false
    });
    this.removeFromOpenModalList();
  };

  handleCancel = e => {
    this.props.toggleMinimalUI();
    this.setState({
      visible: false
    });
    this.removeFromOpenModalList();
  };

  render = () => {
    const { workflow } = this.props;
    const { statusType } = this.props.workflowFilterType;
    const hasChildren = this.props.workflow.children_count !== 0;

    return (
      <div
        // TODO: What is this class doing?
        className={
          "paper workflow-list-item " +
          (this.state.opened
            ? " opened"
            : null + hasChildren
            ? " has-children "
            : null)
        }
      >
        <div>
          <Modal
            style={this.calcTopPos()}
            footer={null}
            bodyStyle={{ padding: 0, maxHeight: 600 }}
            width="77vw"
            destroyOnClose={true}
            visible={this.state.visible}
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
                fieldExtra={this.props.fieldExtra}
              />
            </div>

            <ModalFooter
              workflowIdFromPropsForModal={this.props.workflow.id}
              stepId={this.state.selectedStep}
              groupId={this.state.selectedGroup}
              toggleMinimalUI={this.props.toggleMinimalUI}
            />
          </Modal>

          {/* TODO: Pass only the required props */}
          <WorkflowHeader
            visibleModal={this.state.modal}
            showModal={this.showModal}
            isEmbedded={this.props.isEmbedded}
            sortingEnabled={this.props.sortingEnabled}
            rank={this.props.rank}
            workflow={this.props.workflow}
            statusType={statusType}
            kind={this.props.kinds}
            onStatusChange={this.props.onStatusChange}
            dispatch={this.props.dispatch}
            statusView={this.props.statusView}
            hasChildren={hasChildren}
            fieldExtra={this.props.fieldExtra}
            addComment={this.props.addComment || null}
            showCommentIcon={this.props.showCommentIcon}
            isExpanded={this.state.opened}
            config={this.props.config}
            bulkActionWorkflowChecked={this.props.bulkActionWorkflowChecked}
            handleChildWorkflowCheckbox={this.props.handleChildWorkflowCheckbox}
            isCompleted={this.props.isCompleted}
            isLocked={this.props.isLocked}
          />

          <div />
        </div>
      </div>
    );
  };
}

function mapPropsToState(state) {
  const { workflowChildren, expandedWorkflows, minimalUI } = state;
  return {
    workflowChildren,
    expandedWorkflows,
    minimalUI
  };
}

export default withRouter(
  connect(
    mapPropsToState,
    { toggleMinimalUI }
  )(WorkflowItem)
);
