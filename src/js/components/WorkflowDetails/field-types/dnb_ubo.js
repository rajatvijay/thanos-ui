import React, { Component } from "react";
//import { authHeader, baseUrl } from "../../../_helpers";
import {
  Form,
  Input,
  Button,
  Row,
  Col,
  Table,
  Icon,
  Divider,
  Select
} from "antd";
import _ from "lodash";
import { commonFunctions } from "./commons";
import { countries } from "./countries.js";
import { dunsFieldActions } from "../../../actions";

const FormItem = Form.Item;
const Option = Select.Option;
const { Column, ColumnGroup } = Table;

//const dunsResponse = JSON.parse(dunsData);

const {
  getLabel,
  field_error,
  getRequired,
  feedValue,
  addCommentBtn
} = commonFunctions;

//Field Type DUNS SEARCH

const getFields = props => {
  return (
    <Row gutter={16} style={{ marginBottom: "50px" }}>
      <Col span={4}>
        <Button type="primary" className="btn-block" onClick={props.onSearch}>
          Get UBOs
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
class DnbUBO extends Component {
  constructor() {
    super();
    this.state = {
      field: null,
      country: null
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
    } else if (
      _.size(field.integration_json) &&
      !field.integration_json.selected_match
    ) {
      final_html = (
        <div>
          {_.size(field.integration_json) ? (
            <div className="mr-top-lg mr-bottom-lg">
              <GetTable jsonData={field.integration_json} />
            </div>
          ) : null}
        </div>
      );
    }

    return (
      <div>
        {getFields(props)} {final_html}
      </div>
    );
  };
}

const GetTable = props => {
  // for error
  if (
    props.jsonData.OrderProductResponse.TransactionResult.ResultText !=
    "Success"
  ) {
    return (
      <div className="text-center text-red">
        {props.jsonData.OrderProductResponse.TransactionResult.ResultText}
      </div>
    );
  }

  if (
    !_.size(
      props.jsonData.OrderProductResponse.OrderProductResponseDetail.Product
        .Organization.Linkage.BeneficialOwnership.BeneficialOwners
    )
  ) {
    return <div className="text-center text-red">No result found!</div>;
  }

  const data =
    props.jsonData.OrderProductResponse.OrderProductResponseDetail.Product
      .Organization.Linkage.BeneficialOwnership.BeneficialOwners;

  const columns = [
    {
      title: "BENEFICIAL OWNERS",
      dataIndex: "PrimaryName",
      render: (text, record, index) => {
        let addr = record.PrimaryAddress;
        let addr_arr = [];
        if (_.size(addr)) {
          addr_arr = [
            _.size(addr.StreetAddressLine)
              ? addr.StreetAddressLine[0]["LineText"]
              : "",
            addr.PrimaryTownName || "",
            addr.TerritoryName || "",
            addr.CountryOfficialName || "",
            addr.PostalCode || ""
          ];
        }
        return (
          <span>
            <b>{record.PrimaryName}</b> <br />
            <table>
              <tbody>
                <tr>
                  <td style={{ width: "50%" }}>
                    D-U-N-S No: {record.DUNSNumber}
                  </td>
                  <td style={{ width: "50%" }}>
                    Member ID: {record.MemberID || "-"}
                  </td>
                </tr>
                <tr>
                  <td>
                    Type:{" "}
                    {record.SubjectTypeDescription
                      ? record.SubjectTypeDescription["$"]
                      : "-"}
                  </td>
                  <td>
                    Legal Form:{" "}
                    {record.LegalFormText ? record.LegalFormText["$"] : "-"}
                  </td>
                </tr>
                <tr>
                  <td>
                    Address: <br />
                    {addr_arr.join(", ") || "-"}
                  </td>
                </tr>
              </tbody>
            </table>
          </span>
        );
      },
      key: "PrimaryName"
    }
  ];

  return <Table dataSource={data} pagination={false} columns={columns} />;
};

export const UBO = props => {
  return <DnbUBO {...props} />;
};
