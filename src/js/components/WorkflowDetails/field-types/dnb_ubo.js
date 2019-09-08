import React, { Component } from "react";
import { Table, Icon, Tag, Alert } from "antd";
import _ from "lodash";
import { commonFunctions } from "./commons";
import { integrationCommonFunctions } from "./integration_common";
import { dunsFieldActions } from "../../../actions";
import { FormattedMessage } from "react-intl";

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
    const { field } = this.props;

    const props = {
      field: field,
      onSearch: this.onSearch,
      currentStepFields: this.props.currentStepFields,
      is_locked: this.props.is_locked,
      completed: this.props.completed,
      permission: this.props.permission
    };

    let final_html = null;
    if (
      this.props.currentStepFields.integration_data_loading ||
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
    } else if (field.integration_json.status_code === "error") {
      final_html = (
        <div>
          <Alert
            message={
              field.integration_json.status_message || "Something went wrong"
            }
            type="error"
          />
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
                getComment={this.getComment}
                jsonData={field.integration_json}
                commentCount={field.integration_comment_count}
                flag_dict={field.selected_flag}
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
    props.jsonData.OrderProductResponse.TransactionResult.ResultText !==
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
        let flag_data = _.size(props.flag_dict[record.MemberID])
          ? props.flag_dict[record.MemberID]
          : {};
        flag_data = _.size(flag_data.flag_detail) ? flag_data.flag_detail : {};
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
