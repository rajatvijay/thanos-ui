import React, { Component } from "react";
import { Table, Tag } from "antd";
import _ from "lodash";
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
class DnbDirectors extends Component {
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
    this.props.getIntegrationComments(data.custom_hash, this.props.field.id);
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
            getComment={this.getComment}
            jsonData={field.integration_json}
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
    !props.jsonData.OrderProductResponse.OrderProductResponseDetail.Product
      .Organization.PrincipalsAndManagement ||
    !_.size(
      props.jsonData.OrderProductResponse.OrderProductResponseDetail.Product
        .Organization.PrincipalsAndManagement.CurrentPrincipal
    )
  ) {
    return (
      <div className="text-center text-red">
        <FormattedMessage id="commonTextInstances.noResults" />!
      </div>
    );
  }

  const data =
    props.jsonData.OrderProductResponse.OrderProductResponseDetail.Product
      .Organization.PrincipalsAndManagement.CurrentPrincipal;

  const columns = [
    {
      title: <FormattedMessage id="fields.companyDirectors" />,
      dataIndex: "PrimaryName",
      render: (text, record, index) => {
        return integrationCommonFunctions.dnb_directors_html(record);
      },
      key: "PrimaryName"
    },
    {
      title: <FormattedMessage id="workflowsInstances.commentsText" />,
      key: "ubo_index",
      render: record => {
        let flag_data = _.size(props.flag_dict[record.custom_hash])
          ? props.flag_dict[record.custom_hash]
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
              {props.commentCount[record.custom_hash] ? (
                <FormattedMessage
                  id="commonTextInstances.commentsText"
                  values={{
                    count: props.commentCount[record.custom_hash]
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

export const Directors = props => {
  return <DnbDirectors {...props} />;
};
