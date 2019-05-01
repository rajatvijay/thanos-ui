import React, { Component, Fragment } from "react";
import {
  Layout,
  Collapse,
  Pagination,
  Tabs,
  Row,
  Col,
  Icon,
  Menu,
  Dropdown,
  Divider,
  Drawer
} from "antd";
import { WorkflowHeader, WorkflowBody } from "./workflow-item";
import { Link } from "react-router-dom";
import {
  workflowActions,
  createWorkflow,
  workflowDetailsActions,
  navbarActions,
  stepPreviewActions
} from "../../actions";
import _ from "lodash";
import { calculatedData } from "./calculated-data";
import Collapsible from "react-collapsible";
import { connect } from "react-redux";
import moment from "moment";
import { FormattedMessage } from "react-intl";
import StepPreview from "./StepPreview";

const { Content, Sider } = Layout;
const TabPane = Tabs.TabPane;
const { getProcessedData } = calculatedData;

const Panel = Collapse.Panel;

class WorkflowList extends Component {
  handlePageChange = (page, rage) => {
    let param = [{ label: "page", value: page }];
    this.props.dispatch(workflowActions.getAll(param));
  };

  reload = () => {
    this.props.dispatch(workflowActions.getAll());
  };

  getRank = (page, index, count) => {
    const { sortAscending } = this.props;
    if (sortAscending) {
      return (page - 1) * 20 + index;
    } else {
      return count - (page - 1) * 20 - index + 1;
    }
  };

  render() {
    let that = this;
    const data = this.props.workflow;
    let page = 1;
    if (data.next) {
      page = data.next.split("page=");
      page = parseInt(page[1], 10) - 1;
    } else if (data.previous) {
      page = data.previous.split("page=");
      page = parseInt(page[1], 10) + 1;
    }

    var occurrenceDay = function(occurrence) {
      var today = moment().startOf("day");
      var thisWeek = moment().startOf("week");
      var thisMonth = moment().startOf("month");

      if (moment(occurrence.created_at).isAfter(today)) {
        return "Today";
      }
      if (moment(occurrence.created_at).isAfter(thisWeek)) {
        return "This week";
      }
      if (moment(occurrence.created_at).isAfter(thisMonth)) {
        return "This month";
      }
      return moment(occurrence.created_at).format("MMM");
    };

    const workflowWithHumanReadableRiskRank =
      data.workflow &&
      data.workflow.map((w, i) => ({
        ...w,
        rank: that.getRank(page, i + 1, data.count)
      }));

    var result = _.groupBy(workflowWithHumanReadableRiskRank, occurrenceDay);
    if (this.props.isEmbedded) {
      var result = _.groupBy(data.workflow, occurrenceDay);
    }

    var ListCompletes = _.map(result, (list, key) => {
      var listL = _.map(list, function(item, index) {
        let proccessedData = getProcessedData(item.step_groups);

        return (
          <WorkflowItem
            rank={item.rank}
            pData={proccessedData}
            workflow={item}
            key={index}
            kinds={that.props.workflowKind}
            dispatch={that.props.dispatch}
            workflowFilterType={that.props.workflowFilterType}
            onStatusChange={that.onStatusChange}
            statusView={that.props.statusView}
            workflowChildren={that.props.workflowChildren}
            sortingEnabled={that.props.sortingEnabled}
            showFilterMenu={that.props.showFilterMenu}
            fieldExtra={
              that.props.field && that.props.field.definition.extra
                ? that.props.field.definition.extra
                : null
            }
            addComment={that.props.addComment || null}
            showCommentIcon={that.props.showCommentIcon}
            isEmbedded={that.props.isEmbedded}
            expandedWorkflows={that.props.expandedWorkflows}
            config={that.props.config}
          />
        );
      });

      return (
        <span key={key} className="month-group">
          <div className={"h6 grouping-head " + key}>{key}</div>
          <div className="">{listL}</div>
        </span>
      );
    });
console.log("count",data.count,data)
    return (
      <div>
        <Content
          style={{
            //margin: "54px 54px 0",
            overflow: "initial"
            //background: "#fff"
          }}
          className="workflow-list-wrapper"
        >
          {data.workflow && data.workflow.length > 0 ? (
            <div>
              <div
                className={
                  "workflow-list " +
                  (_.size(this.props.expandedWorkflows.list)
                    ? "has-Open-workflow  "
                    : " ") +
                  (!this.props.isEmbedded ? " notEmbedded " : " ")
                }
              >
                {ListCompletes}
              </div>
              <div className="mr-top-lg text-center pd-bottom-lg">
           
                <Pagination
                style={{display:data.workflow && data.workflow.length>10 ? "block":"none"}}
                  pageSize={20}
                  defaultCurrent={page ? page : 1}
                  total={data.count}
                  onChange={this.handlePageChange.bind(this)}
                />
              </div>
            </div>
          ) : (
            <div className="text-center text-medium text-metal">
              {" "}
              <FormattedMessage id="errorMessageInstances.noWorkflowsToShow" />{" "}
              <span
                className="text-underline text-anchor"
                onClick={this.reload}
              >
                <FormattedMessage id="commonTextInstances.reloadText" />
              </span>
            </div>
          )}
        </Content>
      </div>
    );
  }
}

