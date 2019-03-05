import React, { Component } from "react";
import { Tag, List, Tooltip, Modal } from "antd";
import _ from "lodash";
import { Row, Col, Button, Progress } from "antd";

export const integrationCommonFunctions = {
  dnb_ubo_html,
  dnb_rdc_html,
  tr_results_html,
  dnb_directors_html,
  dnb_livingston_html,
  lexisnexis_html,
  google_search_html,
  serp_search_html,
  rdc_event_details,
  comment_answer_body
};

function comment_answer_body(c) {
  let classes = "text-bold t-16 mr-top";

  if (_.size(c.target.workflow_details)) {
    return <div className={classes}>{workflow_comment_html(c.target)}</div>;
  }

  if (!_.size(c.target.field_details)) {
    return null;
  }

  if (c.target.field_details.is_integration_type) {
    if (c.target.field_details.type == "dnb_livingstone") {
      return (
        <div className={classes}>{dnb_livingston_html(c.target.row_json)}</div>
      );
    } else if (c.target.field_details.type == "dnb_ubo") {
      return <div className={classes}>{dnb_ubo_html(c.target.row_json)}</div>;
    } else if (c.target.field_details.type == "dnb_directors") {
      return (
        <div className={classes}>{dnb_directors_html(c.target.row_json)}</div>
      );
    } else if (c.target.field_details.type == "google_search") {
      return (
        <div className={classes}>{google_search_html(c.target.row_json)}</div>
      );
    } else if (c.target.field_details.type == "ln_search") {
      return (
        <div className={classes}>{lexisnexis_html(c.target.row_json)}</div>
      );
    } else if (c.target.field_details.type == "thomson_reuters_screenresult") {
      return (
        <div className={classes}>{tr_results_html(c.target.row_json)}</div>
      );
    } else if (c.target.field_details.type == "rdc_event_details") {
      return (
        <div className={classes}>{rdc_event_details(c.target.row_json)}</div>
      );
    }
  } else {
    return (
      <div className="ant-row ant-form-item ant-form-item-with-help from-label mr-top">
        <div className="ant-form-item-label">
          <label className="">{c.target.field_details.name}</label>
        </div>
        <div className="ant-form-item-control-wrapper">
          <div className="ant-form-item-control ">
            <span className="ant-form-item-children">
              <span
                className="ant-input ant-input-disabled"
                style={
                  c.target.selected_flag[c.target.id]
                    ? c.target.selected_flag[c.target.id].flag_detail.extra
                    : null
                }
              >
                {_.size(c.target.field_details.answer)
                  ? c.target.field_details.answer[0].answer
                  : "-"}
              </span>
            </span>
          </div>
        </div>
      </div>
    );
  }
}

function lexisnexis_html(record) {
  let addr = "-";
  if (
    _.size(record.EntityDetails) &&
    _.size(record.EntityDetails.Addresses) &&
    _.size(record.EntityDetails.Addresses.EntityAddress)
  ) {
    addr = (
      <div>
        {_.map(record.EntityDetails.Addresses.EntityAddress, function(a) {
          let t = [
            a.Street1 ? a.Street1.$ : "",
            a.City ? a.City.$ : "",
            a.StateProvinceDistrict ? a.StateProvinceDistrict.$ : "",
            a.Country ? a.Country.$ : "",
            a.PostalCode ? a.PostalCode.$ : ""
          ];
          return <div> - {t.join(" ")}</div>;
        })}
      </div>
    );
  }
  return (
    <div>
      Name: {record.BestName.$}
      <br />
      Unique ID: {record.EntityUniqueID.$}
      <br />
      Score: {record.BestNameScore.$}
      <br />
      Entity Type:{" "}
      {_.size(record.EntityDetails) ? record.EntityDetails.EntityType.$ : "-"}
      <br />
      Reason Listed: {record.ReasonListed ? record.ReasonListed.$ : "-"}
      <br />
      False Positive:{" "}
      {record.FalsePositive
        ? record.FalsePositive.$ == true ? "True" : "False"
        : "-"}
      <br />
      True Match:{" "}
      {record.TrueMatch ? (record.TrueMatch.$ == true ? "True" : "False") : "-"}
      <br />
      Added To Accept List:{" "}
      {record.AddedToAcceptList
        ? record.AddedToAcceptList.$ == true ? "True" : "False"
        : "-"}
      <br />
      Address: {addr}
      <br />
    </div>
  );
}

