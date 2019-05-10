import React, { Component } from "react";
import _ from "lodash";
import { connect } from "react-redux";
import WorkflowItem from "./WorkflowItem";
import { Tabs } from "antd";

const TabPane = Tabs.TabPane;

const GetChildWorkflow = props => {
  let childList = null;
  let workflowId = props.workflow.id;

  const cbtn = (
    <span style={{ paddingRight: "20px" }}>{props.createButton}</span>
  );

  if (
    !props.workflowChildren[workflowId] ||
    props.workflowChildren[workflowId].loading
  ) {
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
  const { workflowKind, workflowFilterType, workflowChildren } = state;
  return {
    workflowKind,
    workflowFilterType,
    workflowChildren
  };
}

const ChildWorkflow = connect(mapPropsToState)(GetChildWorkflow);

export default GetChildWorkflow;