export const CreateRelated = props => {
  const relatedKind = props.relatedKind;

  const menuItems = () => {
    let workflowKindFiltered = [];

    _.map(props.relatedKind, function(item) {
      if (item.is_related_kind && _.includes(item.features, "add_workflow")) {
        workflowKindFiltered.push(item);
      }
    });

    return (
      <Menu onClick={props.onChildSelect}>
        {!_.isEmpty(workflowKindFiltered) ? (
          _.map(workflowKindFiltered, function(item, index) {
            return <Menu.Item key={item.tag}>{item.name}</Menu.Item>;
          })
        ) : (
          <Menu.Item disabled>No related workflow kind</Menu.Item>
        )}
      </Menu>
    );
  };

  const childWorkflowMenu = menuItems(props);

  if (props.relatedKind && _.size(childWorkflowMenu)) {
    return (
      <Dropdown
        overlay={childWorkflowMenu}
        className="child-workflow-dropdown"
        placement="bottomRight"
      >
        <a className="ant-dropdown-link ant-btn main-btn" href="#">
          + <FormattedMessage id="workflowsInstances.createChildButtonText" />
          <i className="material-icons t-14">keyboard_arrow_down</i>
        </a>
      </Dropdown>
    );
  } else {
    return <span />;
  }
};

export class WorkflowItem extends React.Component {
  state = {
    relatedWorkflow: null,
    showRelatedWorkflow: false,
    opened: false,
    showQuickDetails: false,
    loadingRelatedWorkflow: false
  };

