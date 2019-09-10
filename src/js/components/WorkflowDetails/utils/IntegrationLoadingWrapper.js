import React from "react";
import { PropTypes } from "prop-types";
import { size } from "lodash";
import { FormattedMessage } from "react-intl";
import { Icon, Alert } from "antd";

const IntegrationLoadingWrapper = ({
  children,
  currentStepFields,
  field,
  step,
  check,
  ...otherProps
}) => {
  const integration_data_loading =
    currentStepFields[step].integration_data_loading;
  const isLoading =
    integration_data_loading ||
    field.integration_json.status_message === "Fetching data for this field...";
  const fieldError = field.integration_json.status_code === "error";
  let errorMessage = field.integration_json.status_message || (
    <FormattedMessage id="errorMessageInstances.somethingWentWrong" />
  );

  const renderLoading = (
    <div className="text-center mr-top-lg mr-bottom-lg">
      <Icon type={"loading"} />
    </div>
  );

  const renderError = (
    <div className="mr-top-lg mr-bottom-lg">
      <Alert message={errorMessage} type="error" />
    </div>
  );

  const noResult = (
    <div className="text-center text-medium pd-ard-sm text-light mr-top-lg mr-bottom-lg">
      {" "}
      <FormattedMessage id="messages.noResult" />
    </div>
  );

  const checked =
    check === "default"
      ? size(field.integration_json) && !field.integration_json.selected_match
      : check;

  if (isLoading) {
    return renderLoading;
  } else if (fieldError) {
    return renderError;
  } else if (checked) {
    return React.Children.map(children, child => {
      return React.cloneElement(child, { ...otherProps, ...child.props });
    });
  } else {
    return noResult;
  }
};

IntegrationLoadingWrapper.propTypes = {
  currentStepFields: PropTypes.object.isRequired,
  field: PropTypes.object.isRequired,
  step: PropTypes.number.isRequired
};

export default IntegrationLoadingWrapper;
