import React, { Component } from "react";
import { Modal, Checkbox } from "antd";
import { connect } from "react-redux";
import _ from "lodash";
// import { getChildWorkflow } from "../../services";

const CheckboxGroup = Checkbox.Group;

class WorkflowPDFModal extends Component {
  state = {
    selectedSteps: []
  };
  static defaultProps = {
    visible: false,
    width: "80vw"
  };
  workflowSteps = [];
  // createWorkflowSteps = () => {
  //   return _.flatMap(this.props.workflowDetails.results, stepGroups =>
  //     stepGroups.steps.map(step => ({ value: step.id, label: step.name }))
  //   );
  // };
  componentDidMount() {
    // this.workflowSteps = this.createWorkflowSteps();
    // getChildWorkflow().then(console.log);
    if (!this.props.onOk || !this.props.onCancel) {
      console.warn("WorkflowPDFModal: onOk and onCancel are required props");
    }
    return null;
  }
  onCheckboxStateChange = selectedSteps => {
    this.setState({ selectedSteps });
  };
  render() {
    const { visible, width, onOk, onCancel } = this.props;
    return (
      <Modal width={width} visible={visible} onOk={onOk} onCancel={onCancel}>
        <div>
          <h2>Generate PDF</h2>
          <p>
            Lorem Ipsum is simply dummy text of the printing and typesetting
            industry. Lorem Ipsum has been the industry's standard dummy text
            ever since the 1500s, when an unknown printer took a galley of type
            and scrambled it to make a.
          </p>
        </div>

        <div>
          <h2>Include the following sections: </h2>
          <CheckboxGroup
            options={this.workflowSteps}
            onChange={this.onCheckboxStateChange}
          />
        </div>
      </Modal>
    );
  }
}

// const mapStateToProps = state => ({
//   workflowDetails: state.workflowDetails.workflowDetails.stepGroups
// });

export default connect()(WorkflowPDFModal);
// mapStateToProps