function serp_search_html(record) {
  return (
    <div>
      <div>
        <b>{record.title}</b>
      </div>
      <div>
        <b>{record.snippet}</b>
      </div>
      <div>
        <a href={record.link} target="_blank">
          {record.displayed_link}
        </a>
      </div>
      {_.size(record.sentiment_analysis) ? (
        <div>
          Sentiments:{" "}
          <Tag className="">{record.sentiment_analysis.Sentiment}</Tag>
        </div>
      ) : null}
    </div>
  );
}

class EntityGroup extends Component {
  constructor() {
    super();
    this.state = {
      visible: false
    };
  }

  showModal = () => {
    this.setState({
      visible: true
    });
  };

  handleOk = e => {
    this.setState({
      visible: false
    });
  };

  handleCancel = e => {
    this.setState({
      visible: false
    });
  };

  render() {
    let firstEntity = this.props.group[0];

    return (
      <Col
        span={8}
        className="mr-bottom-lg "
        style={{ paddingLeft: "15px", paddingRight: "15px", minHeight: "70px" }}
      >
        <div className="mr-bottom-sm t-12">
          <span
            onClick={this.showModal}
            className="text-anchor text-secondary t-12 float-right"
          >
            {this.props.group.length - 1 !== 0
              ? "view all " + this.props.group.length
              : ""}
          </span>
          {this.props.title}
        </div>
        <div className="t-14">
          <EntityItem
            title={
              firstEntity.entity_metadata.wikipedia_url ? (
                <a
                  target="_blank"
                  href={firstEntity.entity_metadata.wikipedia_url}
                  className="text-secondary"
                >
                  {firstEntity.entity_name}
                </a>
              ) : (
                <span>{firstEntity.entity_name}</span>
              )
            }
            score={firstEntity.salience}
          />

          <Modal
            title={this.props.title}
            visible={this.state.visible}
            onOk={this.handleOk}
            onCancel={this.handleCancel}
            footer={<div />}
            bodyStyle={{ height: "400px", overflow: "scroll" }}
          >
            <div className="mr-bottom text-medium">
              <b>
                <span className="float-right">Salience score</span>
                <span>Entity name</span>
              </b>
            </div>

            {_.map(
              _.sortBy(this.props.group, [
                function(o) {
                  return o.entity_metadata.wikipedia_url;
                }
              ]),
              function(entity) {
                return (
                  <div className="mr-bottom">
                    <EntityItem
                      title={
                        entity.entity_metadata.wikipedia_url ? (
                          <a
                            target="_blank"
                            href={entity.entity_metadata.wikipedia_url}
                            className="text-secondary"
                          >
                            {entity.entity_name}
                          </a>
                        ) : (
                          <span>{entity.entity_name}</span>
                        )
                      }
                      score={entity.salience}
                    />
                  </div>
                );
              }
            )}
          </Modal>
        </div>
      </Col>
    );
  }
}

const getProgressPercent = ({ score }) => {
  /**
   * Scores range from -1 to 1, we normalize that to 0 to 2
   * Finally dividing this by 2 will give us the actual percentage
   */
  const normalized_score = score + 1;
  return normalized_score * 100 / 2;
};

//Get color according to score
const getProgressColor = ({ percent }) => {
  let color = "#fd4d4a";
  if (percent > 50) {
    color = "#8bcd36";
  }
  return color;
};

const EntityItem = props => {
  let percent = getProgressPercent({ score: props.score });
  let color = getProgressColor({ percent: percent });

  let i = (
    <Row gutter={10}>
      <Col span={18} className="text-light">
        <div className="text-ellipsis">{props.title}</div>
      </Col>
      <Col span={6} className="text-right">
        <Tooltip title={props.score}>
          <Progress
            size="small"
            percent={percent}
            strokeColor="#305ebe"
            showInfo={false}
          />
        </Tooltip>
      </Col>
    </Row>
  );

  return i;
};

