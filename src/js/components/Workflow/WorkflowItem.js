import React, { Component } from "react";
import { Layout, Icon, Divider, Modal } from "antd";
import { connect } from "react-redux";
import {
  createWorkflow,
  workflowActions,
  stepPreviewActions,
  navbarActions,
  toggleMinimalUI
} from "../../actions";
import _ from "lodash";
import Collapsible from "react-collapsible";
import { Link } from "react-router-dom";
import StepPreview from "./StepPreview";
import { CreateRelated } from "./CreateRelated";
// import WorkflowBody from "./WorkflowBody";
import { WorkflowHeader } from "./WorkflowHeader";
import { workflowDetailsService } from "../../services";
import { calculatedData } from "./calculated-data";
import WorkflowDetails from "../WorkflowDetails";
import SidebarView from "../../../modules/workflows/sidebar/components";
import ModalHeader from "./ModalHeader";
import ModalFooter from "./ModalFooter";
import { css } from "emotion";
import { connectableObservableDescriptor } from "rxjs/internal/observable/ConnectableObservable";
import { withRouter } from "react-router-dom";

const { getProcessedData } = calculatedData;
const { Content, Sider } = Layout;

class WorkflowItem extends React.Component {
  state = {
    relatedWorkflow: null,
    relatedKinds: [],
    showRelatedWorkflow: false,
    opened: false,
    showQuickDetails: false,
    loadingRelatedWorkflow: false,
    stepGroupData: null,
    stepdataloading: true,
    initialLoad: true,
    collapseDisabled: false,
    visible: false,
    selectedStep: null,
    selectedGroup: null
  };

  componentDidMount = () => {
    this.setState({
      relatedWorkflow: this.getRelatedTypes(),
      showRelatedWorkflow: false
    });
  };

  componentDidUpdate = (prevProps, prevState) => {
    let id = this.props.workflow.id;
    const { stepGroupData } = this.state;

    if (
      this.props.workflowChildren[id] !== prevProps.workflowChildren[id] &&
      _.size(this.props.workflowChildren[id].children)
    ) {
      this.setState(
        { children: this.props.workflowChildren[id].children },
        () => {
          this.assignChilrenToKind();
        }
      );
    }
  };

  setParameter = (selectedStep, selectedGroup) => {
    this.setState({ selectedGroup, selectedStep });
  };

  showModal = id => {
    //this.props.history.replace("/workflows/instances"+this.props.location.search.params.id);
    //this.props.location.search = ""
    //  if(this.props.match.params.id){
    //   this.props.history.replace("/workflows/instances/"+this.props.match.params.id+"/");
    //  }
    if (!this.props.minimalUI) this.props.toggleMinimalUI();

    this.setState({
      visible: true,
      workflowId: id
    });

    this.addToOpenModalList();
  };

  addToOpenModalList = () => {
    let { list } = this.props.expandedWorkflows;

    if (!list.find(item => item.id === this.props.workflow.id)) {
      list.push(this.props.workflow);
      this.props.dispatch(workflowActions.expandedWorkflowsList(list));
    }
  };

  removeFromOpenModalList = () => {
    let { list } = this.props.expandedWorkflows;
    let index = list.indexOf(this.props.workflow);

    if (index > -1) {
      list.splice(index, 1);
      this.props.dispatch(workflowActions.expandedWorkflowsList(list));
    }
  };

  calcTopPos = () => {
    let { list } = this.props.expandedWorkflows;
    const index = list.indexOf(this.props.workflow);
    let style = {
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
    // console.log(e);
    this.setState({
      visible: false
    });
    this.removeFromOpenModalList();
  };

  handleCancel = e => {
    // console.log(this.props);
    //this.props.history.replace("/workflows/instances");
    // console.log(e);
    this.props.toggleMinimalUI();
    this.setState({
      visible: false
    });
    this.removeFromOpenModalList();
  };

  setWorkflowId = id => {
    this.setState({ workflowId: id });
  };

  assignChilrenToKind = () => {
    let rk = this.state.relatedWorkflow;
    let children = this.state.children;

    let workflowFilterByKind = _.map(rk, kind => {
      let k = kind;
      k.workflows = [];
      _.forEach(children, child => {
        if (child.definition.kind === kind.id) {
          // console.log("matches");
          k.workflows.push(child);
        }
      });
      return k;
    });

    this.setState({
      relatedKinds: _.orderBy(
        workflowFilterByKind,
        ["workflows.length"],
        ["desc"]
      )
    });
  };

  getRelatedTypes = () => {
    let that = this;
    let rt = [];
    if (this.props.workflow.definition.related_types.length !== 0) {
      _.map(this.props.workflow.definition.related_types, function(rtc) {
        _.filter(that.props.kinds.workflowKind, function(kind) {
          if (kind.tag === rtc) {
            rt.push(kind);
          }
        });
      });
    }
    return rt;
  };

  createChildWorkflow = e => {
    if (e.key === "users") {
      const payload = {
        workflowID: this.props.workflow.id
      };

      this.props.dispatch(workflowActions.showUserWorkflowModal(payload));
    } else {
      const kindTag = e.key;
      const kind = this.props.kinds.workflowKind.find(
        kind => kind.tag == kindTag
      );
      const payload = {
        status: kind && kind.default_status,
        kind: kindTag,
        name: "Draft",
        parent: this.props.workflow.id
      };

      this.props.dispatch(createWorkflow(payload));
    }
  };

  render = () => {
    const { workflow } = this.props;
    const { statusType } = this.props.workflowFilterType;
    const hasChildren = this.props.workflow.children_count !== 0;
    const { list } = this.props.expandedWorkflows;

    return (
      <div
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
          {/* {this.state.visible && ( */}
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
            />
            <div style={{ maxHeight: 600, overflowY: "scroll" }}>
              <WorkflowDetails
                workflowItem={this.props.workflow}
                location={this.props.location}
                minimalUI={this.props.minimalUI}
                workflowIdFromPropsForModal={this.props.workflow.id}
                setParameter={this.setParameter}
              />
            </div>

            <ModalFooter
              workflowIdFromPropsForModal={this.props.workflow.id}
              stepId={this.state.selectedStep}
              groupId={this.state.selectedGroup}
            />
          </Modal>

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
            fieldExtra={
              this.props.field && this.props.field.definition.extra
                ? this.props.field.definition.extra
                : null
            }
            addComment={this.props.addComment || null}
            showCommentIcon={this.props.showCommentIcon}
            isExpanded={this.state.opened}
            config={this.props.config}
            bulkActionWorkflowChecked={this.props.bulkActionWorkflowChecked}
            handleChildWorkflowCheckbox={this.props.handleChildWorkflowCheckbox}
          />

          <div />
          {/* </Collapsible> */}
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
