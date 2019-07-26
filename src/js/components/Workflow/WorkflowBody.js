import { connect } from "react-redux";

const WorkflowBodyContainer = props => {
  // THIS FILE IS OF NO USE
  return null;
};

function mapPropsToState(state) {
  const { workflowKind, workflowFilterType, workflowChildren } = state;
  return {
    workflowKind,
    workflowFilterType,
    workflowChildren
  };
}

const WorkflowBody = connect(mapPropsToState)(WorkflowBodyContainer);

export default WorkflowBody;