  componentDidMount = () => {
    this.setState({
      relatedWorkflow: this.getRelatedTypes(),
      showRelatedWorkflow: false
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

  onChildSelect = e => {
    let payload = {
      status: 1,
      kind: e.key,
      name: "Draft",
      parent: this.props.workflow.id
    };

    this.props.dispatch(createWorkflow(payload));
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
        _.filter(workflow.step_groups, sg => {
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

    if (!this.state.opened) {
      if (this.shouldShowQuickDetails()) {
        this.showQuickDetails();
        this.props.dispatch(navbarActions.hideFilterMenu());
      }
      this.onWorkflowToggle("add");
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

  render = () => {
    let that = this;

    const { statusType } = this.props.workflowFilterType;
    const hasChildren = this.props.workflow.children_count !== 0;
    const isChild = this.props.workflow.parent === null ? true : false;

    let previewHeader = (
      <div>
        <span
          className="float-right text-normal"
          style={{ marginRight: "50px" }}
        >
          <Link
            to={"/workflows/instances/" + this.props.workflow.id}
            className="text-white"
          >
            open <i className="material-icons t-14 text-middle">open_in_new</i>
          </Link>
        </span>
        {this.props.workflow.name}
      </div>
    );

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
              <div className="ant-collapse-item ant-collapse-no-arrow lc-card">
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
                />
              </div>
            }
            lazyRender={true}
            transitionTime={200}
            onOpen={this.onOpen}
            onClose={this.onClose}
            hasChildren={hasChildren}
          >
            <div className="lc-card">
              <WorkflowBody
                isChild={this.props.isChild}
                showRelatedType={this.showRelatedType}
                relatedKind={this.state.relatedWorkflow}
                onChildSelect={this.onChildSelect}
                workflow={this.props.workflow}
                pData={this.props.pData}
                ondata={this.ondata}
                statusView={this.props.statusView}
                showQuickDetails={showQuickDetailsFunction}
              />
              {hasChildren && this.state.showRelatedWorkflow ? (
                <div>
                  <Divider className="no-margin" />
                  <ChildWorkflow
                    {...this.props}
                    createButton={
                      <CreateRelated
                        relatedKind={this.state.relatedWorkflow}
                        onChildSelect={this.onChildSelect}
                      />
                    }
                    isEmbedded={this.props.isEmbedded}
                    getGroupedData={this.getGroupedData}
                    addComment={this.props.addComment || null}
                    showCommentIcon={this.props.showCommentIcon}
                    expandedWorkflows={this.props.expandedWorkflows}
                    showQuickDetails={showQuickDetailsFunction}
                  />
                </div>
              ) : (
                <div className="lc-card-body">
                  <div className="lc-card-section text-right">
                    <CreateRelated
                      relatedKind={this.state.relatedWorkflow}
                      onChildSelect={this.onChildSelect}
                    />
                  </div>
                </div>
              )}

              {/*<Drawer
                width={400}
                title={previewHeader}
                placement="right"
                closable={true}
                mask={false}
                onClose={this.hideQuickDetails}
                visible={this.state.showQuickDetails}
                destroyOnClose={true}
              >
                <StepPreview />
              </Drawer>*/}

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
                    <span className="sidebar-title">{previewHeader}</span>
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
            </div>
          </Collapsible>
        </div>
      </div>
    );
  };
}

const GetChildWorkflow = props => {
  let childList = null;
  let workflowId = props.workflow.id;

  const cbtn = (
    <span style={{ paddingRight: "20px" }}>{props.createButton}</span>
  );

  if (props.workflowChildren[workflowId].loading) {
    return (childList = (
      <div className="text-center mr-bottom">loading...</div>
    ));
  } else {
    let defaultActiveKey = _.find(props.kinds.workflowKind, kind => {
      return (
        props.workflowChildren[workflowId].children[0].definition.kind ===
        kind.id
      );
    });

    childList = (
      <Tabs
        //defaultActiveKey={defaultActiveKey.id.toString()}
        tabBarExtraContent={cbtn}
      >
        {_.map(
          props.getGroupedData(props.workflowChildren[workflowId].children),
          function(childGroup, key) {
            let kind = _.find(props.kinds.workflowKind, {
              id: parseInt(key, 10)
            });

            return (
              <TabPane
                tab={
                  kind
                    ? kind.name + " (" + _.size(childGroup) + ")"
                    : _.size(childGroup)
                }
                key={key.toString()}
              >
                {_.map(childGroup, function(item, index) {
                  let proccessedData = getProcessedData(item.step_groups);
                  return (
                    <WorkflowItem
                      isChild={true}
                      pData={proccessedData}
                      workflow={item}
                      key={index}
                      kinds={props.kinds}
                      dispatch={props.dispatch}
                      workflowFilterType={props.workflowFilterType}
                      statusView={props.statusView}
                      addComment={props.addComment || null}
                      showCommentIcon={props.showCommentIcon}
                      isEmbedded={props.isEmbedded}
                      expandedWorkflows={props.expandedWorkflows}
                      config={props.config}
                    />
                  );
                })}
              </TabPane>
            );
          }
        )}
      </Tabs>
    );
  }

  return childList;
};

function mapPropsToState(state) {
  const {
    workflowKind,
    workflowFilterType,
    workflowChildren,
    showFilterMenu,
    expandedWorkflows,
    config
  } = state;
  return {
    workflowKind,
    workflowFilterType,
    workflowChildren,
    showFilterMenu,
    expandedWorkflows,
    config
  };
}

const ChildWorkflow = connect(mapPropsToState)(GetChildWorkflow);

export default connect(mapPropsToState)(WorkflowList);
