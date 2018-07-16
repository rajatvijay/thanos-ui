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
import { dunsData } from "./duns_data.js";
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

const search_param_json = [
  {
    label: "Search by company name",
    tag: "duns_search_company",
    type: "text",
    placeholder: "Enter company name",
    size: 2
  },
  {
    label: "Country",
    tag: "duns_search_country",
    type: "country",
    placeholder: "Select country",
    size: 3
  }
];

const getFields = props => {
  return (
    <Row gutter={16}>
      {_.map(props.field.definition.search_param_json, function(item) {
        if (item.type === "text") {
          return (
            <Col span={item.size === 2 ? 12 : 6}>
              <FormItem label={item.label}>
                <Input
                  type="text"
                  id={item.tag}
                  placeholder={item.placeholder}
                  onChange={props.queryChange}
                />
              </FormItem>
            </Col>
          );
        } else {
          return (
            <Col span={item.size === 2 ? 12 : 6}>
              <FormItem label={item.label}>
                <Select
                  id={item.tag}
                  showSearch
                  placeholder="Select "
                  optionFilterProp="children"
                  onChange={props.countryChange}
                >
                  {_.map(countries, function(item) {
                    return <Option value={item.code}>{item.name}</Option>;
                  })}
                </Select>
              </FormItem>
            </Col>
          );
        }
      })}

      <Col span={6}>
        <FormItem label={" "}>
          <Button type="primary" className="btn-block" onClick={props.onSearch}>
            Submit
          </Button>
        </FormItem>
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
      fieldId: this.props.field.id,
      option1Tag: this.props.field.definition.search_param_json[0].tag,
      option2Tag: this.props.field.definition.search_param_json[1].tag,
      option1Value: this.state.field,
      option2Value: this.state.country
    };

    console.log(payload);
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
    field.definition.search_param_json = search_param_json;

    const props = {
      field: field,
      queryChange: this.queryChange,
      countryChange: this.countryChange,
      onSearch: this.onSearch
    };

    return (
      <div>
        {getFields(props)}
        <div className="mr-top-lg mr-bottom-lg">
          <GetTable selectItem={this.selectItem} />
        </div>
      </div>
    );
  };
}

const GetTable = props => {
  const data =
    dunsData.GetCleanseMatchResponse.GetCleanseMatchResponseDetail
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
