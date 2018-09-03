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
  addCommentBtn
} = commonFunctions;

//Field Type DUNS SEARCH

const getFields = props => {
  return (
    <Row gutter={16} style={{ marginBottom: "50px" }}>
      <Col span={4}>
        <Button type="primary" className="btn-block" onClick={props.onSearch}>
          Search LexisNexis
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
class LexisNexisSearch extends Component {
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
    this.props.getIntegrationComments(
      data.EntityUniqueID["$"],
      this.props.field.id
    );
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

    return (
      <div style={{ marginBottom: "50px" }}>
        {getFields(props)}
        {final_html}
      </div>
    );
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
  obj["id"] = obj["ID"]["$"];

  var akas = obj["EntityDetails"]["AKAs"]
    ? obj["EntityDetails"]["AKAs"]["EntityAKA"]
    : [];
  akas = _.map(akas, function(aka) {
    if (!aka["Name"] || !aka["Name"]["Full"]) {
      return <span>-</span>;
    }
    return (
      <span>
        <span>
          &nbsp;<b>AKA: </b>
          {aka["Name"]["Full"]["$"]}
        </span>
        <br />
      </span>
    );
  });

  var comments = "-";
  if (obj["EntityDetails"]["Comments"]) {
    var comments_list = obj["EntityDetails"]["Comments"]["$"].split("||");
    comments = _.map(comments_list, function(c) {
      return (
        <span>
          <span>{c.trim()}</span>
          <br />
        </span>
      );
    });
  }

  var additional_info = "-";
  if (
    obj["EntityDetails"]["AdditionalInfo"] &&
    obj["EntityDetails"]["AdditionalInfo"]["EntityAdditionalInfo"]
  ) {
    additional_info = _.map(
      obj["EntityDetails"]["AdditionalInfo"]["EntityAdditionalInfo"],
      function(eai) {
        var type = eai["Type"] ? eai["Type"]["$"] + " Information" : "-";
        var value = eai["Value"] ? eai["Value"]["$"] : "-";
        var comments = eai["Comments"] ? eai["Comments"]["$"].split("|") : [];
        return (
          <span>
            <span>
              &nbsp;<b>{type}</b>: {value}
            </span>
            <br />
            <span>
              &nbsp;Comments:{" "}
              {_.map(comments, function(c) {
                return (
                  <span>
                    <span>{c.trim()}</span>
                    <br />
                  </span>
                );
              })}
            </span>
            <br />
          </span>
        );
      }
    );
  }

  var source_date = "-";
  if (
    obj["File"] &&
    obj["File"]["Published"] &&
    obj["File"]["Published"]["$"]
  ) {
    source_date = new Date(obj["File"]["Published"]["$"]).toLocaleDateString();
  }

  var number = "-";
  if (
    obj["EntityDetails"]["IDs"] &&
    obj["EntityDetails"]["IDs"]["EntityID"] &&
    obj["EntityDetails"]["IDs"]["EntityID"]["Number"] &&
    obj["EntityDetails"]["IDs"]["EntityID"]["Number"]["$"]
  ) {
    number = obj["EntityDetails"]["IDs"]["EntityID"]["Number"]["$"];
  }

  var addresses = "-";
  if (
    obj["EntityDetails"]["Addresses"] &&
    obj["EntityDetails"]["Addresses"]["EntityAddress"]
  ) {
    addresses = _.map(
      obj["EntityDetails"]["Addresses"]["EntityAddress"],
      function(adr) {
        var addr = [
          adr["Street1"] ? adr["Street1"]["$"] : "",
          adr["City"] ? adr["City"]["$"] : "",
          adr["StateProvinceDistrict"] ? adr["StateProvinceDistrict"]["$"] : "",
          adr["PostalCode"] ? adr["PostalCode"]["$"] : ""
        ];
        return (
          <span>
            &nbsp;<b>Address: </b> <span>{addr.join(" ")}</span>
            <br />
            &nbsp;&nbsp;<span>Country: </span>{" "}
            <span>{adr["Country"] ? adr["Country"]["$"] : ""}</span>
            <br />
          </span>
        );
      }
    );
  }

  var ids = "-";
  if (obj["EntityDetails"]["IDs"] && obj["EntityDetails"]["IDs"]["EntityID"]) {
    var ids_arr = obj["EntityDetails"]["IDs"]["EntityID"];
    if (Object.prototype.toString.call(ids_arr) == "[object Object]") {
      ids_arr = [ids_arr];
    }
    ids = _.map(ids_arr, function(id) {
      return (
        <span>
          &nbsp;<b>{id["Type"]["$"]}: </b>
          <span>{id["Number"]["$"]}</span>
          <br />
        </span>
      );
    });
  }

  obj["additional_info_text"] = additional_info;
  obj["comments_text"] = comments;
  obj["akas_text"] = akas;
  obj["addresses_text"] = addresses;

  return (
    <div className="dnb-rdc-wrapper">
      <div className="match-item company-item">
        <h4 className="match-title mr-bottom-lg">{obj["EntityName"]["$"]}</h4>
        <Row>
          <Col span={12}>
            <DescriptionItem
              title="Added To Accept List"
              content={!obj["AddedToAcceptList"]["$"] ? "False" : "True"}
            />
          </Col>
          <Col span={12}>
            <DescriptionItem
              title="Address Name"
              content={!obj["AddressName"]["$"] ? "False" : "True"}
            />
          </Col>
        </Row>

        <Row>
          <Col span={12}>
            <DescriptionItem
              title="Auto False Positive"
              content={!obj["AutoFalsePositive"]["$"] ? "False" : "True"}
            />
          </Col>
          <Col span={12}>
            <DescriptionItem
              title="Best Address Is Partial"
              content={!obj["BestAddressIsPartial"]["$"] ? "False" : "True"}
            />
          </Col>
        </Row>

        <Row>
          <Col span={12}>
            <DescriptionItem
              title="Best Country Scoree"
              content={obj["BestCountryScore"]["$"]}
            />
          </Col>
          <Col span={12}>
            <DescriptionItem
              title="Best Country Type"
              content={obj["BestCountryType"]["$"]}
            />
          </Col>
        </Row>

        <Row>
          <Col span={12}>
            <DescriptionItem
              title="Best DOB Is Partial"
              content={obj["BestCountryScore"]["$"]}
            />
          </Col>
          <Col span={12}>
            <DescriptionItem title="Best Name" content={obj["BestName"]["$"]} />
          </Col>
        </Row>

        <Row>
          <Col span={12}>
            <DescriptionItem
              title="Best Name Score"
              content={obj["BestNameScore"]["$"]}
            />
          </Col>
          <Col span={12}>
            <DescriptionItem
              title="False Positive"
              content={!obj["FalsePositive"]["$"] ? "False" : "True"}
            />
          </Col>
        </Row>

        <Row>
          <Col span={12}>
            <DescriptionItem
              title="Match ReAlert"
              content={!obj["MatchReAlert"]["$"] ? "False" : "True"}
            />
          </Col>
          <Col span={12}>
            <DescriptionItem
              title="Gateway OFAC Screening Indicator Match"
              content={
                !obj["GatewayOFACScreeningIndicatorMatch"]["$"]
                  ? "False"
                  : "True"
              }
            />
          </Col>
        </Row>

        <Row>
          <Col span={12}>
            <DescriptionItem
              title="True Match"
              content={!obj["TrueMatch"]["$"] ? "False" : "True"}
            />
          </Col>
          <Col span={12} />
        </Row>

        <Divider />
        <div className="col-sm-12">
          <h4 className="match-label ">AKAs:</h4>
          <br />
          <span className="match-value">{obj["akas_text"]}</span>
          <br />
        </div>

        <Divider />

        <div className="col-sm-12">
          <h4 className="match-label">Comments:</h4>
          <br />
          <span className="match-value">{obj["comments_text"]}</span>
          <br />
        </div>

        <Divider />
        <div className="col-sm-12">
          <h4 className="match-label">Addresses:</h4>
          <br />
          <span className="match-value">{obj["addresses_text"]}</span>
          <br />
        </div>

        <Divider />
        <div className="col-sm-12">
          <h4 className="match-label">Additional Info:</h4>
          <br />
          <span className="match-value">{obj["additional_info_text"]}</span>
        </div>
      </div>
    </div>
  );
};

const GetTable = props => {
  const data = props.jsonData;

  const columns = [
    {
      title: "Name",
      dataIndex: "EntityName[$]",
      key: "EntityName[$]"
    },
    {
      title: "Addresses",
      dataIndex: "EntityDetails[Addresses][EntityAddress]",
      render: (text, record, index) => {
        //let adrData = record
        if (!_.isEmpty(text)) {
          if (_.isArray(text)) {
            return (
              <span>
                {text[0].Country.$}, {text[1].City ? text[1].City.$ : ""}
              </span>
            );
          } else {
            return <span>{text.Country.$}</span>;
          }
        } else {
          return <span className="text-grey-light">N/A</span>;
        }
      },
      key: "EntityDetails[Addresses][EntityAddress][Country][$]"
    },
    {
      title: "Entity type",
      dataIndex: "[EntityDetails][EntityType][$]",
      key: "[EntityDetails][EntityType][$]"
    },
    {
      title: "Date listed",
      dataIndex: "[EntityDetails][DateListed][$]",
      key: "[EntityDetails][DateListed][$]"
    },
    {
      title: "Reason listed",
      dataIndex: "[EntityDetails][ReasonListed][$]",
      key: "[EntityDetails][ReasonListed][$]"
    },

    {
      title: "Score",
      dataIndex: "BestNameScore[$]",
      key: "BestNameScore[$]",
      defaultSortOrder: "descend"
    },
    {
      title: "Comments",
      key: "ln_index",
      render: record => {
        let flag_data = _.size(props.flag_dict[record.EntityUniqueID["$"]])
          ? props.flag_dict[record.EntityUniqueID["$"]]
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
              {props.commentCount[record.EntityUniqueID["$"]]
                ? props.commentCount[record.EntityUniqueID["$"]] + " comment(s)"
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
        // whole structure is required for the extra data available
        expandedRowRender={record => buildDetails(record)}
        // onRow={(record) => ({
        //   onClick: () => {
        //     this.selectRow(record);
        //   },
        // })}
      />
    </div>
  );
};

const GetTabsFilter = props => {
  // error
  if (props.jsonData.Envelope.Body.Fault) {
    let message =
      props.jsonData.Envelope.Body.Fault.detail.ServiceFault.Message["$"];
    return <div className="text-center text-red">{message}</div>;
  }

  let data = [];
  try {
    data =
      props.jsonData.Envelope.Body.SearchResponse.SearchResult.Records
        .ResultRecord.Watchlist.Matches.WLMatch;
  } catch (err) {
    console.log("LN error ---->", props.jsonData);
    return <div className="text-center text-red">Something went wrong!</div>;
  }

  if (!Array.isArray(data)) {
    data = [data];
  }

  const getFilterData = data => {
    let fList = [
      {
        label: "All",
        value: "all",
        data: data,
        count: data.length,
        tabBarStyle: { color: "red" }
      },
      { label: "Sanctions", value: "sanction", data: [], count: 0 },
      { label: "SOE", value: "soe", data: [], count: 0 },
      { label: "PEP", value: "pep", data: [], count: 0 },
      { label: "Enforcement", value: "enforcement", data: [], count: 0 },
      { label: "Registrations", value: "registrations", data: [], count: 0 },
      { label: "Adverse Media", value: "adverse media", data: [], count: 0 },
      {
        label: "Associated Entity",
        value: "associatedentity",
        data: [],
        count: 0
      },
      { label: "Others", value: "others", data: [], count: 0 }
    ];

    _.map(data, function(i) {
      let fName = i.EntityDetails.ReasonListed.$.split(":")[0];
      fName = fName.toLowerCase();
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

export const LexisNexis = props => {
  return <LexisNexisSearch {...props} />;
};
