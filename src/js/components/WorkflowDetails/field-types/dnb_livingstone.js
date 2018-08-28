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
      <Col span={5}>
        <Button type="primary" className="btn-block" onClick={props.onSearch}>
          Screen for Sanctions & Watchlists
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
class DnbLivingstone extends Component {
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
  if (props.jsonData.TransactionResult.ResultID != "PD021") {
    return (
      <div className="text-center text-red">
        {props.jsonData.TransactionResult.ResultText}
      </div>
    );
  }

  if (
    !_.size(props.jsonData.OrderProductResponseDetail.Product.MatchCandidate)
  ) {
    return <div className="text-center text-red">No match found!</div>;
  }

  const data = props.jsonData.OrderProductResponseDetail.Product.MatchCandidate;

  const columns = [
    {
      title: "Potential Maches",
      dataIndex: "PrimaryName",
      render: (text, record, index) => {
        let screening_names = record.ScreeningNames;
        let screening_names_html = "";
        if (_.size(screening_names)) {
          screening_names_html = (
            <span>
              {_.map(screening_names, function(name) {
                return (
                  <span>
                    <span>Name: {name.SubjectName}</span>
                    <br />
                    <span>Match Strength: {name.MatchStrengthValue}</span>
                    <br />
                    <br />
                  </span>
                );
              })}
            </span>
          );
        }

        let citations = record.Citations;
        let citations_html = "";
        if (_.size(citations)) {
          citations_html = (
            <span>
              <table>
                <tbody>
                  <tr>
                    <th>Document Date</th>
                    <th>Effective Date</th>
                    <th>Expiration Date</th>
                    <th>Citation</th>
                  </tr>
                  {_.map(citations, function(c) {
                    return (
                      <tr>
                        <td>{c.DocumentDate}</td>
                        <td>{c.EffectiveDate}</td>
                        <td>{c.ExpirationDate}</td>
                        <td>
                          {c.DocumentVolumeReferenceIdentifier || ""}:{c.DocumentPageReferenceIdentifier ||
                            ""}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </span>
          );
        }

        let doc_link =
          "https://s3.amazonaws.com/vetted-static-assets/livingtone_rpltype.html#" +
          record.ScreeningListType;

        return (
          <span>
            <b>
              RPL Type:{" "}
              <a target="_blank" href={doc_link}>
                {record.ScreeningListType}
              </a>
            </b>{" "}
            <br />
            <b>Match Strength Value: {record.MatchStrengthValue}</b> <br />
            <b>
              Screening List Country: {record.ScreeningListCountryISOAlpha2Code}
            </b>{" "}
            <br />
            <br />
            <table>
              <tbody>
                <tr>
                  <td style={{ width: "40%" }}>
                    <b>Screening Names:</b>
                    <br />
                    {screening_names_html}
                  </td>
                  <td style={{ width: "60%" }}>
                    <br />
                    {citations_html}
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

export const Livingstone = props => {
  return <DnbLivingstone {...props} />;
};
