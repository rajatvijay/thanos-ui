import React, { Component } from "react";
import _ from "lodash";
import { Row, Col } from "antd";

export const integrationCommonFunctions = {
  dnb_ubo_html,
  dnb_rdc_html,
  dnb_directors_html,
  dnb_livingston_html,
  lexisnexis_html,
  google_search_html,
  comment_answer_body
};

function comment_answer_body(c) {
  if (!_.size(c.target.field_details)) {
    return null;
  }

  if (c.target.field_details.is_integration_type) {
    if (c.target.field_details.type == "dnb_livingstone") {
      return (
        <div style={{ marginTop: "10px", fontSize: "14px" }}>
          {dnb_livingston_html(c.target.row_json)}
        </div>
      );
    } else if (c.target.field_details.type == "dnb_ubo") {
      return (
        <div style={{ marginTop: "10px", fontSize: "14px" }}>
          {dnb_ubo_html(c.target.row_json)}
        </div>
      );
    } else if (c.target.field_details.type == "dnb_directors") {
      return (
        <div style={{ marginTop: "10px", fontSize: "14px" }}>
          {dnb_directors_html(c.target.row_json)}
        </div>
      );
    } else if (c.target.field_details.type == "google_search") {
      return (
        <div style={{ marginTop: "10px", fontSize: "14px" }}>
          {google_search_html(c.target.row_json)}
        </div>
      );
    } else if (c.target.field_details.type == "ln_search") {
      return (
        <div style={{ marginTop: "10px", fontSize: "14px" }}>
          {lexisnexis_html(c.target.row_json)}
        </div>
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

function google_search_html(record) {
  return (
    <div>
      <b dangerouslySetInnerHTML={{ __html: record.htmlTitle }} />
      <br />
      <span dangerouslySetInnerHTML={{ __html: record.htmlSnippet }} />
      <br />
      <a href={record.link} target="_blank">
        {record.formattedUrl}
      </a>
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
        <b>Name</b>: {record.PrincipalName.FullName.$}
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
