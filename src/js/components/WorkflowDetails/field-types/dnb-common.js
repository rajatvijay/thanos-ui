import React, { Component } from "react";
import { Icon } from "antd";
import _ from "lodash";
import { dunsFieldActions } from "../../../actions";
import { commonFunctions } from "./commons";
import FinancialData from "./FinancialData";
import LitigationData from "./LitigationData";

const {
  getIntegrationSearchButton,
  isDnBIntegrationDataLoading
} = commonFunctions;

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
    let payload = {
      workflow: this.props.workflowId,
      fieldId: this.props.field.id
    };

    this.props.dispatch(dunsFieldActions.dunsSaveField(payload));
  };

  render = () => {
    let { field } = this.props;
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

    let final_html = null;
    if (
      this.props.currentStepFields.integration_data_loading ||
      isDnBIntegrationDataLoading(this.props)
    ) {
      final_html = (
        <div>
          <div className="text-center mr-top-lg">
            <Icon type={"loading"} />
          </div>
        </div>
      );
    }

    if (_.size(props.field.integration_json)) {
      if (
        props.field.integration_json.OrderProductResponse &&
        props.field.integration_json.OrderProductResponse.TransactionResult
          .ResultText != "Success"
      ) {
        final_html = (
          <div className="text-center text-red">
            {
              props.field.integration_json.OrderProductResponse
                .TransactionResult.ResultText
            }
          </div>
        );
      }
    }

    if (_.size(props.field.integration_json)) {
      integration = this.props.field.definition.field_type;
    }

    return (
      <div>
        {getFields(props)}
        {final_html}
        {integration === "dnb_financials" ? <FinancialData {...props} /> : null}
        {integration === "dnb_litigation" ? (
          <LitigationData {...props} />
        ) : null}

        <br />
      </div>
    );
  };
}

export const DnBCommon = props => {
  return <DnBSearch {...props} />;
};
