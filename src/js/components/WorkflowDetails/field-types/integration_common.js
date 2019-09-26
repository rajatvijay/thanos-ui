import React, { Component } from "react";
import _ from "lodash";
import { Row, Col, Tag } from "antd";
import IntlTooltip from "../../common/IntlTooltip";
import { FormattedMessage } from "react-intl";
import { map, includes } from "lodash";
import { commonFunctions } from "./commons";

const { getUserGroupFilter } = commonFunctions;

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
  comment_answer_body,
  filterEventsByFlag
};

function comment_answer_body(c) {
  const classes = "";

  if (_.size(c.target.workflow_details)) {
    return <span className={classes}>{workflow_comment_html(c.target)}</span>;
  }

  if (!_.size(c.target.field_details)) {
    return null;
  }

  if (c.target.field_details.is_integration_type) {
    // TODO : Use Switch here instead.
    if (c.target.field_details.type === "dnb_livingstone") {
      return (
        <span className={classes}>
          {dnb_livingston_html(c.target.row_json)}
        </span>
      );
    } else if (c.target.field_details.type === "dnb_ubo") {
      return <span className={classes}>{dnb_ubo_html(c.target.row_json)}</span>;
    } else if (c.target.field_details.type === "dnb_directors") {
      return (
        <span className={classes}>{dnb_directors_html(c.target.row_json)}</span>
      );
    } else if (c.target.field_details.type === "google_search") {
      return (
        <span className={classes}>{google_search_html(c.target.row_json)}</span>
      );
    } else if (c.target.field_details.type === "ln_search") {
      return (
        <span className={classes}>{lexisnexis_html(c.target.row_json)}</span>
      );
    } else if (c.target.field_details.type === "thomson_reuters_screenresult") {
      return (
        <span className={classes}>{tr_results_html(c.target.row_json)}</span>
      );
    } else if (c.target.field_details.type === "rdc_event_details") {
      return (
        <span className={classes}>{rdc_event_details(c.target.row_json)}</span>
      );
    }
  } else {
    return (
      <div
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
        {_.map(record.EntityDetails.Addresses.EntityAddress, function(
          a,
          index
        ) {
          const t = [
            a.Street1 ? a.Street1.$ : "",
            a.City ? a.City.$ : "",
            a.StateProvinceDistrict ? a.StateProvinceDistrict.$ : "",
            a.Country ? a.Country.$ : "",
            a.PostalCode ? a.PostalCode.$ : ""
          ];
          return <div key={`${index}`}> - {t.join(" ")}</div>;
        })}
      </div>
    );
  }
  return (
    <div>
      <FormattedMessage id="fields.name" />: {record.BestName.$}
      <br />
      <FormattedMessage id="fields.uniqueId" />: {record.EntityUniqueID.$}
      <br />
      <FormattedMessage id="fields.score" />: {record.BestNameScore.$}
      <br />
      <FormattedMessage id="fields.entityType" />:{" "}
      {_.size(record.EntityDetails) ? record.EntityDetails.EntityType.$ : "-"}
      <br />
      <FormattedMessage id="fields.reasonListed" />:{" "}
      {record.ReasonListed ? record.ReasonListed.$ : "-"}
      <br />
      <FormattedMessage id="fields.falsePositive" />:{" "}
      {record.FalsePositive ? (
        record.FalsePositive.$ === true ? (
          <FormattedMessage id="fields.true" />
        ) : (
          <FormattedMessage id="fields.false" />
        )
      ) : (
        "-"
      )}
      <br />
      <FormattedMessage id="fields.trueMatch" />:{" "}
      {record.TrueMatch ? (
        record.TrueMatch.$ === true ? (
          <FormattedMessage id="fields.true" />
        ) : (
          <FormattedMessage id="fields.false" />
        )
      ) : (
        "-"
      )}
      <br />
      <FormattedMessage id="fields.addedToAcceptList" />:{" "}
      {record.AddedToAcceptList ? (
        record.AddedToAcceptList.$ === true ? (
          <FormattedMessage id="fields.true" />
        ) : (
          <FormattedMessage id="fields.false" />
        )
      ) : (
        "-"
      )}
      <br />
      <FormattedMessage id="fields.address" />: {addr}
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
        <a href={record.link} target="_blank" rel="noopener noreferrer">
          {record.displayed_link}
        </a>
      </div>
      {_.size(record.sentiment_analysis) ? (
        <div>
          <FormattedMessage id="fields.sentiments" />:{" "}
          <Tag className="">{record.sentiment_analysis.Sentiment}</Tag>
        </div>
      ) : null}
    </div>
  );
}

