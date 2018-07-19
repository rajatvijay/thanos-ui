import React, { Component } from "react";
//import { authHeader, baseUrl } from "../../../_helpers";
import { Button, Row, Col, Icon, Divider, Select } from "antd";
import _ from "lodash";
import { countries } from "./countries.js";
import { dunsFieldActions } from "../../../actions";

//Field Type DUNS SEARCH

const getFields = props => {
  // need to figure out how to change the name on search button

  let type_button_map = {
    dnb_company_profile: "Company profile",
    dnb_risk_score: "Risk scores",
    dnb_data_reader: "Data"
  };

  return (
    <Row gutter={16} style={{ marginBottom: "50px" }}>
      <Col span={4}>
        <Button type="primary" className="btn-block" onClick={props.onSearch}>
          Get {type_button_map[props.field.definition.field_type]}
        </Button>
      </Col>

      <Col span={12} style={{ marginTop: "5px" }}>
        {_.map(props.field.search_param_data, function(item) {
          if (_.size(item.answer) && item.answer.answer)
            return (
              <div className="float-left" style={{ marginRight: "15px" }}>
                <span>{item.answer.field__definition__body}</span>:{" "}
                <span>{item.answer.answer}</span>,
              </div>
            );
        })}
      </Col>
    </Row>
  );
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

    return (
      <div>
        {getFields(props)}
        {final_html}
        <br />
      </div>
    );
  };
}

export const DnBCommon = props => {
  return <DnBSearch {...props} />;
};