function google_search_html(record, search) {
  const salienceSortedValues =
    record.entity_data &&
    record.entity_data.sort((a, b) => {
      return b.salience - a.salience;
    });

  const groupedData = _.groupBy(salienceSortedValues, function(o) {
    if (o.entity_type) {
      return o.entity_type;
    }
  });

  const progressPercent = getProgressPercent({ score: record.sentiment_score });

  let removeEntity = ["CONSUMER_GOOD", "WORK_OF_ART", "OTHER"];

  const getRelevanceScore = score => {
    let s = parseFloat(score).toFixed(2);
    let icon = "nobar";
    if (s > 0.5 && s < 0.625) {
      icon = "bar1";
    } else if (s >= 0.625 && s < 0.75) {
      icon = "bar2";
    } else if (s >= 0.75 && s < 0.875) {
      icon = "bar3";
    } else if (s >= 0.875) {
      icon = "bar4";
    }
    return icon;
  };

  const keywordHighlight = (string, keyword) => {
    return string.replace(
      new RegExp("(^|\\s)(" + keyword + ")(\\s|$)", "ig"),
      "$1<b>$2</b>$3"
    );
  };

  let snippet = record.snippet;

  console.clear();
  console.log(
    record.sorting_score +
      " --o-- " +
      record.sentiment_score * record.sentiment_magnitude
  );

  return (
    <div>
      <div className="mr-bottom t-16 text-medium gsearch-title">
        <span className="salience-icon">
          <Tooltip
            placement="left"
            title={"Relevance score: " + record.relevance_score}
          >
            <span>
              <span
                className={
                  "icon-custom " + getRelevanceScore(record.relevance_score)
                }
              />
            </span>
          </Tooltip>
        </span>
        <span dangerouslySetInnerHTML={{ __html: record.title }} />
        <span className="pd-right" />{" "}
        {record.category && record.category.name ? (
          <Tag className="alert-tag-item alert-primary">
            {record.category.name}
          </Tag>
        ) : null}
      </div>
      <div
        className="mr-bottom text-light"
        dangerouslySetInnerHTML={{ __html: record.snippet }}
      />
      <div className="mr-bottom-lg">
        <a href={record.link} target="_blank" className="text-secondary">
          {record.link}
        </a>
      </div>
      <div className="mr-bottom-lg text-light">
        Published at: {record.published_at}
      </div>

      <Row gutter={30}>
        <Col span={8} className="mr-bottom-lg" style={{ minHeight: "60px" }}>
          <div className="t-12 mr-bottom-sm text-uppercase">
            Sentiment score:
          </div>

          <Progress
            size="small"
            percent={progressPercent}
            strokeColor={getProgressColor({ percent: progressPercent })}
            showInfo={false}
          />
        </Col>

        <Col span={8} className="mr-bottom-lg" style={{ minHeight: "60px" }}>
          <div className="t-12 mr-bottom-sm text-uppercase">
            Sentiment Magnitude:
          </div>

          {parseFloat(record.sentiment_magnitude).toFixed(2)}
        </Col>
        {_.map(groupedData, function(group, key) {
          if (!removeEntity.includes(key)) {
            return <EntityGroup group={group} title={key} />;
          }
        })}
      </Row>
    </div>
  );
}

function rdc_event_details(record) {
  return (
    <div>
      <span>{record.EventTypeText}</span>
      <br />
      <span>{record.EventTypeCode}</span>
      <br />
      <span>{record.EventDate}</span>
      <br />
      <span>{record.EventSubTypeText}</span>
      <br />
      <span>{record.EventSubTypeCode}</span>
      <br />
      <span>{record.status}</span>
    </div>
  );
}

