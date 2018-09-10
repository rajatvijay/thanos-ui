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
  addCommentBtn
} = commonFunctions;

//Field Type DUNS SEARCH

const getFields = props => {
  return (
    <Row gutter={16} style={{ marginBottom: "50px" }}>
      <Col span={6}>
        <Button type="primary" className="btn-block" onClick={props.onSearch}>
          Screen for Sanctions & Watchlists
        </Button>
      </Col>

      <Col span={12} style={{ marginTop: "5px" }}>
        {_.map(props.field.search_param_data, function(item) {
          if (_.size(item.answer) && item.answer.answer)
            return (
              <div className="float-left" style={{ marginRight: "15px" }}>
                <span>{item.answer.field__definition__body}</span>:{" "}
                <span>{item.answer.answer}</span>,
              </div>
            );
        })}
      </Col>
    </Row>
  );
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
      onSearch: this.onSearch
    };

    let final_html = null;
    if (this.props.currentStepFields.integration_data_loading) {
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
  if (props.jsonData.TransactionResult.ResultID != "PD021") {
    return (
      <div className="text-center text-red">
        {props.jsonData.TransactionResult.ResultText}
      </div>
    );
  }

  if (
    !_.size(props.jsonData.OrderProductResponseDetail.Product.MatchCandidate)
  ) {
    return <div className="text-center text-red">No match found!</div>;
  }

  const data = props.jsonData.OrderProductResponseDetail.Product.MatchCandidate;

  const columns = [
    {
      title: "Potential Maches",
      dataIndex: "PrimaryName",
      render: (text, record, index) => {
        return integrationCommonFunctions.dnb_livingston_html(record);
      },
      key: "PrimaryName"
    },
    {
      title: "Comments",
      key: "livingston_index",
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