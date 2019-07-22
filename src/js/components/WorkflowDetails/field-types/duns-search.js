import React, { Component } from "react";
import { Table, Icon } from "antd";
import _ from "lodash";
import { commonFunctions } from "./commons";
import { dunsFieldActions } from "../../../actions";

const { getIntegrationSearchButton } = commonFunctions;

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
      onSearch: this.onSearch,
      currentStepFields: this.props.currentStepFields,
      is_locked: this.props.is_locked,
      completed: this.props.completed,
      permission: this.props.permission
    };

    let final_html = null;
    if (
      this.props.currentStepFields.integration_data_loading ||
      field.integration_json.status_message == "Fetching data for this field..."
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
      title: "D-U-N-S",
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
      title: "Tradestyle(s)",
      dataIndex: "tradeStyleNames[0][name]",
      key: "tradeStyleNames[0][name]"
    },
    {
      title: "Location Type",
      dataIndex: "corporateLinkage[familytreeRolesPlayed][0][description]",
      key: "corporateLinkage[familytreeRolesPlayed][0][description]"
    },

    {
      title: "Status",
      dataIndex: "OperatingStatusText[$]",
      key: "OperatingStatusText[$]"
    },
    // {
    //   title: "Confidence code (10=highest)",
    //   dataIndex: "MatchQualityInformation[ConfidenceCodeValue]",
    //   key: "MatchQualityInformation[ConfidenceCodeValue]",
    //   defaultSortOrder: "descend"
    // },
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