function dnb_ubo_html(record) {
  let addr = record.PrimaryAddress;
  let addr_arr = [];
  if (_.size(addr)) {
    addr_arr = [
      _.size(addr.StreetAddressLine)
        ? addr.StreetAddressLine[0]["LineText"]
        : "",
      addr.PrimaryTownName || "",
      addr.TerritoryName || "",
      addr.CountryOfficialName || "",
      addr.PostalCode || ""
    ];
  }
  return (
    <div>
      <b>{record.PrimaryName}</b> <br />
      <table>
        <tbody>
          <tr>
            <td style={{ width: "50%" }}>D-U-N-S No: {record.DUNSNumber}</td>
            <td style={{ width: "50%" }}>
              Member ID: {record.MemberID || "-"}
            </td>
          </tr>
          <tr>
            <td>
              Type:{" "}
              {record.SubjectTypeDescription
                ? record.SubjectTypeDescription["$"]
                : "-"}
            </td>
            <td>
              Legal Form:{" "}
              {record.LegalFormText ? record.LegalFormText["$"] : "-"}
            </td>
          </tr>
          <tr>
            <td>
              Address: <br />
              {addr_arr.join(", ") || "-"}
            </td>
          </tr>
          {record.BeneficialOwnershipPercentage ? (
            <tr>
              <td>
                Beneficial Ownership Percentage:&nbsp;
                {record.BeneficialOwnershipPercentage || "-"}
              </td>
            </tr>
          ) : null}
          {record.DirectOwnershipPercentage ? (
            <tr>
              <td>
                Ownership Percentage:&nbsp;
                {record.DirectOwnershipPercentage || "-"}
              </td>
            </tr>
          ) : null}
        </tbody>
      </table>
    </div>
  );
}

function dnb_directors_html(record) {
  let positions = null;
  if (_.size(record.Position)) {
    positions = (
      <span>
        <div>
          <b>Positions:</b>
        </div>
        <div>
          {_.map(record.Position, function(p) {
            return <div>&nbsp;&nbsp;{p.PositionText.$}</div>;
          })}
        </div>
      </span>
    );
  }

  return (
    <div>
      <div>
        <b>Name</b>:{" "}
        {record.PrincipalName ? record.PrincipalName.FullName.$ : "-"}
      </div>
      {record.MostSeniorPrincipalIndicator ? (
        <div>
          <b>Most Senior Principal Indicator</b>:{" "}
          {record.MostSeniorPrincipalIndicator == true ? "True" : "False"}
        </div>
      ) : null}

      {positions ? <div>{positions}</div> : null}

      {_.size(record.PrincipalName.OrganizationPrimaryName) ? (
        <div>
          <b>Organization Primary Name</b>:{" "}
          {record.PrincipalName.OrganizationPrimaryName.OrganizationName.$}
        </div>
      ) : null}
      {_.size(record.PrincipalName.OrganizationRegisteredName) ? (
        <div>
          <b>Organization Registered Name</b>:{" "}
          {record.PrincipalName.OrganizationRegisteredName.OrganizationName.$}
        </div>
      ) : null}
    </div>
  );
}

