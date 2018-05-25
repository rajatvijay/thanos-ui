import React, { Component } from "react";
import { Icon } from "antd";
import _ from "lodash";
import { connect } from "react-redux";
import StepBodyForm from "./step-body-form";

class StepBody extends Component {
  constructor(props) {
    super(props);
    this.state = {
      stepCompletedBy: null,
      stepApprovedBy: null
    };
  }

  shouldComponentUpdated = nextProps => {
    if (
      this.props.currentStepFields.currentStepFields !== {} &&
      this.props.currentStepFields.currentStepFields !==
        nextProps.currentStepFields.currentStepFields
    ) {
      return true;
    } else {
      return false;
    }
  };

  render = () => {
    const loading =
      this.props.currentStepFields.loading ||
      this.props.workflowDetails.loading;

    var stepData = null;

    if (!loading && this.props.currentStepFields) {
      stepData = this.props.currentStepFields.currentStepFields;
    } else {
      stepData = "no data";
    }

    return (
      <div className="pd-ard-lg">
        {loading ? (
          <div className="text-center mr-top-lg">
            <Icon type={"loading"} />
          </div>
        ) : stepData ? (
          <StepBodyForm stepData={stepData} {...this.props} />
        ) : (
          <div className="text-center mr-top-lg">
            <Icon type={"loading"} />
          </div>
        )}
      </div>
    );
  };
}

function mapStateToProps(state) {
  const { currentStepFields, workflowDetails } = state;
  return {
    currentStepFields,
    workflowDetails
  };
}

export default connect(mapStateToProps)(StepBody);
