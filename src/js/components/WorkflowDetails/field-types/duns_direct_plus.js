import React, { Component } from "react";
import { Table } from "antd";
import _ from "lodash";
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

    this.props.dispatch(
      dunsFieldActions.dunsSaveField(payload, this.props.stepData.id)
    );
  };

  selectItem = data => {
    const payload = {
      duns: data.organization.duns,
      field_id: this.props.field.id
    };
    this.props.dispatch(
      dunsFieldActions.dunsSelectItem(payload, this.props.stepData.id)
    );
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
        check="default"
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
      key: "organization[duns]",
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
      dataIndex: "organization[primaryName]",
      key: "organization[primaryName]"
    },

    {
      title: <FormattedMessage id="fields.tradestyles" />,
      dataIndex: "organization[tradeStyleNames]",
      render: (text, data, index) => {
        if (_.size(data.tradeStyleNames)) {
          const record = data.tradeStyleNames[0];
          return <span>{record.name}</span>;
        } else {
          return <span>-</span>;
        }
      },
      key: "organization[tradeStyleNames][0][name]"
    },

    {
      title: <FormattedMessage id="fields.locationType" />,
      dataIndex:
        "organization[corporateLinkage][familytreeRolesPlayed][0][description]",
      key:
        "organization[corporateLinkage][familytreeRolesPlayed][0][description]"
    },
    {
      title: <FormattedMessage id="fields.address" />,
      dataIndex: "organization[primaryAddress][addressCountry]['name']",
      render: (text, data, index) => {
        if (_.size(data.organization.primaryAddress)) {
          const record = data.organization;
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
    {
      title: <FormattedMessage id="commonTextInstances.status" />,
      dataIndex:
        "organization[dunsControlStatus][operatingStatus][description]",
      key: "organization[dunsControlStatus][operatingStatus][description]"
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
            <FormattedMessage id="commonTextInstances.select" />
          </span>
        </span>
      )
    }
  ];

  return (
    <Table
      dataSource={data}
      pagination={false}
      columns={columns}
      rowKey={row => row.organization.duns}
    />
  );
};

export const DunsDirectPlus = props => {
  return <DunsSearch {...props} />;
};
