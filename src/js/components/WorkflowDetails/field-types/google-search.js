import React, { Component } from "react";
//import { authHeader, baseUrl } from "../../../_helpers";
import { Form, Icon, Select, Table, Tag } from "antd";
import _ from "lodash";
import { commonFunctions } from "./commons";
import { integrationCommonFunctions } from "./integration_common";
import { dunsFieldActions } from "../../../actions";
//import { jsonData } from "../../../constants/opensearchresults";

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

class GoogleSrch extends Component {
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
    let uid = data.custom_hash || data.cacheId;
    this.props.getIntegrationComments(uid, this.props.field.id);
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

    // TODO: Hack to mock server response
    // let _field = Object.assign({}, field);
    // _field.integration_json = jsonData //.data_fields[4].integration_json;
    // TODO: 1. Field override

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
          <div className="mr-top-lg mr-bottom-lg google-search-table">
            <GetTable
              getComment={this.getComment}
              jsonData={field.integration_json}
              commentCount={field.integration_comment_count}
              flag_dict={field.selected_flag}
              onSearch={this.onSearch}
            />
          </div>
        </div>
      );
      // TODO: Hack end - remove till 1, change _field -> field before review
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
  if (!props.jsonData.results) {
    return <div className="text-center text-red">No result found!</div>;
  }

  let data = props.jsonData.results.sort((a, b) => {
    let aData = a.sentiment_score * a.sentiment_magnitude;
    let bData = b.sentiment_score * b.sentiment_magnitude;

    return aData - bData;
  });

  const title = (
    <span className="text-metal">{`Found ${data.length} results`}</span>
  );

  let cate = (
    <div>
      <span className="text-metal pd-right">Filter:</span>{" "}
      {_.map(
        _.uniqBy(data, function(o) {
          if (o.category) {
            return o.category.name;
          }
        }),
        function(i) {
          if (i.category && i.category.name) {
            return (
              <Tag className="alert-tag-item alert-primary">
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
        //let adrData = record
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
        let uid = record.custom_hash || record.cacheId;
        let flag_data = _.size(props.flag_dict[uid])
          ? props.flag_dict[uid]
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
              {props.commentCount[uid] ? (
                props.commentCount[uid] + " comment(s)"
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
