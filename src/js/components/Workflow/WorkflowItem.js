import React, { Component } from "react";
import { Layout, Icon, Divider } from "antd";
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
import WorkflowBody from "./WorkflowBody";
import { WorkflowHeader } from "./WorkflowHeader";
import { workflowDetailsService } from "../../services";
import { calculatedData } from "./calculated-data";

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
    collapseDisabled: false
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

  assignChilrenToKind = () => {
    let rk = this.state.relatedWorkflow;
    let children = this.state.children;

    let workflowFilterByKind = _.map(rk, kind => {
      let k = kind;
      k.workflows = [];
      _.forEach(children, child => {
        if (child.definition.kind === kind.id) {
          console.log("matches");
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
    this.setState({ opened: true });

    if (!this.state.stepGroupData) {
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

    const { statusType } = this.props.workflowFilterType;
    const hasChildren = this.props.workflow.children_count !== 0;
    const showQuickDetailsFunction =
      this.shouldShowQuickDetails() && this.showQuickDetails;

    return (
      <div
        className={
          "paper workflow-list-item " +
          (this.state.opened
            ? " opened"
            : null + hasChildren ? " has-children " : null)
        }
      >
        <div className="collapse-wrapper">
          <Collapsible
            trigger={
              <div className="lc-card">
                <WorkflowHeader
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
                />
              </div>
            }
            lazyRender={true}
            transitionTime={200}
            onOpen={this.onOpen}
            onClose={this.onClose}
            hasChildren={hasChildren}
            triggerDisabled={this.state.collapseDisabled}
          >
            <div className="lc-card-wrapper">
              <WorkflowBody
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
              />

              {showQuickDetailsFunction ? (
                <Sider
                  className="comments-sidebar profile-sidebar sidebar-right animated slideInRight"
                  style={{
                    background: "#fff",
                    overflow: "auto",
                    height: "calc(100vh - 65px)",
                    position: "fixed",
                    right: 0,
                    top: "65px",
                    zIndex: 1
                  }}
                  width="700"
                  collapsed={!this.state.showQuickDetails}
                  collapsedWidth={0}
                  collapsible
                  trigger={null}
                >
                  <div className="comment-details" style={{ width: "700px" }}>
                    <div className="sidebar-head">
                      <span className="sidebar-title">
                        {this.props.workflow.name}
                      </span>
                      <Icon
                        type="close"
                        onClick={this.hideQuickDetails}
                        style={{
                          position: "absolute",
                          top: "0px",
                          right: "0px",
                          width: "48px",
                          height: "48px",
                          lineHeight: "48px",
                          cursor: "pointer"
                        }}
                      />
                    </div>
                    <Content style={{ padding: "15px", paddingBottom: "50px" }}>
                      <StepPreview />
                    </Content>
                  </div>
                </Sider>
              ) : null}
            </div>
          </Collapsible>
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

export default connect(mapPropsToState)(WorkflowItem);
