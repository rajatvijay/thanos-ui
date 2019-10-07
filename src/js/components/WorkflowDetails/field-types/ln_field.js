import React, { Component } from "react";
import { Row, Col, Table, Divider, Tabs, Tag } from "antd";
import _ from "lodash";
import { commonFunctions } from "./commons";
import { dunsFieldActions } from "../../../actions";
import { FormattedMessage } from "react-intl";
import IntegrationLoadingWrapper from "../utils/IntegrationLoadingWrapper";

const TabPane = Tabs.TabPane;
const { getIntegrationSearchButton } = commonFunctions;

//Field Type DUNS SEARCH
const getFields = props => {
  return getIntegrationSearchButton(props);
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
    const payload = {
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
    const { field, currentStepFields } = this.props;
    const props = {
      field: field,
      onSearch: this.onSearch,
      currentStepFields: currentStepFields,
      is_locked: this.props.is_locked,
      completed: this.props.completed,
      permission: this.props.permission
    };

    const finalHTML = (
      <IntegrationLoadingWrapper
        currentStepFields={currentStepFields}
        field={field}
        step={field.step}
        check="default"
      >
        <div className="mr-top-lg mr-bottom-lg">
          <GetTabsFilter
            getComment={this.getComment}
            jsonData={field.integration_json}
            commentCount={field.integration_comment_count}
            flag_dict={field.selected_flag}
            intl={this.props.intl}
          />
        </div>
      </IntegrationLoadingWrapper>
    );

    return (
      <div style={{ marginBottom: "50px" }}>
        {getFields(props)}
        {finalHTML}
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

  let akas = obj["EntityDetails"]["AKAs"]
    ? obj["EntityDetails"]["AKAs"]["EntityAKA"]
    : [];
  akas = _.map(akas, function(aka, index) {
    if (!aka["Name"] || !aka["Name"]["Full"]) {
      return <span key={`${index}`}>-</span>;
    }
    return (
      <span key={`${index}`}>
        <span>
          &nbsp;<b>AKA: </b>
          {aka["Name"]["Full"]["$"]}
        </span>
        <br />
      </span>
    );
  });

  let comments = "-";
  if (obj["EntityDetails"]["Comments"]) {
    const comments_list = obj["EntityDetails"]["Comments"]["$"].split("||");
    comments = _.map(comments_list, function(c, index) {
      return (
        <span key={`${index}`}>
          <span>{c.trim()}</span>
          <br />
        </span>
      );
    });
  }

  let additional_info = "-";
  if (
    obj["EntityDetails"]["AdditionalInfo"] &&
    obj["EntityDetails"]["AdditionalInfo"]["EntityAdditionalInfo"]
  ) {
    additional_info = _.map(
      obj["EntityDetails"]["AdditionalInfo"]["EntityAdditionalInfo"],
      function(eai, index) {
        const type = eai["Type"] ? eai["Type"]["$"] + " Information" : "-";
        const value = eai["Value"] ? eai["Value"]["$"] : "-";
        const comments = eai["Comments"] ? eai["Comments"]["$"].split("|") : [];
        return (
          <span key={`${index}`}>
            <span>
              &nbsp;<b>{type}</b>: {value}
            </span>
            <br />
            <span>
              &nbsp;Comments:{" "}
              {_.map(comments, function(c, index) {
                return (
                  <span key={`${index}`}>
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

  let addresses = "-";
  if (
    obj["EntityDetails"]["Addresses"] &&
    obj["EntityDetails"]["Addresses"]["EntityAddress"]
  ) {
    addresses = _.map(
      obj["EntityDetails"]["Addresses"]["EntityAddress"],
      function(adr, index) {
        const addr = [
          adr["Street1"] ? adr["Street1"]["$"] : "",
          adr["City"] ? adr["City"]["$"] : "",
          adr["StateProvinceDistrict"] ? adr["StateProvinceDistrict"]["$"] : "",
          adr["PostalCode"] ? adr["PostalCode"]["$"] : ""
        ];
        return (
          <span key={`${index}`}>
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
      title: <FormattedMessage id="fields.name" />,
      dataIndex: "EntityName[$]",
      key: "EntityName[$]"
    },
    {
      title: <FormattedMessage id="fields.addresses" />,
      dataIndex: "EntityDetails[Addresses][EntityAddress]",
      render: (text, record, index) => {
        if (!_.isEmpty(text)) {
          if (_.isArray(text)) {
            return (
              <span>
                {text[0].Country.$}, {text[1].City ? text[1].City.$ : ""}
              </span>
            );
          } else {
            return <span>{text.Country ? text.Country.$ : "--"}</span>;
          }
        } else {
          return <span className="text-grey-light">N/A</span>;
        }
      },
      key: "EntityDetails[Addresses][EntityAddress][Country][$]"
    },
    {
      title: <FormattedMessage id="fields.entityType" />,
      dataIndex: "[EntityDetails][EntityType][$]",
      key: "[EntityDetails][EntityType][$]"
    },
    {
      title: <FormattedMessage id="fields.dateListed" />,
      dataIndex: "[EntityDetails][DateListed][$]",
      key: "[EntityDetails][DateListed][$]"
    },
    {
      title: <FormattedMessage id="fields.reasonListed" />,
      dataIndex: "[EntityDetails][ReasonListed][$]",
      key: "[EntityDetails][ReasonListed][$]"
    },

    {
      title: <FormattedMessage id="fields.score" />,
      dataIndex: "BestNameScore[$]",
      key: "BestNameScore[$]",
      defaultSortOrder: "descend"
    },
    {
      title: <FormattedMessage id="workflowsInstances.commentsText" />,
      key: "ln_index",
      render: record => {
        let flag_data = _.size(props.flag_dict[record.EntityUniqueID["$"]])
          ? props.flag_dict[record.EntityUniqueID["$"]]
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
              {props.commentCount[record.EntityUniqueID["$"]] ? (
                <FormattedMessage
                  id="commonTextInstances.commentsText"
                  values={{
                    count: props.commentCount[record.EntityUniqueID["$"]]
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

  return (
    <div>
      <Table
        dataSource={data}
        pagination={false}
        columns={columns}
        rowKey="uid"
        // whole structure is required for the extra data available
        expandedRowRender={record => buildDetails(record)}
      />
    </div>
  );
};

const GetTabsFilter = props => {
  // error
  if (props.jsonData.Envelope.Body.Fault) {
    return (
      <div className="text-center text-green">
        <FormattedMessage id="commonTextInstances.noMatchFound" />
      </div>
    );
  }

  let data = [];
  try {
    data =
      props.jsonData.Envelope.Body.SearchResponse.SearchResult.Records
        .ResultRecord.Watchlist.Matches.WLMatch;
  } catch (err) {
    return (
      <div className="text-center text-red">
        <FormattedMessage id="commonTextInstances.noMatchesFound" />!
      </div>
    );
  }

  if (!Array.isArray(data)) {
    data = [data];
  }

  const getFilterData = (data,intl) => {
    const fList = [
      {
        label: intl.formatMessage({id:"commonTextInstances.all"}),
        value: "all",
        data: data,
        count: data.length,
        tabBarStyle: { color: "red" }
      },
      {
        label: intl.formatMessage({id:"fields.sanctions"}),
        value: "sanction",
        data: [],
        count: 0
      },
      { label: "SOE", value: "soe", data: [], count: 0 },
      { label: "PEP", value: "pep", data: [], count: 0 },
      {
        label: intl.formatMessage({id:"fields.enforcement"}),
        value: "enforcement",
        data: [],
        count: 0
      },
      {
        label: intl.formatMessage({id:"fields.registrations"}),
        value: "registrations",
        data: [],
        count: 0
      },
      {
        label: intl.formatMessage({id:"fields.adverseMedia"} ),
        value: "adverse media",
        data: [],
        count: 0
      },
      {
        label: intl.formatMessage({id:"fields.associatedEntity"}) ,
        value: "associatedentity",
        data: [],
        count: 0
      },
      {
        label: intl.formatMessage({id:"fields.others"}) ,
        value: "others",
        data: [],
        count: 0
      }
    ];

    _.map(data, function(i) {
      if (i.EntityDetails.ReasonListed !== undefined) {
        let fName = i.EntityDetails.ReasonListed.$.split(":")[0];
        fName = fName.toLowerCase();
        _.map(fList, function(f, index) {
          if (fName === f.value) {
            fList[index].count++;
            fList[index].data.push(i);
          }
        });
      }
    });

    return fList;
  };

  //const getFilterData

  const callback = key => {
    console.log(key);
  };

  return (
    <Tabs defaultActiveKey="all" onChange={callback}>
      {_.map(getFilterData(data,props.intl), function(tab, index) {
        return (
          <TabPane
            tab={tab.label + " (" + tab.count + ")"}
            key={`${tab.value}`}
          >
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
