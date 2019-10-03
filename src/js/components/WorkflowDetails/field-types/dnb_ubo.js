import React, { Component } from "react";
import { Table, Tag } from "antd";
import { size as lodashSize, get as lodashGet } from "lodash";
import { commonFunctions } from "./commons";
import { integrationCommonFunctions } from "./integration_common";
import { dunsFieldActions } from "../../../actions";
import { FormattedMessage } from "react-intl";
import IntegrationLoadingWrapper from "../utils/IntegrationLoadingWrapper";

const { getIntegrationSearchButton } = commonFunctions;

//Field Type DUNS SEARCH
const getFields = props => {
  return getIntegrationSearchButton(props);
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
    const payload = {
      workflow: this.props.workflowId,
      fieldId: this.props.field.id
    };

    this.props.dispatch(dunsFieldActions.dunsSaveField(payload));
  };

  getComment = (e, data) => {
    this.props.getIntegrationComments(data.MemberID, this.props.field.id);
  };

  render = () => {
    const { field, currentStepFields } = this.props;

    const props = {
      field: field,
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
            jsonData={field.integration_json}
            getComment={this.getComment}
            commentCount={field.integration_comment_count}
            flag_dict={field.selected_flag}
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
  // This should take care of scenarios where OrderProductResponse is
  // not present.
  // SENTRY ISSUE : https://sentry.io/organizations/vetted/issues/1205727677/?project=1382744
  if (
    !lodashSize(
      lodashGet(
        props,
        "jsonData.OrderProductResponse.OrderProductResponseDetail.Product.Organization.Linkage.BeneficialOwnership.BeneficialOwners",
        []
      )
    )
  )
    return (
      <div className="text-center text-red">
        <FormattedMessage id="messages.noResult" />!
      </div>
    );

  const resultText = lodashGet(
    props,
    "jsonData.OrderProductResponse.TransactionResult.ResultText",
    null
  );

  if (resultText && resultText !== "Success") {
    return <div className="text-center text-red">{resultText}</div>;
  }

  const data =
    props.jsonData.OrderProductResponse.OrderProductResponseDetail.Product
      .Organization.Linkage.BeneficialOwnership.BeneficialOwners;

  const columns = [
    {
      title: <FormattedMessage id="fields.beneficialOwners" />,
      dataIndex: "PrimaryName",
      render: (text, record, index) => {
        return integrationCommonFunctions.dnb_ubo_html(record);
      },
      key: "PrimaryName"
    },
    {
      title: <FormattedMessage id="workflowsInstances.commentsText" />,
      key: "ubo_index",
      render: record => {
        let flag_data = lodashSize(props.flag_dict[record.MemberID])
          ? props.flag_dict[record.MemberID]
          : {};
        flag_data = lodashSize(flag_data.flag_detail)
          ? flag_data.flag_detail
          : {};
        const css = flag_data.extra || {};
        const flag_name = flag_data.label || null;
        return (
          <span>
            <span
              className="text-secondary text-anchor"
              onClick={e => props.getComment(e, record)}
            >
              {props.commentCount[record.MemberID] ? (
                <FormattedMessage
                  id="commonTextInstances.commentsText"
                  values={{
                    count: props.commentCount[record.MemberID]
                  }}
                />
              ) : (
                <FormattedMessage id="commonTextInstances.addComments" />
              )}
            </span>
            <br />
            {flag_name ? <Tag style={css}>{flag_name}</Tag> : null}
          </span>
        );
      }
    }
  ];

  return <Table dataSource={data} pagination={false} columns={columns} />;
};

export const UBO = props => {
  return <DnbUBO {...props} />;
};
