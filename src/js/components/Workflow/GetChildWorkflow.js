import React, { Component } from "react";
import _ from "lodash";
import { connect } from "react-redux";
import { calculatedData } from "./calculated-data";
import WorkflowItem from "./WorkflowItem";

const { getProcessedData } = calculatedData;
class GetChildWorkflow extends React.Component {
  constructor() {
    super();
  }

  render = () => {
    let props = this.props;
    let childList = null;
    let workflowId = props.workflow.id;

    if (props.workflowChildren[workflowId].loading) {
      return null;
    }
    if (props.loading) {
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
