import React, { Component } from "react";
import _ from "lodash";
import { connect } from "react-redux";
import WorkflowItem from "./WorkflowItem";
import { Tabs } from "antd";

const TabPane = Tabs.TabPane;

class GetChildWorkflow extends Component {
  constructor(props) {
    super(props);
    this.state = { relatedKinds: [], children: [] };
  }

  componentDidUpdate = prevProps => {
    const { id } = this.props.workflow;

    if (
      _.size(this.props.relatedKinds) &&
      _.size(this.state.relatedKinds) === 0
    ) {
      this.setState({ relatedKinds: this.props.relatedKinds });
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
    let rk = this.state.relatedKinds;
    let children = this.state.children;

    let workflowFilterByKind = _.map(rk, kind => {
      let k = {
        name: kind.name,
        id: kind.id,
        workflows: []
      };
      _.forEach(children, child => {
        if (child.definition.kind === kind.id) {
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

  render() {
    const { props } = this;
    const cbtn = (
      <span style={{ paddingRight: "20px" }}>{props.createButton}</span>
    );
    let workflowId = props.workflow.id;

    return (
      <Tabs tabBarExtraContent={cbtn}>
        {_.map(this.state.relatedKinds, function(kind, key) {
          return (
            <TabPane
              tab={kind.name + " (" + _.size(kind.workflows) + ")"}
              key={kind.name}
            >
              <div className="pd-ard-lg">
                {_.size(kind.workflows) ? (
                  _.map(kind.workflows, function(item, index) {
                    return (
                      <WorkflowItem
                        isChild={true}
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
                        workflowChildren={props.workflowChildren}
                      />
                    );
                  })
                ) : (
                  <div className="pd-ard-sm">No workflows</div>
                )}
              </div>
            </TabPane>
          );
        })}
      </Tabs>
    );
  }
}

function mapPropsToState(state) {
  const { workflowKind, workflowFilterType, workflowChildren } = state;
  return {
    workflowKind,
    workflowFilterType,
    workflowChildren
  };
}

const ChildWorkflow = connect(mapPropsToState)(GetChildWorkflow);

export default GetChildWorkflow;
