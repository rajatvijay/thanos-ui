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
  addCommentBtn,
  getIntegrationSearchButton
} = commonFunctions;

//Field Type DUNS SEARCH
const getFields = props => {
  return getIntegrationSearchButton(props);
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

    this.props.dispatch(
      dunsFieldActions.dunsSaveField(payload, this.props.stepData.id)
    );
  };

  selectItem = data => {
    let payload = {
      duns: data.organization.duns,
      field_id: this.props.field.id
    };
    this.props.dispatch(
      dunsFieldActions.dunsSelectItem(payload, this.props.stepData.id)
    );
  };

  render = () => {
    let { field } = this.props;

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
      (this.props.currentStepFields[this.props.stepData.id] &&
        this.props.currentStepFields[this.props.stepData.id]
          .integration_data_loading) ||
      field.integration_json.status_message ===
        "Fetching data for this field..."
    ) {
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
  if (_.size(props.jsonData.error)) {
    return (
      <div className="text-center text-red">
        {props.jsonData.error.errorMessage}
      </div>
    );
  }

  if (!_.size(props.jsonData.matchCandidates)) {
    return <div className="text-center text-red">No result found!</div>;
  }

  const data = props.jsonData.matchCandidates;

  const columns = [
    {
      title: "D-U-N-S",
      dataIndex: "organization[duns]",
      key: "organization[duns]"
    },
    {
      title: "Organization Name",
      dataIndex: "organization[primaryName]",
      key: "organization[primaryName]"
    },

    {
      title: "Tradestyle(s)",
      dataIndex: "organization[tradeStyleNames]",
      render: (text, data, index) => {
        if (_.size(data.tradeStyleNames)) {
          let record = data.tradeStyleNames[0];
          return <span>{record.name}</span>;
        } else {
          return <span>-</span>;
        }
      },
      key: "organization[tradeStyleNames][0][name]"
    },

    {
      title: "Location Type",
      dataIndex:
        "organization[corporateLinkage][familytreeRolesPlayed][0][description]",
      key:
        "organization[corporateLinkage][familytreeRolesPlayed][0][description]"
    },
    {
      title: "Address",
      dataIndex: "organization[primaryAddress][addressCountry]['name']",
      render: (text, data, index) => {
        if (_.size(data.organization.primaryAddress)) {
          let record = data.organization;
          return (
            <span>
              {record.primaryAddress.streetAddress.line1} <br />
              {record.primaryAddress.addressLocality.name} <br />
              {record.primaryAddress.addressRegion.abbreviatedName}{" "}
              {[record.primaryAddress.postalCode]}
              <br />
              {record.primaryAddress.addressCountry.name}
            </span>
          );
        } else {
          return <span>-</span>;
        }
      },
      key: "organization[primaryAddress][addressCountry]['name']"
    },
    // {
    //   title: "Address",
    //   dataIndex: "organization[primaryAddress][addressCountry]['name']",
    //   key: "organization[primaryAddress][addressCountry]['name']"
    //},
    {
      title: "Status",
      dataIndex:
        "organization[dunsControlStatus][operatingStatus][description]",
      key: "organization[dunsControlStatus][operatingStatus][description]"
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

export const DunsDirectPlus = props => {
  return <DunsSearch {...props} />;
};
