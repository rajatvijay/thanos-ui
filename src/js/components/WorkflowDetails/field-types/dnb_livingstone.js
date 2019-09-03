import React, { Component } from "react";
import { Table, Icon, Tag } from "antd";
import _ from "lodash";
import { commonFunctions } from "./commons";
import { integrationCommonFunctions } from "./integration_common";
import { dunsFieldActions } from "../../../actions";
import { FormattedMessage } from "react-intl";

const {
  getIntegrationSearchButton,
  isDnBIntegrationDataLoading
} = commonFunctions;

//Field Type DUNS SEARCH
const getFields = props => {
  return getIntegrationSearchButton(props);
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
      isDnBIntegrationDataLoading(this.props)
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
                jsonData={field.integration_json}
                getComment={this.getComment}
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
  if (props.jsonData.TransactionResult.ResultID !== "PD021") {
    return (
      <div className="text-center text-red">
        {props.jsonData.TransactionResult.ResultText}
      </div>
    );
  }

  if (
    !_.size(props.jsonData.OrderProductResponseDetail.Product.MatchCandidate)
  ) {
    return (
      <div className="text-center text-red">
        <FormattedMessage id="commonTextInstances.noMatchFound" />!
      </div>
    );
  }

  const data = props.jsonData.OrderProductResponseDetail.Product.MatchCandidate;

  const columns = [
    {
      title: <FormattedMessage id="fields.potentialMatches" />,
      dataIndex: "PrimaryName",
      render: (text, record, index) => {
        return integrationCommonFunctions.dnb_livingston_html(record);
      },
      key: "PrimaryName"
    },
    {
      title: <FormattedMessage id="workflowsInstances.commentsText" />,
      key: "livingston_index",
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
              <br />
              {flag_name ? <Tag style={css}>{flag_name}</Tag> : null}
            </span>
          </span>
        );
      }
    }
  ];

  return <Table dataSource={data} pagination={false} columns={columns} />;
};

export const Livingstone = props => {
  return <DnbLivingstone {...props} />;
};
