import React, { Component } from "react";
import { Collapse } from "antd";
import { WorkflowHeader, WorkflowBody } from "./workflow-item";
import { createWorkflow } from "../../actions";
import _ from "lodash";
import Collapsible from "react-collapsible";
import GetChildWorkflow from "./GetChildWorkflow";

class WorkflowItem extends React.Component {
  state = {
    relatedWorkflow: null,
    hasatedWorkflow: false,
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

  showRelatedType = () => {
    console.log("djslkdfjskdjf");
    this.setState({
      relatedWorkflow: !this.state.relatedWorkflow,
      open: this.state.relatedWorkflow
    });
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
                hasChildren={this.props.workflow.children_count}
                showRelatedType={this.state.showRelatedType}
                showRelatedTypeFunc={this.showRelatedType}
                Chidren={
                  hasChildren && this.state.showRelatedWorkflow ? (
                    <div className="child-workflow-wrapper mr-top">
                      <GetChildWorkflow
                        {...this.props}
                        getGroupedData={this.getGroupedData}
                      />
                    </div>
                  ) : null
                }
              />
            </div>
          </Collapsible>
        </div>

        {this.state.opened ? " " : <div className="workflow-divider" />}

        {/*show children here */}
        {hasChildren && this.state.showRelatedWorkflow ? (
          <div className="child-workflow-wrapper mr-top">
            <GetChildWorkflow
              {...this.props}
              getGroupedData={this.getGroupedData}
            />
          </div>
        ) : null}
      </div>
    );
  };
}

export default WorkflowItem;
