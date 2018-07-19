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
  Tabs
} from "antd";
import _ from "lodash";
import { commonFunctions } from "./commons";
import { countries } from "./countries.js";
import { dunsFieldActions } from "../../../actions";

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

  selectItem = data => {
    let payload = {
      duns: data.DUNSNumber,
      field_id: this.props.field.id
    };
    this.props.dispatch(dunsFieldActions.dunsSelectItem(payload));
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
                selectItem={this.selectItem}
                jsonData={field.integration_json}
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
    }
  ];

  return (
    <div>
      <Table
        dataSource={data}
        pagination={false}
        columns={columns}
        // whole structure is required for the extra data available
        /*expandedRowRender={record => (
          <p style={{ margin: 0 }}>This is more data</p>
        )}*/
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
      { label: "Adverse Media", value: "adversemedia", data: [], count: 0 },
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

    console.log("fList-------------------");
    console.log(fList);

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
            <GetTable selectItem={props.selectItem} jsonData={tab.data} />
          </TabPane>
        );
      })}
    </Tabs>
  );
};

export const LexisNexis = props => {
  return <LexisNexisSearch {...props} />;
};
