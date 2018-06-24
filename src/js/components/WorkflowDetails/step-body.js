import React, { Component } from "react";
import { Icon } from "antd";
import { connect } from "react-redux";
import StepBodyForm from "./step-body-form";
import _ from "lodash";

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
      stepData = {};
    }

    var locked_tag = null
    if(stepData.is_locked) {
      let dependent_steps = stepData.definition.dependent_steps;
      let dependent_step_name = _.map(dependent_steps, function(ds) { return ds['label'];});
      locked_tag = <div><div data-show="true" class="ant-tag">To initiate this step, please complete the following steps first:&nbsp; 
        <b>{dependent_step_name.join(", ")}</b></div></div>
    }

    return (
      <div className="pd-ard-lg">
        {locked_tag}
        { locked_tag ? <br/> : null }
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
