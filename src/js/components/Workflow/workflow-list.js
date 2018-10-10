import React, { Component } from "react";
import { Layout, Collapse, Pagination } from "antd";
import { WorkflowHeader, WorkflowBody } from "./workflow-item";
import { workflowActions, createWorkflow } from "../../actions";
import _ from "lodash";
import { calculatedData } from "./calculated-data";
import Collapsible from "react-collapsible";
import { connect } from "react-redux";
import moment from "moment";

const { Content } = Layout;
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

    var result = _.groupBy(data.workflow, occurrenceDay);
    var ListCompletes = _.map(result, function(list, key, index) {
      var listL = _.map(list, function(item, index) {
        let proccessedData = getProcessedData(item.step_groups);

        return (
          <WorkflowItem
            pData={proccessedData}
            workflow={item}
            key={index}
            kinds={that.props.workflowKind}
            dispatch={that.props.dispatch}
            workflowFilterType={that.props.workflowFilterType}
            onStatusChange={that.onStatusChange}
            statusView={that.props.statusView}
            workflowChildren={that.props.workflowChildren}
          />
        );
      });

      return (
        <span key={key} className="month-group">
          <div className={"h6 grouping-head " + key}>{key}</div>
          <div className="paper">{listL}</div>
        </span>
      );
    });

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
              <div className="workflow-list">{ListCompletes}</div>
              <div className="mr-top-lg text-center pd-bottom-lg">
                <Pagination
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
              No workflows to show. Try clearing the filters or{" "}
              <span
                className="text-underline text-anchor"
                onClick={this.reload}
              >
                reload
              </span>
            </div>
          )}
        </Content>
      </div>
    );
  }
}

class WorkflowItem extends React.Component {
  state = {
    relatedWorkflow: null,
    showRelatedWorkflow: false,
    opened: false,
    loadingRelatedWorkflow: false
  };

  componentDidMount = () => {
    this.setState({ relatedWorkflow: this.getRelatedTypes() });
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

  // showRelatedType = () => {
  //   this.setState({
  //     relatedWorkflow: !this.state.relatedWorkflow,
  //     open: this.state.relatedWorkflow
  //   });
  // };

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
    this.setState({ showRelatedWorkflow: !this.state.showRelatedWorkflow });

    this.props.dispatch(
      workflowActions.getChildWorkflow(this.props.workflow.id)
    );
  };

  onOpen = () => {
    this.setState({ opened: true });
  };

  onClose = () => {
    this.setState({ opened: false });
  };

  getGroupedData = children => {
    let grouped = _.groupBy(children, function(child) {
      return child.definition.kind;
    });
    return grouped;
  };

  render = () => {
    let that = this;

    const { statusType } = this.props.workflowFilterType;
    const hasChildren = this.props.workflow.children_count !== 0;
    const isChild = this.props.workflow.parent === null ? true : false;

    return (
      <div
        className={"workflow-list-item " + (this.state.opened ? " opened" : "")}
      >
        <div className="collapse-wrapper">
          <Collapsible
            trigger={
              <div className="ant-collapse-item ant-collapse-no-arrow lc-card">
                <WorkflowHeader
                  workflow={this.props.workflow}
                  statusType={statusType}
                  kind={this.props.kinds}
                  onStatusChange={this.props.onStatusChange}
                  dispatch={this.props.dispatch}
                  statusView={this.props.statusView}
                />
              </div>
            }
            lazyRender={true}
            transitionTime={200}
            onOpen={this.onOpen}
            onClose={this.onClose}
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
              />
            </div>
          </Collapsible>

          {hasChildren ? (
            <span
              className="child-workflow-expander text-anchor "
              onClick={this.expandChildWorkflow}
              title="Show child workflow"
            >
              <i className="material-icons" style={{ verticalAlign: "middle" }}>
                {this.state.showRelatedWorkflow ? "remove" : "add"}
              </i>
            </span>
          ) : null}
        </div>

        {/*show children here */}
        {hasChildren && this.state.showRelatedWorkflow ? (
          <div className="child-workflow-wrapper mr-top">
            <ChildWorkflow
              {...this.props}
              getGroupedData={this.getGroupedData}
            />
          </div>
        ) : null}

        {/*this.props.workflow ? (
          <div className="child-workflow-wrapper">
            //]=o  <div className="ant-collapse-item ant-collapse-no-arrow lc-card">
                  <WorkflowHeader
                    workflow={this.props.workflow}
                    statusType={statusType}
                  />
                </div>
              }
              lazyRender={true}
              transitionTime={200}
            >
              <div className="lc-card">
                <WorkflowBody
                  workflow={this.props.workflow}
                  pData={this.props.pData}
                />
              </div>
            </Collapsible>
          </div>
        ) : null*/}
      </div>
    );
  };
}

const GetChildWorkflow = props => {
  let childList = null;
  let workflowId = props.workflow.id;

  if (props.workflowChildren[workflowId].loading) {
    childList = <div className="text-center mr-bottom">loading...</div>;
  } else {
    childList = _.map(
      props.getGroupedData(props.workflowChildren[workflowId].children),
      function(childGroup) {
        return (
          <div className="mr-bottom">
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
                />
              );
            })}
          </div>
        );
      }
    );
  }

  return childList;
};

function mapPropsToState(state) {
  const { workflowKind, workflowFilterType, workflowChildren } = state;
  return {
    workflowKind,
    workflowFilterType,
    workflowChildren
  };
}

const ChildWorkflow = connect(mapPropsToState)(GetChildWorkflow);

export default connect(mapPropsToState)(WorkflowList);