class DescriptionToggle extends Component {
  state = {
    show: false
  };

  onToggle = () => {
    this.setState({ show: !this.state.show });
  };

  componentDidMount = () => {
    const body = this.props.body;

    if (body && body.length > 50) {
      this.setState({ body: this.props.body.slice(0, 300) });
    }
  };

  render() {
    const toggle = (
      <span
        onClick={this.onToggle}
        className="text-secondary text-underline text-anchor pd-left-sm"
      >
        {this.state.show ? (
          <>
            {" ..."}
            <FormattedMessage id="fields.showLess" />
          </>
        ) : (
          <>
            {" "}
            <FormattedMessage id="fields.showMore" />
            {"..."}
          </>
        )}
      </span>
    );

    return (
      <div>
        {this.state.show ? (
          <p className="animated ">
            {this.props.body}
            {this.props.body && this.props.body.length > 50 ? toggle : null}
          </p>
        ) : (
          <p className="animated ">
            {this.state.body}
            {this.props.body && this.props.body.length > 50 ? toggle : null}
          </p>
        )}
      </div>
    );
  }
}

function google_search_html(record, search) {
  const getRelevanceScore = score => {
    const s = parseFloat(score).toFixed(2);
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

  const { snippet } = record;

  return (
    <div>
      <div className="mr-bottom t-16 text-medium gsearch-title">
        <span className="salience-icon">
          <IntlTooltip
            placement="topRight"
            title={"tooltips.relevanceScoreText"}
            values={{
              score: record.relevance_score
            }}
          >
            <span>
              <span
                className={
                  "icon-custom " + getRelevanceScore(record.relevance_score)
                }
              />
            </span>
          </IntlTooltip>
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
        dangerouslySetInnerHTML={{ __html: snippet }}
      />
      <div className="mr-bottom-lg">
        <a
          href={record.link}
          target="_blank"
          rel="noopener noreferrer"
          className="text-secondary"
          style={{ wordBreak: "break-all" }}
        >
          {record.link}
        </a>
      </div>

      <div className="mr-bottom-lg">
        <DescriptionToggle body={record.description} />
      </div>

      <div className="mr-bottom-lg text-light">
        <FormattedMessage id="fields.publishedAt" />:{" "}
        {record.published_at || "N/A"}
      </div>
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
  const addr = record.PrimaryAddress;
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
            <td style={{ width: "50%" }}>D-U-N-S #: {record.DUNSNumber}</td>
            <td style={{ width: "50%" }}>
              <FormattedMessage id="fields.memberId" />:{" "}
              {record.MemberID || "-"}
            </td>
          </tr>
          <tr>
            <td>
              <FormattedMessage id="fields.type" />:{" "}
              {record.SubjectTypeDescription
                ? record.SubjectTypeDescription["$"]
                : "-"}
            </td>
            <td>
              <FormattedMessage id="fields.legalForm" />:{" "}
              {record.LegalFormText ? record.LegalFormText["$"] : "-"}
            </td>
          </tr>
          <tr>
            <td>
              <FormattedMessage id="fields.address" />: <br />
              {addr_arr.join(", ") || "-"}
            </td>
          </tr>
          {record.BeneficialOwnershipPercentage ? (
            <tr>
              <td>
                <FormattedMessage id="fields.beneficialOwnershipPercentage" />:{" "}
                {record.BeneficialOwnershipPercentage || "-"}
              </td>
            </tr>
          ) : null}
          {record.DirectOwnershipPercentage ? (
            <tr>
              <td>
                <FormattedMessage id="fields.ownershipPercentage" />:{" "}
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
          <b>
            <FormattedMessage id="fields.positions" />:
          </b>
        </div>
        <div>
          {_.map(record.Position, function(p, index) {
            return <div key={`${index}`}>&nbsp;&nbsp;{p.PositionText.$}</div>;
          })}
        </div>
      </span>
    );
  }

  return (
    <div>
      <div>
        <b>
          <FormattedMessage id="fields.name" />
        </b>
        :{" "}
        {record.PrincipalName && record.PrincipalName.FullName
          ? record.PrincipalName.FullName.$
          : "-"}
      </div>
      {record.MostSeniorPrincipalIndicator ? (
        <div>
          <b>
            <FormattedMessage id="fields.mostSeniorPrincipalIndicator" />
          </b>
          : {record.MostSeniorPrincipalIndicator === true ? "True" : "False"}
        </div>
      ) : null}

      {positions ? <div>{positions}</div> : null}

      {_.size(record.PrincipalName.OrganizationPrimaryName) ? (
        <div>
          <b>
            <FormattedMessage id="fields.orgPrimaryName" />
          </b>
          : {record.PrincipalName.OrganizationPrimaryName.OrganizationName.$}
        </div>
      ) : null}
      {_.size(record.PrincipalName.OrganizationRegisteredName) ? (
        <div>
          <b>
            <FormattedMessage id="fields.orgRegisteredName" />
          </b>
          : {record.PrincipalName.OrganizationRegisteredName.OrganizationName.$}
        </div>
      ) : null}
    </div>
  );
}

function dnb_livingston_html(record) {
  const screening_names = record.ScreeningNames;
  let screening_names_html = "";
  if (_.size(screening_names)) {
    screening_names_html = (
      <span>
        {_.map(screening_names, function(name, index) {
          return (
            <span key={`${index}`}>
              <span>
                <FormattedMessage id="fields.name" />: {name.SubjectName}
              </span>
              <br />
              <span>
                <FormattedMessage id="fields.matchStrength" />:{" "}
                {name.MatchStrengthValue}
              </span>
              <br />
              <br />
            </span>
          );
        })}
      </span>
    );
  }

  const citations = record.Citations;
  let citations_html = "";
  if (_.size(citations)) {
    citations_html = (
      <span>
        <table>
          <tbody>
            <tr>
              <th>
                <FormattedMessage id="fields.docDate" />
              </th>
              <th>
                <FormattedMessage id="fields.effectiveDate" />
              </th>
              <th>
                <FormattedMessage id="fields.expiryDate" />
              </th>
              <th>
                <FormattedMessage id="fields.citation" />
              </th>
            </tr>
            {_.map(citations, function(c, index) {
              return (
                <tr key={`${index}`}>
                  <td>{c.DocumentDate}</td>
                  <td>{c.EffectiveDate}</td>
                  <td>{c.ExpirationDate}</td>
                  <td>
                    {c.DocumentVolumeReferenceIdentifier || ""}:
                    {c.DocumentPageReferenceIdentifier || ""}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </span>
    );
  }

  const doc_link =
    "https://s3.amazonaws.com/vetted-static-assets/livingtone_rpltype.html#" +
    record.ScreeningListType;
  return (
    <div>
      <b>
        <FormattedMessage id="fields.rplType" />:{" "}
        <a target="_blank" rel="noopener noreferrer" href={doc_link}>
          {record.ScreeningListType}
        </a>
      </b>{" "}
      <br />
      <b>
        <FormattedMessage id="fields.matchStrengthValue" />:{" "}
        {record.MatchStrengthValue}
      </b>{" "}
      <br />
      <b>
        <FormattedMessage id="fields.screeningListCountry" />:{" "}
        {record.ScreeningListCountryISOAlpha2Code}
      </b>{" "}
      <br />
      <br />
      <table>
        <tbody>
          <tr>
            <td style={{ width: "40%" }}>
              <b>
                <FormattedMessage id="fields.screeningNames" />:
              </b>
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
        <b>
          <FormattedMessage id="fields.matchedTerm" />:
        </b>{" "}
        {record.matchedTerm}{" "}
      </div>
      <div>
        {" "}
        <b>
          <FormattedMessage id="fields.matchStrength" />:
        </b>{" "}
        {record.matchStrength}{" "}
      </div>
      <div>
        {" "}
        <b>
          <FormattedMessage id="fields.matchedNameType" />:
        </b>{" "}
        {record.matchedNameType}{" "}
      </div>
      <div>
        {" "}
        <b>
          <FormattedMessage id="commonTextInstances.categoryText" />:
        </b>{" "}
        {_.size(record.categories) ? record.categories[0] : "-"}{" "}
      </div>
      <div>
        {" "}
        <b>
          <FormattedMessage id="commonTextInstances.createdOn" />:
        </b>{" "}
        {record.creationDate
          ? new Date(record.creationDate).toUTCString()
          : "-"}{" "}
      </div>
      <div>
        {" "}
        <b>
          <FormattedMessage id="commonTextInstances.modifiedOn" />:
        </b>{" "}
        {record.modificationDate
          ? new Date(record.modificationDate).toUTCString()
          : "-"}{" "}
      </div>
      <div>
        {" "}
        <b>
          <FormattedMessage id="fields.refId" />:
        </b>{" "}
        {record.referenceId}{" "}
      </div>
      <div>
        {" "}
        <b>
          <FormattedMessage id="fields.sources" />:
        </b>{" "}
        {_.size(record.sources) ? record.sources[0] : "-"}{" "}
      </div>
      <div>
        {" "}
        <b>
          <FormattedMessage id="fields.resultId" />:
        </b>{" "}
        {record.resultId}{" "}
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
        {_.map(record.Alias, function(al, index) {
          return (
            <InfoRow
              key={`${index}`}
              label={al.AliasType}
              value={al.AliasName}
            />
          );
        })}
      </div>
    );
  }

  return (
    <div>
      <Row type="flex" justify="space-between">
        <Col span={11}>
          <InfoRow
            label={<FormattedMessage id="fields.name" />}
            value={record.EntityName}
          />
          <InfoRow
            label={<FormattedMessage id="fields.riskScore" />}
            value={record.RiskScore}
          />
          <InfoRow
            label={
              <>
                <FormattedMessage id="fields.nameMatchScore" />
                {" (%)"}
              </>
            }
            value={
              record.rosette_name_match_score
                ? parseInt(record.rosette_name_match_score.score * 100)
                : "-"
            }
          />
          <InfoRow
            label={<FormattedMessage id="fields.entityType" />}
            value={record.EntityTypeText}
          />
        </Col>

        <Col span={11} offset={2}>
          <InfoRow
            label={<FormattedMessage id="fields.alertEntityId" />}
            value={record.AlertEntityID}
          />
          <InfoRow
            label={<FormattedMessage id="fields.alertEntitySysId" />}
            value={record.AlertEntitySystemID}
          />
          <InfoRow
            label={<FormattedMessage id="fields.riskClassCvip" />}
            value={record.CVIP}
          />
        </Col>
      </Row>

      <Row type="flex" justify="space-between">
        <Col span={11}>
          <InfoRow
            label={<FormattedMessage id="fields.alias" />}
            value={
              _.size(record.ReferenceDetail) || false ? (
                <div>
                  <div>{record.ReferenceDetail.SourceName}</div>
                  <div>{record.ReferenceDetail.PublicationDate}</div>
                  <div>
                    <a
                      href={record.ReferenceDetail.WebPageURL}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {record.ReferenceDetail.WebPageURL}
                    </a>
                  </div>
                </div>
              ) : null
            }
          />
        </Col>

        <Col span={11} offset={2}>
          <div className="mr-bottom">
            <FormattedMessage id="fields.alias" />{" "}
          </div>
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

function filterEventsByFlag(props, keyToFilterOn) {
  const currentFilters =
    getUserGroupFilter(props.field.definition.extra) ||
    props.field.definition.extra;
  const filter =
    currentFilters &&
    _.find(currentFilters.filters, item => item.type === "selected_flag");
  const selectedFlag = props.field.selected_flag;
  const integrationJson = props.field.integration_json;
  const flagTofilter = filter && filter.value;
  const falsePositiveIdList = map(selectedFlag, flag => {
    if (!flagTofilter) {
      return;
    }

    return flag.flag_detail.tag === flagTofilter ? flag.integration_uid : null;
  });

  integrationJson[keyToFilterOn] = _.filter(
    integrationJson[keyToFilterOn],
    event => {
      return !includes(falsePositiveIdList, event.custom_hash);
    }
  );

  return integrationJson;
}
