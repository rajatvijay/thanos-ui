import React, { Component } from "react";
import { Table, Tabs, Tag } from "antd";
import _ from "lodash";
import { getEventItem } from "./rdc_alert_metadata";
import { event_status, status_filters } from "../EventStatuses";
import { FormattedMessage, injectIntl } from "react-intl";
import IntegrationLoadingWrapper from "../utils/IntegrationLoadingWrapper";
import { integrationCommonFunctions } from "./integration_common";

const TabPane = Tabs.TabPane;
const { filterEventsByFlag } = integrationCommonFunctions;

class RDCEventDetailComponent extends Component {
  constructor() {
    super();
    this.state = {
      field: null,
      country: null
    };
  }

  getComment = (e, data) => {
    this.props.getIntegrationComments(
      data.custom_hash,
      this.props.field.id,
      this.props.isEmbedded
    );
  };

  render = () => {
    const { field, currentStepFields } = this.props;

    const updatedIntegrationJson = this.props.field.definition.extra
      ? filterEventsByFlag(this.props, "data")
      : field.integration_json;

    const finalHTML = (
      <IntegrationLoadingWrapper
        currentStepFields={currentStepFields}
        field={field}
        step={field.step}
        check="default"
      >
        <div className="mr-top-lg mr-bottom-lg">
          <GetTabsFilter
            intl={this.props.intl}
            getComment={this.getComment}
            jsonData={updatedIntegrationJson}
            commentCount={field.integration_comment_count}
            flag_dict={field.selected_flag}
          />
        </div>
      </IntegrationLoadingWrapper>
    );

    return <div style={{ marginBottom: "50px" }}>{finalHTML}</div>;
  };
}

const buildDetails = obj => {
  obj["id"] = obj["custom_hash"];

  let ref_details = obj["ReferenceDetail"] || [];
  ref_details = _.map(ref_details, function(rd, index) {
    return (
      <span key={"key-" + index}>
        <span>
          &nbsp;
          <b>
            <FormattedMessage id="fields.sourceName" />:
          </b>{" "}
          {rd["SourceName"]}
          <br />
          &nbsp;
          <b>
            <FormattedMessage id="fields.sourceType" />:
          </b>{" "}
          {rd["SourceTypeText"] || "-"}
          <br />
          &nbsp;
          <b>
            <FormattedMessage id="fields.publisherName" />:
          </b>{" "}
          {rd["PublisherName"] || "-"}
          <br />
          &nbsp;
          <b>
            <FormattedMessage id="fields.publication" />:
          </b>{" "}
          {rd["PublicationSource"] || "-"}
          <br />
          &nbsp;
          <b>
            <FormattedMessage id="fields.publicationDate" />:
          </b>{" "}
          {rd["PublicationDate"] || "-"}
          <br />
          &nbsp;<b>Headline:</b> {rd["Headline"] || "-"}
          <br />
          {rd["WebPageURL"] ? (
            <span>
              &nbsp;<b>Link:</b>{" "}
              <a
                href={rd["WebPageURL"]}
                target="_blank"
                rel="noopener noreferrer"
              >
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
          <h4 className="match-label ">
            <FormattedMessage id="fields.eventDescription" />:
          </h4>
          <br />
          {getEventItem(obj, true)}
          <br />
        </div>

        <div className="col-sm-12">
          <h4 className="match-label ">
            <FormattedMessage id="fields.refDetail" />:
          </h4>
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
      title: <FormattedMessage id="fields.eventTypeText" />,
      key: "EventTypeText",
      render: record => {
        return (
          <div>
            {record.ReferenceDetail && record.ReferenceDetail.length ? (
              <div className="mr-bottom-sm text-black">
                <b>{record.ReferenceDetail[0].Headline}</b>
              </div>
            ) : null}
            <span className="text-lighter">{record.EventTypeText}</span>
          </div>
        );
      }
    },
    {
      title: <FormattedMessage id="fields.eventTypeCode" />,
      key: "EventTypeCode",
      render: record => {
        return <span className="text-lighter">{record.EventTypeCode}</span>;
      }
    },
    {
      title: <FormattedMessage id="fields.eventDate" />,
      key: "EventDate",
      render: record => {
        return <span className="text-lighter">{record.EventDate}</span>;
      }
    },
    {
      title: <FormattedMessage id="fields.eventSubtypeText" />,
      key: "EventSubTypeText",
      render: record => {
        return <span className="text-lighter">{record.EventSubTypeText}</span>;
      }
    },
    {
      title: <FormattedMessage id="fields.eventSubtypeCode" />,
      key: "EventSubTypeCode",
      render: record => {
        return <span className="text-lighter">{record.EventSubTypeCode}</span>;
      }
    },
    {
      title: <FormattedMessage id="commonTextInstances.status" />,
      key: "status",
      filters: status_filters,
      onFilter: (value, record) => {
        return record.krypton_status === value;
      },
      render: record => {
        return (
          <div>
            {record.krypton_status ? (
              <Tag
                color={
                  event_status[record.krypton_status]
                    ? event_status[record.krypton_status]["class"]
                    : "grey"
                }
              >
                {event_status[record.krypton_status]
                  ? event_status[record.krypton_status]["label"]
                  : "N/A"}
              </Tag>
            ) : null}
          </div>
        );
      }
    },
    {
      title: <FormattedMessage id="workflowsInstances.commentsText" />,
      key: "ln_index",
      render: record => {
        const uid = record.custom_hash;
        let flag_data = _.size(props.flag_dict[uid])
          ? props.flag_dict[uid]
          : {};
        flag_data = _.size(flag_data.flag_detail) ? flag_data.flag_detail : {};
        const css = flag_data.extra || {};
        const flag_name = flag_data.label || null;

        return (
          <span>
            <span
              className="ant-btn ant-btn-primary btn-o btn-sm"
              onClick={e => props.getComment(e, record)}
            >
              {props.commentCount[uid] ? (
                <FormattedMessage
                  id="commonTextInstances.commentsText"
                  values={{ count: props.commentCount[uid] }}
                />
              ) : (
                <FormattedMessage id="commonTextInstances.addComments" />
              )}
            </span>

            {flag_name ? (
              <div className="mr-top-sm">
                {" "}
                <Tag style={css}>{flag_name}</Tag>
              </div>
            ) : null}
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
        showHeader={false}
        expandedRowRender={record => buildDetails(record)}
      />
    </div>
  );
};

const GetTabsFilter = props => {
  // error
  if (!_.size(props.jsonData.data)) {
    return (
      <div className="text-center text-green">
        <FormattedMessage id="commonTextInstances.noAlertsFound" />
      </div>
    );
  }

  const data = props.jsonData.data;

  const filter_key = "krypton_category";
  const categories = _.map(data, function(e) {
    return { label: e[filter_key], value: e[filter_key], data: [], count: 0 };
  });

  const getFilterData = data => {
    let fList = [
      {
        label: props.intl.formatMessage({ id: "commonTextInstances.all" }),
        value: "all",
        data: data,
        count: data.length,
        tabBarStyle: { color: "red" }
      }
    ];

    fList = fList.concat(categories);

    _.map(data, function(i) {
      const fName = i[filter_key];
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
      {_.map(
        _.uniqBy(getFilterData(data), e => {
          return e.label;
        }),
        function(tab, index) {
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
        }
      )}
    </Tabs>
  );
};

const IntlRDCEventDetailComponent = injectIntl(RDCEventDetailComponent);

export const RDCEventDetails = props => {
  return <IntlRDCEventDetailComponent {...props} />;
};
