import React, { Component } from "react";
import { Icon } from "antd";
import _ from "lodash";
import { dunsFieldActions } from "../../../actions";
import { commonFunctions } from "./commons";
import FinancialData from "./FinancialData";
import LitigationData from "./LitigationData";
import { AmberRoad } from "./fields/AmberRoad.js";
import IntegrationLoadingWrapper from "../utils/IntegrationLoadingWrapper";

const { getIntegrationSearchButton } = commonFunctions;

//Field Type DUNS SEARCH

//Field Type DUNS SEARCH
const getFields = props => {
  return getIntegrationSearchButton(props);
};

//duns field
class DnBSearch extends Component {
  constructor() {
    super();
    this.state = {
      field: null
    };
  }

  onSearch = () => {
    const payload = {
      workflow: this.props.workflowId,
      fieldId: this.props.field.id
    };

    this.props.dispatch(dunsFieldActions.dunsSaveField(payload));
  };

  render = () => {
    const { field, currentStepFields } = this.props;
    let integration = null;
    const props = {
      field: field,
      queryChange: this.queryChange,
      countryChange: this.countryChange,
      onSearch: this.onSearch,
      currentStepFields: this.props.currentStepFields,
      is_locked: this.props.is_locked,
      completed: this.props.completed,
      permission: this.props.permission
    };

    const showResultText =
      _.size(props.field.integration_json) &&
      props.field.integration_json.OrderProductResponse &&
      props.field.integration_json.OrderProductResponse.TransactionResult
        .ResultText !== "Success";

    const finalHTML = (
      <IntegrationLoadingWrapper
        currentStepFields={currentStepFields}
        field={field}
        step={field.step}
        check={showResultText}
      >
        <div className="mr-top-lg mr-bottom-lg">
          <div className="text-center text-red">
            {showResultText &&
              props.field.integration_json.OrderProductResponse
                .TransactionResult.ResultText}
          </div>
        </div>
      </IntegrationLoadingWrapper>
    );

    if (_.size(props.field.integration_json)) {
      integration = this.props.field.definition.field_type;
    }

    return (
      <div>
        {getFields(props)}
        {finalHTML}

        {integration === "dnb_financials" ? <FinancialData {...props} /> : null}
        {integration === "dnb_litigation" ? (
          <LitigationData {...props} />
        ) : null}
        {integration === "amber_road" ? <AmberRoad {...props} /> : null}
        <br />
      </div>
    );
  };
}

export const DnBCommon = props => {
  return <DnBSearch {...props} />;
};
