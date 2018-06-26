import React, { Component } from "react";
import { Layout, Collapse, Pagination } from "antd";
import { WorkflowHeader, WorkflowBody } from "./workflow-item";
import { workflowActions, createWorkflow } from "../../actions";
import _ from "lodash";
import { calculatedDate } from "./calculated-data";
import Collapsible from "react-collapsible";
import { connect } from "react-redux";

const { Content } = Layout;
const { getProcessedData } = calculatedDate;

const Panel = Collapse.Panel;

class WorkflowList extends Component {
  handlePageChange = (page, rage) => {
    let param = [{ label: "page", value: page }];
    this.props.dispatch(workflowActions.getAll(param));
  };

  onExpand;

  render() {
    let that = this;
    const data = this.props.workflow;
    let page = 1;
    if (data.next) {
      page = data.next.split("?page=");
      page = parseInt(page[1], 10) - 1;
    } else if (data.previous) {
      page = data.previous.split("?page=");
      page = parseInt(page[1], 10) + 1;
    }

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
              <div className="workflow-list">
                {_.map(data.workflow, function(item, index) {
                  let proccessedData = getProcessedData(item.step_groups);

                  return (
                    <WorkflowItem
                      pData={proccessedData}
                      workflow={item}
                      key={index}
                      kinds={that.props.workflowKind}
                      dispatch={that.props.dispatch}
                      workflowFilterType={that.props.workflowFilterType}
                    />
                  );
                })}
              </div>

              {/* <Collapse accordion className="workflow-list ">
                                     {_.map(data.workflow, function(item, index) {
                                       let proccessedData = getProcessedData(item.step_groups);
                     
                                       return (
                                           <Panel
                                             showArrow={false}
                                             header={<WorkflowHeader workflow={item} />}
                                             key={index}
                                             className="lc-card"
                                           >
                                             <WorkflowBody workflow={item} pData={proccessedData} />
                                           </Panel>
                     
                                       );
                                     })}
                                   </Collapse>*/}

              <div className="mr-top-lg text-center pd-bottom-lg">
                <Pagination
                  defaultCurrent={page ? page : 1}
                  total={data.count}
                  onChange={this.handlePageChange.bind(this)}
                />
              </div>
            </div>
          ) : (
            <div className="text-center text-medium text-metal">
              {" "}
              No workflows to show. Try clearing the filters.
            </div>
          )}
        </Content>
      </div>
    );
  }
}

class WorkflowItem extends React.Component {
  state = {
    realtedWorkflow: null,
    showRelatedWorkflow: false,
    opened: false
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
  };

  onOpen = () => {
    this.setState({ opened: true });
  };
  onClose = () => {
    this.setState({ opened: false });
  };

  render = () => {
    let that = this;

    const { statusType } = this.props.workflowFilterType;
    const hasChildren = !_.isEmpty(this.props.workflow.children);
    const isChild = this.props.workflow.parent === null ? true : false;

    return (
      <div
        className={
          "workflow-list-item " + (this.state.opened ? "shadow-2" : "")
        }
      >
        <div className="collapse-wrapper">
          <Collapsible
            trigger={
              <div className="ant-collapse-item ant-collapse-no-arrow lc-card">
                <WorkflowHeader
                  workflow={this.props.workflow}
                  statusType={statusType}
                  kind={this.props.kinds}
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
                realtedKind={this.state.relatedWorkflow}
                onChildSelect={this.onChildSelect}
                workflow={this.props.workflow}
                pData={this.props.pData}
                ondata={this.ondata}
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

        {hasChildren && this.state.showRelatedWorkflow ? (
          <div className="child-workflow-wrapper">
            {_.map(this.props.workflow.children, function(item, index) {
              let proccessedData = getProcessedData(item.step_groups);
              return (
                <WorkflowItem
                  isChild={true}
                  pData={proccessedData}
                  workflow={item}
                  key={index}
                  kinds={that.props.kinds}
                  dispatch={that.props.dispatch}
                  workflowFilterType={that.props.workflowFilterType}
                />
              );
            })}
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

function mapPropsToState(state) {
  const { workflowKind, workflowFilterType } = state;
  return {
    workflowKind,
    workflowFilterType
  };
}

export default connect(mapPropsToState)(WorkflowList);