function dnb_livingston_html(record) {
  let screening_names = record.ScreeningNames;
  let screening_names_html = "";
  if (_.size(screening_names)) {
    screening_names_html = (
      <span>
        {_.map(screening_names, function(name) {
          return (
            <span>
              <span>Name: {name.SubjectName}</span>
              <br />
              <span>Match Strength: {name.MatchStrengthValue}</span>
              <br />
              <br />
            </span>
          );
        })}
      </span>
    );
  }

  let citations = record.Citations;
  let citations_html = "";
  if (_.size(citations)) {
    citations_html = (
      <span>
        <table>
          <tbody>
            <tr>
              <th>Document Date</th>
              <th>Effective Date</th>
              <th>Expiration Date</th>
              <th>Citation</th>
            </tr>
            {_.map(citations, function(c) {
              return (
                <tr>
                  <td>{c.DocumentDate}</td>
                  <td>{c.EffectiveDate}</td>
                  <td>{c.ExpirationDate}</td>
                  <td>
                    {c.DocumentVolumeReferenceIdentifier || ""}:{c.DocumentPageReferenceIdentifier ||
                      ""}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </span>
    );
  }

  let doc_link =
    "https://s3.amazonaws.com/vetted-static-assets/livingtone_rpltype.html#" +
    record.ScreeningListType;
  return (
    <div>
      <b>
        RPL Type:{" "}
        <a target="_blank" href={doc_link}>
          {record.ScreeningListType}
        </a>
      </b>{" "}
      <br />
      <b>Match Strength Value: {record.MatchStrengthValue}</b> <br />
      <b>
        Screening List Country: {record.ScreeningListCountryISOAlpha2Code}
      </b>{" "}
      <br />
      <br />
      <table>
        <tbody>
          <tr>
            <td style={{ width: "40%" }}>
              <b>Screening Names:</b>
              <br />
              {screening_names_html}
            </td>
            <td style={{ width: "60%" }}>
              <br />
              {citations_html}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}

function InfoRow(props) {
  return (
    <Row className=" mr-bottom" type="flex" justify="space-between">
      <Col span={8} className="text-muted">
        {props.label}:
      </Col>
      <Col span={16} className="text-bold ">
        {props.value ? props.value : "--"}
      </Col>
    </Row>
  );
}

function tr_results_html(record) {
  return (
    <div>
      <div>
        {" "}
        <b>Matched Term:</b> {record.matchedTerm}{" "}
      </div>
      <div>
        {" "}
        <b>Match Strength:</b> {record.matchStrength}{" "}
      </div>
      <div>
        {" "}
        <b>Matched Name Type:</b> {record.matchedNameType}{" "}
      </div>
      <div>
        {" "}
        <b>Category:</b>{" "}
        {_.size(record.categories) ? record.categories[0] : "-"}{" "}
      </div>
      <div>
        {" "}
        <b>Created on:</b>{" "}
        {record.creationDate
          ? new Date(record.creationDate).toUTCString()
          : "-"}{" "}
      </div>
      <div>
        {" "}
        <b>Modified on:</b>{" "}
        {record.modificationDate
          ? new Date(record.modificationDate).toUTCString()
          : "-"}{" "}
      </div>
      <div>
        {" "}
        <b>Reference Id:</b> {record.referenceId}{" "}
      </div>
      <div>
        {" "}
        <b>Sources:</b> {_.size(record.sources) ? record.sources[0] : "-"}{" "}
      </div>
      <div>
        {" "}
        <b>Result Id:</b> {record.resultId}{" "}
      </div>
      <div>
        <div />
      </div>
    </div>
  );
}

function dnb_rdc_html(record) {
  let alias_html = null;
  if (_.size(record.Alias)) {
    alias_html = (
      <div className="text-left">
        {_.map(record.Alias, function(al) {
          return <InfoRow label={al.AliasType} value={al.AliasName} />;
        })}
      </div>
    );
  }

  return (
    <div>
      <Row type="flex" justify="space-between">
        <Col span={11}>
          <InfoRow label="Name" value={record.EntityName} />
          <InfoRow label="Risk Score" value={record.RiskScore} />
          <InfoRow
            label="Name Match Score (%)"
            value={
              record.rosette_name_match_score
                ? parseInt(record.rosette_name_match_score.score * 100)
                : "-"
            }
          />
          <InfoRow label="Entity Type" value={record.EntityTypeText} />
        </Col>

        <Col span={11} offset={2}>
          <InfoRow label="Alert Entity ID" value={record.AlertEntityID} />
          <InfoRow
            label="Alert Entity System ID"
            value={record.AlertEntitySystemID}
          />
          <InfoRow label="Risk class (CVIP)" value={record.CVIP} />
        </Col>
      </Row>

      <Row type="flex" justify="space-between">
        <Col span={11}>
          <InfoRow
            label="Reference Detail"
            value={
              _.size(record.ReferenceDetail) || false ? (
                <div>
                  <div>{record.ReferenceDetail.SourceName}</div>
                  <div>{record.ReferenceDetail.PublicationDate}</div>
                  <div>
                    <a href={record.ReferenceDetail.WebPageURL} target="_blank">
                      {record.ReferenceDetail.WebPageURL}
                    </a>
                  </div>
                </div>
              ) : null
            }
          />
        </Col>

        <Col span={11} offset={2}>
          <div className="mr-bottom">Alias </div>
          {alias_html ? alias_html : null}
        </Col>
      </Row>
    </div>
  );
}

function workflow_comment_html(record) {
  return (
    <div>
      <span>{record.name}</span>
    </div>
  );
}
