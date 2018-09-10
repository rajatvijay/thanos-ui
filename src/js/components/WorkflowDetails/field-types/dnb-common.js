import React, { Component } from "react";
//import { authHeader, baseUrl } from "../../../_helpers";
import { Button, Row, Col, Icon, Divider, Select } from "antd";
import _ from "lodash";
import { countries } from "./countries.js";
import { dunsFieldActions } from "../../../actions";
import { commonFunctions } from "./commons";
import FinancialData from "./FinancialData";

const {
  getLabel,
  field_error,
  getRequired,
  feedValue,
  addCommentBtn,
  getIntegrationSearchButton
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
    let financial = false;
    const props = {
      field: field,
      queryChange: this.queryChange,
      countryChange: this.countryChange,
      onSearch: this.onSearch
    };

    let final_html = null;
    if (this.props.currentStepFields.integration_data_loading) {
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

    if (
      _.size(props.field.integration_json) &&
      this.props.field.definition.field_type === "dnb_financials"
    ) {
      financial = true;
    }

    return (
      <div>
        {getFields(props)}
        {final_html}
        {financial ? <FinancialData {...props} /> : null}
        <br />
      </div>
    );
  };
}

export const DnBCommon = props => {
  return <DnBSearch {...props} />;
};
