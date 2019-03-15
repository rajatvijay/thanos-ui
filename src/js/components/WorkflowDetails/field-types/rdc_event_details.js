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
  Tabs,
  Tag
} from "antd";
import _ from "lodash";
import { commonFunctions } from "./commons";
import { countries } from "./countries.js";
import { dunsFieldActions, workflowDetailsActions } from "../../../actions";

const FormItem = Form.Item;
const Option = Select.Option;
const { Column, ColumnGroup } = Table;
const TabPane = Tabs.TabPane;

const {
  getLabel,
  field_error,
  getRequired,
  feedValue,
  addCommentBtn,
  getIntegrationSearchButton
} = commonFunctions;

class RDCEventDetailComponent extends Component {
  constructor() {
    super();
    this.state = {
      field: null,
      country: null
    };
  }

  getComment = (e, data) => {
    this.props.getIntegrationComments(data.custom_hash, this.props.field.id);
  };

  render = () => {
    let { field } = this.props;

    const props = {
      field: field
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
    } else if (_.size(field.integration_json)) {
      final_html = (
        <div>
          {_.size(field.integration_json) ? (
            <div className="mr-top-lg mr-bottom-lg">
              <GetTabsFilter
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

    return <div style={{ marginBottom: "50px" }}>{final_html}</div>;
  };
}

const DescriptionItem = ({ title, content }) => (
  <div
    style={{
      fontSize: 14,
      lineHeight: "22px",
      marginBottom: 7,
      color: "rgba(0,0,0,0.65)"
    }}
  >
    <p
      style={{
        marginRight: 8,
        display: "inline-block",
        color: "rgba(0,0,0,0.85)"
      }}
    >
      {title}:
    </p>
    {content}
  </div>
);

const buildDetails = obj => {
  obj["id"] = obj["custom_hash"];

  var ref_details = obj["ReferenceDetail"] || [];
  ref_details = _.map(ref_details, function(rd) {
    return (
      <span>
        <span>
          &nbsp;<b>Source Name:</b> {rd["SourceName"]}
          <br />
          &nbsp;<b>Source Type:</b> {rd["SourceTypeText"] || "-"}
          <br />
          &nbsp;<b>Publisher Name:</b> {rd["PublisherName"] || "-"}
          <br />
          &nbsp;<b>Publication Source:</b> {rd["PublicationSource"] || "-"}
          <br />
          &nbsp;<b>Publication Date:</b> {rd["PublicationDate"] || "-"}
          <br />
          &nbsp;<b>Headline:</b> {rd["Headline"] || "-"}
          <br />
          {rd["WebPageURL"] ? (
            <span>
              &nbsp;<b>Link:</b>{" "}
              <a href={rd["WebPageURL"]} target="_blank">
                {rd["WebPageURL"]}
              </a>
            </span>
          ) : null}
        </span>
        <br />
      </span>
    );
  });

  return (
    <div className="dnb-rdc-wrapper">
      <div className="match-item company-item">
        <div className="col-sm-12">
          <h4 className="match-label ">Event Description:</h4>
          <br />
          <span className="match-value">{obj["EventText"]}</span>
          <br />
        </div>

        <Divider />

        <div className="col-sm-12">
          <h4 className="match-label ">Reference Details:</h4>
          <br />
          <span className="match-value">{ref_details}</span>
          <br />
        </div>
      </div>
    </div>
  );
};

const GetTable = props => {
  const data = props.jsonData;

  const columns = [
    {
      title: "Event Type",
      dataIndex: "EventTypeText",
      key: "EventTypeText"
    },
    {
      title: "Category",
      dataIndex: "EventTypeCode",
      key: "EventTypeCode"
    },
    {
      title: "Event Date",
      dataIndex: "EventDate",
      key: "EventDate"
    },
    {
      title: "Event Sub Type",
      dataIndex: "EventSubTypeText",
      key: "EventSubTypeText"
    },
    {
      title: "Event Sub Type Code",
      dataIndex: "EventSubTypeCode",
      key: "EventSubTypeCode"
    },
    {
      title: "Status",
      key: "status",
      filters: [
        { text: "Open", value: "open" },
        { text: "Closed", value: "closed" }
      ],
      onFilter: (value, record) => {
        return record.krypton_status === value;
      },
      render: record => {
        let options = {
          open: { label: "Open", class: "red" },
          closed: { label: "Closed", class: "green" }
        };

        return (
          <div>
            {record.krypton_status ? (
              <Tag color={options[record.krypton_status]["class"]}>
                {options[record.krypton_status]["label"]}
              </Tag>
            ) : null}
          </div>
        );
      }
    },
    {
      title: "Comments",
      key: "ln_index",
      render: record => {
        let uid = record.custom_hash;
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
              {props.commentCount[uid]
                ? props.commentCount[uid] + " comment(s)"
                : "Add comment"}
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
        rowKey="uid"
        expandedRowRender={record => buildDetails(record)}
      />
    </div>
  );
};

const GetTabsFilter = props => {
  // error
  if (!_.size(props.jsonData.data)) {
    return <div className="text-center text-green">No alerts found</div>;
  }

  let data = props.jsonData.data;

  let filter_key = "krypton_category";
  let categories = _.map(data, function(e) {
    return { label: e[filter_key], value: e[filter_key], data: [], count: 0 };
  });

  const getFilterData = data => {
    let fList = [
      {
        label: "All",
        value: "all",
        data: data,
        count: data.length,
        tabBarStyle: { color: "red" }
      }
    ];

    fList = fList.concat(categories);

    _.map(data, function(i) {
      let fName = i[filter_key];
      _.map(fList, function(f, index) {
        if (fName === f.value) {
          fList[index].count++;
          fList[index].data.push(i);
        }
      });
    });

    return fList;
  };

  //const getFilterData

  const callback = key => {
    console.log(key);
  };

  return (
    <Tabs defaultActiveKey="all" onChange={callback}>
      {_.map(getFilterData(data), function(tab, index) {
        return (
          <TabPane tab={tab.label + " (" + tab.count + ")"} key={tab.value}>
            <GetTable
              getComment={props.getComment}
              jsonData={tab.data}
              commentCount={props.commentCount}
              flag_dict={props.flag_dict}
            />
          </TabPane>
        );
      })}
    </Tabs>
  );
};

export const RDCEventDetails = props => {
  return <RDCEventDetailComponent {...props} />;
};
