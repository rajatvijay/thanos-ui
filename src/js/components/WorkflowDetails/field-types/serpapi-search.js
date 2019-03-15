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
  Select,
  Tag
} from "antd";
import _ from "lodash";
import { commonFunctions } from "./commons";
import { integrationCommonFunctions } from "./integration_common";
import { countries } from "./countries.js";
import { dunsFieldActions, workflowDetailsActions } from "../../../actions";

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

class SerpSrch extends Component {
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
    this.props.getIntegrationComments(data.custom_hash, this.props.field.id);
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
  if (!props.jsonData.organic_results) {
    return <div className="text-center text-red">No result found!</div>;
  }

  const data = props.jsonData.organic_results;

  const columns = [
    {
      title: "Search results",
      dataIndex: "result",
      render: (text, record, index) => {
        //let adrData = record
        return integrationCommonFunctions.serp_search_html(record);
      },
      key: "title"
    },
    {
      title: "Comments",
      width: 140,
      key: "google_index",
      render: record => {
        let flag_data = _.size(props.flag_dict[record.custom_hash])
          ? props.flag_dict[record.custom_hash]
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
              {props.commentCount[record.custom_hash]
                ? props.commentCount[record.custom_hash] + " comment(s)"
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

export const SerpSearch = props => {
  return <SerpSrch {...props} />;
};
