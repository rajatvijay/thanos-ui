import React, { Component } from "react";
import { Table, Tag } from "antd";
import _ from "lodash";
import { commonFunctions } from "./commons";
import { integrationCommonFunctions } from "./integration_common";
import { dunsFieldActions } from "../../../actions";
import { FormattedMessage } from "react-intl";
import IntegrationLoadingWrapper from "../utils/IntegrationLoadingWrapper";

const { getIntegrationSearchButton } = commonFunctions;
const { filterEventsByFlag } = integrationCommonFunctions;

//Field Type DUNS SEARCH
const getFields = props => {
  return getIntegrationSearchButton(props);
};

class GoogleSrch extends Component {
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
    const uid = data.custom_hash || data.cacheId;
    this.props.getIntegrationComments(uid, this.props.field.id);
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

    const updatedIntegrationJson = this.props.field.definition.extra
      ? filterEventsByFlag(this.props, "results")
      : field.integration_json;

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
            jsonData={updatedIntegrationJson}
            commentCount={field.integration_comment_count}
            flag_dict={field.selected_flag}
            onSearch={this.onSearch}
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
  if (!props.jsonData.results) {
    return (
      <div className="text-center text-red">
        <FormattedMessage id="commonTextInstances.noResults" />
      </div>
    );
  }

  const data = props.jsonData.results.sort((a, b) => {
    const aData = a.sentiment_score * a.sentiment_magnitude;
    const bData = b.sentiment_score * b.sentiment_magnitude;

    return aData - bData;
  });

  const title = (
    <span className="text-metal">
      <FormattedMessage
        id="commonTextInstances.foundResults"
        values={{
          count: data.length
        }}
      />
    </span>
  );

  const cate = (
    <div>
      <span className="text-metal pd-right">
        <FormattedMessage id="mainFilterbar.filterText" />:
      </span>{" "}
      {_.map(
        _.uniqBy(data, function(o) {
          if (o.category) {
            return o.category.name;
          }
        }),
        function(i, index) {
          if (i.category && i.category.name) {
            return (
              <Tag key={`${index}`} className="alert-tag-item alert-primary">
                {i.category.name}
              </Tag>
            );
          }
        }
      )}
    </div>
  );

  const columns = [
    {
      title: cate,
      dataIndex: "result",
      colspan: 2,
      render: (text, record, index) => {
        return integrationCommonFunctions.google_search_html(
          record,
          props.onSearch
        );
      },
      key: "title"
    },
    {
      title: "",
      key: "google_index",
      width: "10%",
      align: "right",
      className: "comment-column",
      verticalAlign: "top",
      render: record => {
        const uid = record.custom_hash || record.cacheId;
        let flag_data = _.size(props.flag_dict[uid])
          ? props.flag_dict[uid]
          : {};
        flag_data = _.size(flag_data.flag_detail) ? flag_data.flag_detail : {};
        const css = flag_data.extra || {};
        const flag_name = flag_data.label || null;
        return (
          <span>
            <span
              className="text-secondary text-anchor mr-right-sm"
              onClick={e => props.getComment(e, record)}
            >
              {props.commentCount[uid] ? (
                <FormattedMessage
                  id="commonTextInstances.commentsText"
                  values={{
                    count: props.commentCount[uid]
                  }}
                />
              ) : (
                <i className="material-icons  t-18 text-secondary">
                  chat_bubble_outline
                </i>
              )}
            </span>
            <br />
            {flag_name ? <Tag style={css}>{flag_name}</Tag> : null}
          </span>
        );
      }
    }
  ];

  return (
    <div>
      <Table
        dataSource={data}
        pagination={false}
        columns={columns}
        title={() => title}
      />
    </div>
  );
};

export const GoogleSearch = props => {
  return <GoogleSrch {...props} />;
};
