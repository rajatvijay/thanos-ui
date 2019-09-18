import React, { Component } from "react";
import { Table } from "antd";
import { commonFunctions } from "./commons";
import { dunsFieldActions } from "../../../actions";
import NumberFormat from "react-number-format";
import { supportedFieldFormats } from "../../../../config";
import { FormattedMessage } from "react-intl";
import IntegrationLoadingWrapper from "../utils/IntegrationLoadingWrapper";

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
    const payload = {
      workflow: this.props.workflowId,
      fieldId: this.props.field.id
    };

    this.props.dispatch(dunsFieldActions.dunsSaveField(payload));
  };

  selectItem = data => {
    const payload = {
      duns: data.DUNSNumber,
      field_id: this.props.field.id
    };
    this.props.dispatch(dunsFieldActions.dunsSelectItem(payload));
  };

  render = () => {
    const { field, currentStepFields } = this.props;

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

    const finalHTML = (
      <IntegrationLoadingWrapper
        currentStepFields={currentStepFields}
        field={field}
        step={field.step}
        check={"default"}
      >
        <div className="mr-top-lg mr-bottom-lg">
          <GetTable
            selectItem={this.selectItem}
            jsonData={field.integration_json}
          />
        </div>
      </IntegrationLoadingWrapper>
    );

    return (
      <div>
        {getFields(props)} {finalHTML}
      </div>
    );
  };
}

const GetTable = props => {
  // for error
  if (
    props.jsonData.GetCleanseMatchResponse.TransactionResult.ResultText !==
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
      key: "DUNSNumber",
      render: record => (
        <NumberFormat
          displayType="text"
          format={supportedFieldFormats.duns}
          value={record}
        />
      )
    },
    {
      title: <FormattedMessage id="fields.organizationName" />,
      dataIndex: "OrganizationPrimaryName[OrganizationName][$]",
      key: "OrganizationPrimaryName[OrganizationName][$]"
    },
    {
      title: <FormattedMessage id="fields.address" />,
      dataIndex: "PrimaryAddress[PrimaryTownName]",
      key: "PrimaryAddress[PrimaryTownName]"
    },

    {
      title: <FormattedMessage id="fields.tradestyles" />,
      dataIndex: "tradeStyleNames[0][name]",
      key: "tradeStyleNames[0][name]"
    },
    {
      title: <FormattedMessage id="fields.locationType" />,
      dataIndex: "corporateLinkage[familytreeRolesPlayed][0][description]",
      key: "corporateLinkage[familytreeRolesPlayed][0][description]"
    },

    {
      title: <FormattedMessage id="commonTextInstances.status" />,
      dataIndex: "OperatingStatusText[$]",
      key: "OperatingStatusText[$]"
    },
    {
      title: <FormattedMessage id="fields.action" />,
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
