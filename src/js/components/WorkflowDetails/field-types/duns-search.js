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
          Search DUNS
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
class DunsSearch extends Component {
  constructor() {
    super();
    this.state = {
      field: null,
      country: null
    };
  }

  queryChange = val => {
    this.setState({ field: val.target.value });
  };

  countryChange = val => {
    this.setState({ country: val });
  };

  onSearch = () => {
    let payload = {
      workflow: this.props.workflowId,
      fieldId: this.props.field.id
    };

    this.props.dispatch(dunsFieldActions.dunsSaveField(payload));
  };

  selectItem = data => {
    let payload = {
      duns: data.DUNSNumber,
      field_id: this.props.field.id
    };
    this.props.dispatch(dunsFieldActions.dunsSelectItem(payload));
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
    } else if (
      _.size(field.integration_json) &&
      !field.integration_json.selected_match
    ) {
      final_html = (
        <div>
          {_.size(field.integration_json) ? (
            <div className="mr-top-lg mr-bottom-lg">
              <GetTable
                selectItem={this.selectItem}
                jsonData={field.integration_json}
              />
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
    props.jsonData.GetCleanseMatchResponse.TransactionResult.ResultText !=
    "Success"
  ) {
    return (
      <div className="text-center text-red">
        {props.jsonData.GetCleanseMatchResponse.TransactionResult.ResultText}
      </div>
    );
  }

  const data =
    props.jsonData.GetCleanseMatchResponse.GetCleanseMatchResponseDetail
      .MatchResponseDetail.MatchCandidate;

  const columns = [
    {
      title: "DUNS",
      dataIndex: "DUNSNumber",
      key: "DUNSNumber"
    },
    {
      title: "Organization Name",
      dataIndex: "OrganizationPrimaryName[OrganizationName][$]",
      key: "OrganizationPrimaryName[OrganizationName][$]"
    },
    {
      title: "Address",
      dataIndex: "PrimaryAddress[PrimaryTownName]",
      key: "PrimaryAddress[PrimaryTownName]"
    },
    {
      title: "Status",
      dataIndex: "OperatingStatusText[$]",
      key: "OperatingStatusText[$]"
    },
    {
      title: "Confidence Score",
      dataIndex: "MatchQualityInformation[ConfidenceCodeValue]",
      key: "MatchQualityInformation[ConfidenceCodeValue]",
      defaultSortOrder: "descend"
    },
    {
      title: "Action",
      key: "index",
      render: record => (
        <span>
          <span
            className="text-secondary text-anchor"
            onClick={() => props.selectItem(record)}
          >
            Select
          </span>
        </span>
      )
    }
  ];

  return <Table dataSource={data} pagination={false} columns={columns} />;
};

export const Duns = props => {
  return <DunsSearch {...props} />;
};
