import React, { Component } from "react";
import { Table, Icon, Tag } from "antd";
import _ from "lodash";
import { commonFunctions } from "./commons";
import { integrationCommonFunctions } from "./integration_common";
import { dunsFieldActions } from "../../../actions";

const {
  getIntegrationSearchButton,
  isDnBIntegrationDataLoading
} = commonFunctions;

//Field Type DUNS SEARCH
const getFields = props => {
  return getIntegrationSearchButton(props);
};

//duns field
class TRResult extends Component {
  constructor() {
    super();
    this.state = {
      field: null,
      country: null
    };
  }

  onSearch = () => {
    let payload = {
      workflow: this.props.workflowId,
      fieldId: this.props.field.id
    };

    this.props.dispatch(dunsFieldActions.dunsSaveField(payload));
  };

  getComment = (e, data) => {
    this.props.getIntegrationComments(data.resultId, this.props.field.id);
  };

  render = () => {
    let { field } = this.props;

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
  if (!_.size(props.jsonData) || props.jsonData["status_code"] == 401) {
    return <div className="text-center text-red">No result found!</div>;
  }

  const data = props.jsonData;

  const columns = [
    {
      title: "MATCHES",
      dataIndex: "PrimaryName",
      render: (text, record, index) => {
        return integrationCommonFunctions.tr_results_html(record);
      },
      key: "PrimaryName"
    },
    {
      title: "Comments",
      key: "ubo_index",
      render: record => {
        let flag_data = _.size(props.flag_dict[record.resultId])
          ? props.flag_dict[record.resultId]
          : {};
        flag_data = _.size(flag_data.flag_detail) ? flag_data.flag_detail : {};
        let css = flag_data.extra || {};
        let flag_name = flag_data.label || null;
        return (
          <span>
            <span
              className="text-secondary text-anchor"
              onClick={e => props.getComment(e, record)}
            >
              {props.commentCount[record.resultId]
                ? props.commentCount[record.resultId] + " comment(s)"
                : "Add comment"}
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

export const TRResults = props => {
  return <TRResult {...props} />;
};
