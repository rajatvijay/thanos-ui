import React, { Component } from "react";
import { Layout, Icon, Divider, Modal } from "antd";
import { connect } from "react-redux";
import {
  createWorkflow,
  workflowActions,
  stepPreviewActions,
  navbarActions
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
      this.state.stepGroupData !== prevState.stepGroupData &&
      this.state.initialLoad
    ) {
      this.showQuickDetails();
      this.setState({ showQuickDetails: true, initialLoad: false });
    }

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
    console.log("parameter");
    this.setState({ selectedGroup, selectedStep });
  };

  showModal = id => {
    //this.props.history.replace("/workflows/instances"+this.props.location.search.params.id);
    //this.props.location.search = ""
    //  if(this.props.match.params.id){
    //   this.props.history.replace("/workflows/instances/"+this.props.match.params.id+"/");
    //  }

    this.setState({
      visible: true,
      workflowId: id
    });
  };

  handleOk = e => {
    // console.log(e);
    this.setState({
      visible: false
    });
  };

  handleCancel = e => {
    // console.log(this.props);
    //this.props.history.replace("/workflows/instances");
    // console.log(e);
    this.setState({
      visible: false
    });
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
      const payload = {
        status: 1,
        kind: e.key,
        name: "Draft",
        parent: this.props.workflow.id
      };

      this.props.dispatch(createWorkflow(payload));
    }
  };

  expandChildWorkflow = () => {
    this.setState({ showRelatedWorkflow: true });

    this.props.dispatch(
      workflowActions.getChildWorkflow(this.props.workflow.id)
    );
  };

  showQuickDetails = stepData => {
    let that = this;
    let workflow = this.props.workflow;
    const { stepGroupData } = this.state;
    let stepTrack = {
      workflowId: workflow.id,
      groupId: null,
      stepId: null
    };

    if (stepData) {
      stepTrack = {
        workflowId: workflow.id,
        groupId: stepData.step_group,
        stepId: stepData.id
      };
    } else {
      let group = _.first(
        _.filter(stepGroupData, sg => {
          if (sg.steps && _.size(sg.steps)) return sg;
        })
      );

      let step = _.first(
        _.filter(group.steps, step => {
          if (step.is_enabled) {
            return step;
          }
        })
      );

      stepTrack = {
        workflowId: workflow.id,
        groupId: group.id,
        stepId: step.id
      };
    }

    setTimeout(() => {
      that.setState({ showQuickDetails: true });
    }, 1000);
    //this.props.dispatch(navbarActions.toggleRightSidebar(true));
    this.props.dispatch(stepPreviewActions.getStepPreviewFields(stepTrack));
  };

  hideQuickDetails = () => {
    //this.props.dispatch(navbarActions.toggleRightSidebar(false));
    this.setState({ showQuickDetails: false });
  };

  onWorkflowToggle = action => {
    let list = [];
    let eList = this.props.expandedWorkflows.list;

    if (action === "add") {
      list = eList;
      list.push(this.props.workflow.id);
    } else if (action === "remove") {
      list = _.forEach(eList, (id, index) => {
        if (eList[index] === this.props.workflow.id) {
          eList.splice(index, 1);
        }
      });
    }
    this.props.dispatch(workflowActions.expandedWorkflowsList(list));
  };

  // TODO - remove this quickfix, added for feature toggle / backward compat
  shouldShowQuickDetails = () => {
    const show_quick_details =
      this.props.config &&
      this.props.config.custom_ui_labels &&
      this.props.config.custom_ui_labels.show_quick_details;
    return show_quick_details;
  };

  onOpen = () => {
    if (this.props.workflow.children_count && !this.state.opened)
      this.expandChildWorkflow();

    if (!this.state.opened && !this.state.initialLoad) {
      if (this.shouldShowQuickDetails()) {
        this.showQuickDetails();
        this.props.dispatch(navbarActions.hideFilterMenu());
      }
      this.onWorkflowToggle("add");
    }

    if (!this.state.opened && !this.state.stepGroupData) {
      workflowDetailsService
        .getStepGroup(this.props.workflow.id)
        .then(response => {
          let proccessedData = getProcessedData(response.results);
          this.setState({
            stepGroupData: proccessedData,
            stepdataloading: false
          });
        });
    }

    this.setState({ opened: true });
  };

  onClose = () => {
    if (this.state.opened) {
      this.hideQuickDetails();
      this.onWorkflowToggle("remove");
    }
    this.setState({ opened: false });
  };

  getGroupedData = children => {
    let grouped = _.groupBy(children, function(child) {
      return child.definition.kind.toString();
    });
    return grouped;
  };

  disableCollapse = () => {
    this.setState({ collapseDisabled: true });
  };

  enableCollapse = () => {
    this.setState({ collapseDisabled: false });
  };

  render = () => {
    let that = this;
    //console.log("work",this.props.workflow)
    //const {location}
    // console.log("location", this.props.workflow);
    //console.log("workflow",this.props)
    const { workflow } = this.props;
    const { statusType } = this.props.workflowFilterType;
    const hasChildren = this.props.workflow.children_count !== 0;
    const showQuickDetailsFunction =
      this.shouldShowQuickDetails() && this.showQuickDetails && false;
    console.log("state", this.state);

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
            style={{ left: "21vw", margin: 0 }}
            footer={null}
            bodyStyle={{ padding: 0, maxHeight: 600 }}
            width="77vw"
            destroyOnClose={true}
            visible={this.state.visible}
            onOk={this.handleOk}
            onCancel={this.handleCancel}
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
                minimalUI={true}
                workflowIdFromPropsForModal={this.props.workflow.id}
                setParameter={this.setParameter}
              />
            </div>

            <ModalFooter workflowIdFromPropsForModal={this.props.workflow.id} />
          </Modal>
          {/* )} */}

          {/* <Collapsible
            trigger={
              <div
                className="lc-card"
                style={{
                  boxShadow: "0 2px 4px 0 rgba(0, 0, 0, 0.09)"
                }}
              > */}
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
              that.props.field && that.props.field.definition.extra
                ? that.props.field.definition.extra
                : null
            }
            addComment={this.props.addComment || null}
            showCommentIcon={this.props.showCommentIcon}
            isExpanded={this.state.opened}
            disableCollapse={this.disableCollapse}
            enableCollapse={this.enableCollapse}
            config={this.props.config}
            bulkActionWorkflowChecked={this.props.bulkActionWorkflowChecked}
            handleChildWorkflowCheckbox={this.props.handleChildWorkflowCheckbox}
          />
          {/* </div> */}
          {/* } */}

          {/* // > */}
          <div>
            {/* <WorkflowBody
              {...this.props}
              createButton={
                <CreateRelated
                  relatedKind={this.state.relatedWorkflow}
                  onChildSelect={this.createChildWorkflow}
                />
              }
              isEmbedded={this.props.isEmbedded}
              getGroupedData={this.getGroupedData}
              addComment={this.props.addComment || null}
              showCommentIcon={this.props.showCommentIcon}
              expandedWorkflows={this.props.expandedWorkflows}
              showQuickDetails={showQuickDetailsFunction}
              showRelatedWorkflow={this.state.showRelatedWorkflow}
              workflow={this.props.workflow}
              statusView={this.props.statusView}
              stepdataloading={this.state.stepdataloading}
              stepGroupData={this.state.stepGroupData}
              relatedKinds={
                _.size(this.state.relatedKinds)
                  ? this.state.relatedKinds
                  : this.state.relatedWorkflow
              }
            /> */}

            {showQuickDetailsFunction ? (
              <StepPreview
                workflowName={this.props.workflow.name}
                hideQuickDetails={this.hideQuickDetails}
                showQuickDetails={this.state.showQuickDetails}
              />
            ) : null}
          </div>
          {/* </Collapsible> */}
        </div>
      </div>
    );
  };
}

function mapPropsToState(state) {
  const { workflowChildren } = state;
  return {
    workflowChildren
  };
}

export default withRouter(connect(mapPropsToState)(WorkflowItem));
