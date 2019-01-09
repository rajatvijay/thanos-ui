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
  Tag,
  Tooltip,
  Collapse
} from "antd";
import _ from "lodash";
import { commonFunctions } from "./commons";
import { integrationCommonFunctions } from "./integration_common";
import { countries } from "./countries.js";
import {
  dunsFieldActions,
  workflowStepActions,
  workflowDetailsActions
} from "../../../actions";

const FormItem = Form.Item;
const Option = Select.Option;
const { Column, ColumnGroup } = Table;
const Panel = Collapse.Panel;

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

//duns field
class DnbRDC extends Component {
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
    this.props.getIntegrationComments(data.AlertEntityID, this.props.field.id);
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
      <div>
        {getFields(props)} {final_html}
      </div>
    );
  };
}

const buildDetails = obj => {
  var akas = obj["Alias"];

  const Column = props => {
    return (
      <Col span={props.column ? props.column : 24} className="pd-left pd-right">
        <span className="dt-value text-medium">{props.label}</span>
        <span className="dt-value pd-left">
          {props.value ? props.value : "-"}
        </span>
      </Col>
    );
  };

  const RowHead = props => {
    return (
      <Row
        gutter={24}
        className={props.className ? props.className : "mr-bottom-lg"}
      >
        <Col span={24}>
          <strong className="dt-label">{props.label}</strong>
        </Col>
      </Row>
    );
  };

  const Rowminator = props => {
    return (
      <Row gutter={24}>
        {_.map(props.row, function(col, index) {
          return col;
        })}
      </Row>
    );
  };

  const Columnizer = props => {
    let final_html = null;
    let row = [];
    let rowRender = null;

    final_html = _.map(props.cols, function(col, index) {
      row.push(col);
      if (row.length < 2) {
        if (props.cols.length - 1 === index) {
          rowRender = <Rowminator row={row} />;
          row = [];
          return rowRender;
        }
      } else {
        rowRender = <Rowminator row={row} />;
        row = [];
        return rowRender;
      }
    });
    return final_html;
  };

  // const FinSection = props => {
  //   let cols = [];
  //   const list = props.list;
  //   let length = list.length;

  //   _.map(list, function(item, index) {
  //     var col = (
  //       <Column
  //         label={item.ItemDescriptionText ? item.ItemDescriptionText["$"] : "-"}
  //         value={
  //           item.ItemAmount ? (
  //             <NumberFormat value={item.ItemAmount["$"]} format={"0,0"} />
  //           ) : (
  //             "-"
  //           )
  //         }
  //         column={12}
  //       />
  //     );
  //     cols.push(col);
  //   });

  //   return (
  //     <div className="statement-section">
  //       <RowHead label={props.header} className="mr-top-lg mr-bottom-lg" />
  //       <Columnizer cols={cols} />
  //     </div>
  //   );
  // };

  // const InfoRow = props => {
  //   return (
  //     <Row className=" mr-bottom" type="flex" justify="space-between">
  //       <Col span={8} className="text-muted">
  //         {props.label}:
  //       </Col>
  //       <Col span={16} className="text-bold ">
  //         {props.value ? props.value : "--"}
  //       </Col>
  //     </Row>
  //   );
  // };

  akas = _.map(akas, function(aka) {
    return (
      <span>
        <span>
          &nbsp;<b>{aka.AliasType}: </b>
          {aka.AliasName}
        </span>
        <br />
      </span>
    );
  });

  const referenceBuilder = props => {
    let refArry = [];

    if (
      props.ReferenceDetails &&
      _.size(props.ReferenceDetails.ReferenceDetail)
    ) {
      refArry = props.ReferenceDetails.ReferenceDetail;
    }

    return refArry;
  };

  const customPanelStyle = {
    // /background: '#f7f7f7',
    borderRadius: 0,
    marginBottom: 0,
    //border: 0,
    overflow: "hidden"
  };

  const getAbbr = (code, subCode) => {
    let abbrList = [
      { label: "ACC", value: "Accuse" },
      { label: "ALL", value: "Allege" },
      { label: "CSP", value: "Conspire" },
      { label: "PRB", value: "Probe" },
      { label: "SPT", value: "Suspected" },
      { label: "ARN", value: "Arraign" },
      { label: "ART", value: "Arrest" },
      { label: "ADT", value: "Audit" },
      { label: "CHG", value: "Charged" },
      { label: "CMP", value: "Complaint Filed" },
      { label: "IND", value: "Indict, Indictment" },
      { label: "LIN", value: "Lien" },
      { label: "SEZ", value: "Seizure" },
      { label: "WTD", value: "Wanted" },
      { label: "APL", value: "Appeal" },
      { label: "CNF", value: "Confession" },
      { label: "PLE", value: "Plea" },
      { label: "SET", value: "Settlement or Suit" },
      { label: "TRL", value: "Trial" },
      { label: "ACQ", value: "Acquit, Not Guilty" },
      { label: "ACT", value: "Disciplinary, Regulatory Action" },
      { label: "ARB", value: "Arbitration" },
      { label: "ASC", value: "Associated,  Seen with " },
      { label: "CEN", value: "Censure" },
      { label: "CVT", value: "Convict, Conviction" },
      { label: "DEP", value: "Deported" },
      { label: "DMS", value: "Dismissed" },
      { label: "EXP", value: "Expelled" },
      { label: "FIL", value: "Fine < $10,000" },
      { label: "FIM", value: "Fine > $10,000" },
      { label: "GOV", value: "Government Official" },
      { label: "RVK", value: "Revoked Registration" },
      { label: "SAN", value: "Sanction" },
      { label: "SJT", value: "Served Jail Time" },
      { label: "SPD", value: "Suspended" },
      {
        label: "BRB",
        value: "Bribery, Graft, Kickbacks, Political Corruption"
      },
      {
        label: "BUS",
        value: "Business Crimes (Antitrust, Bankruptcy, Price Fixing)"
      },
      { label: "DEN", value: "Denied Entity" },
      { label: "FOF", value: "Former OFAC List" },
      { label: "FRD", value: "Fraud, Scams, Swindles" },
      { label: "MLA", value: "Money Laundering" },
      {
        label: "ORG",
        value: "Organized Crime, Criminal Association, Racketeering"
      },
      { label: "PEP", value: "Person Political" },
      { label: "REG", value: "Regulatory Action" },
      {
        label: "SEC",
        value: "SEC Violations (Insider Trading, Securities Fraud)"
      },
      { label: "TER", value: "Terrorist Related" },
      { label: "WLT", value: "Watch List" },
      { label: "CFT", value: "Counterfeiting, Forgery" },
      { label: "CYB", value: "Computer Related, Cyber Crime" },
      { label: "DTF", value: "Trafficking or Distribution of Drug" },
      { label: "FUG", value: "Fugitive, Escape" },
      { label: "GAM", value: "Illegal Gambling" },
      { label: "HUM", value: "Human Rights, Genocide, War Crimes" },
      { label: "IMP", value: "Identity Theft, Impersonation" },
      { label: "KID", value: "Kidnapping, Abduction, Held Against Will" },
      { label: "LNS", value: "Loan Sharking, Usury, Predatory Lending" },
      { label: "MOR", value: "Mortgage Related" },
      { label: "MSB", value: "Money Services Business" },
      {
        label: "MUR",
        value: "Murder, Manslaughter (Committed, Planned or Attempted)"
      },
      { label: "OBS", value: "Obscenity Related, Child Pornography" },
      {
        label: "PRJ",
        value:
          "Perjury, Obstruction of Justice, False Filings, False Statements"
      },
      { label: "RES", value: "Real Estate Actions" },
      {
        label: "SEX",
        value: "Sex Offenses (Rape, Sodomy, Sexual Abuse, Pedophilia)"
      },
      {
        label: "SMG",
        value: "Smuggling (Does not include Drugs, Money, People or Guns"
      },
      { label: "SPY", value: "Spying (Treason, Espionage)" },
      { label: "TAX", value: "Tax Related Offenses" },
      {
        label: "TFT",
        value: "Theft (Larceny, Misappropriation, Embezzlement, Extortion)"
      },
      { label: "TRF", value: "People Trafficking, Organ Trafficking" },
      { label: "ARS", value: "Arson" },
      { label: "AST", value: "Assault, Battery" },
      { label: "BUR", value: "Burglary" },
      { label: "CON", value: "Conspiracy (no specific crime named)" },
      { label: "DPS", value: "Possession of Drugs or Drug Paraphernalia" },
      { label: "FOR", value: "Forfeiture" },
      {
        label: "IGN",
        value: "Possession or Sale of Guns, Weapons and Explosives"
      },
      { label: "PSP", value: "Possession of Stolen Property" },
      { label: "ROB", value: "Robbery (Stealing by Threat, Use of Force)" },
      { label: "ABU", value: "Abuse (Domestic, Elder, Child)" },
      {
        label: "CPR",
        value:
          "Copyright Infringement (Intellectual Property, Electronic Piracy"
      },
      {
        label: "ENV",
        value:
          "Environmental Crimes (Poaching, Illegal Logging, Animal Cruelty)"
      },
      { label: "IPR", value: "Illegal Prostitution" },
      { label: "MIS", value: "Misconduct" },
      { label: "NSC", value: "Nonspecific Crimes" }
    ];

    let tootliptext1 = _.find(abbrList, function(o) {
      return o.label === code;
    });
    let tootliptext2 = _.find(abbrList, function(o) {
      return o.label === subCode;
    });

    return (
      <span>
        <Tooltip
          title={
            (tootliptext1 ? tootliptext1.value + " / " : "") +
            (tootliptext2 ? tootliptext2.value : "")
          }
        >
          <span>{code + " / " + subCode}</span>
        </Tooltip>
      </span>
    );
  };

  return (
    <div className="dnb-rdc-wrapper">
      <div className="match-item company-item">
        <Row className="mr-bottom-lg">
          <Column
            column={12}
            label="Alert Entity ID:"
            value={obj.AlertEntityID}
          />

          <Column
            column={12}
            label="Rosette name match score:"
            value={
              obj.rosette_name_match_score
                ? obj.rosette_name_match_score.score
                : "-"
            }
          />
          <Column
            column={24}
            label="Alert Entity System ID:"
            value={obj.AlertEntitySystemID}
          />
        </Row>

        <Collapse bordered={false}>
          <Panel
            header={<div className="match-title t-16 -text-bold">Alias</div>}
            key="4"
            style={customPanelStyle}
          >
            <Row gutter={16} className="mr-bottom-lg">
              {_.map(obj.Alias, function(aliasItem) {
                return (
                  <Column
                    column={12}
                    label={aliasItem.AliasType + ":"}
                    value={aliasItem.AliasName || "-"}
                  />
                );
              })}
              <br />
              <br />
            </Row>
          </Panel>

          <Panel
            header={
              <div className="match-title t-16 -text-bold">Addresses</div>
            }
            key="address"
            style={customPanelStyle}
          >
            <Row>
              {_.map(obj.Address, function(address) {
                let wholeAddress =
                  address.StreetAddressLine &&
                  address.StreetAddressLine.LineText
                    ? address.StreetAddressLine.LineText + ","
                    : "";
                wholeAddress =
                  wholeAddress +
                  (address.CountryISOAlpha2Code
                    ? address.CountryISOAlpha2Code + ", "
                    : "");
                wholeAddress =
                  wholeAddress +
                  (address.TerritoryName ? address.TerritoryName + ", " : "");
                wholeAddress =
                  wholeAddress +
                  (address.PrimaryTownName
                    ? address.PrimaryTownName + ", "
                    : "");

                return <Column column={12} value={wholeAddress} />;
              })}

              <br />
              <br />
            </Row>
          </Panel>

          <Panel
            header={
              <div className="match-title t-16 -text-bold">Riskography</div>
            }
            key="6"
            style={customPanelStyle}
          >
            <Row gutter={16} className="mr-bottom-lg">
              {_.map(obj.NonspecificParameterDetail, function(item) {
                if (item.ParameterIdentificationNumber === "RGP") {
                  return (
                    <Column
                      column={24}
                      label={item.ParameterIdentificationNumber + ":"}
                      value={item.ParameterValue}
                    />
                  );
                }
              })}
              <br />
              <br />
            </Row>
          </Panel>

          <Panel
            header={<div className="match-title t-16 -text-bold">Source</div>}
            key="2"
            style={customPanelStyle}
          >
            {_.map(referenceBuilder(obj), function(refItem) {
              return (
                <Row className="mr-bottom-lg">
                  <Column
                    column={12}
                    label="SourceName:"
                    value={refItem.SourceName || "-"}
                  />
                  <Column
                    column={12}
                    label="Headline:"
                    value={refItem.Headline || "-"}
                  />
                  <Column
                    column={12}
                    label="Web page:"
                    value={
                      (
                        <a href={refItem.WebPageURL} target="_blank">
                          {refItem.WebPageURL}
                        </a>
                      ) || "-"
                    }
                  />
                  <Column
                    column={12}
                    label="Source type:"
                    value={refItem.SourceTypeText || "-"}
                  />
                  <Column
                    column={12}
                    label="Publisher Name:"
                    value={refItem.PublisherName || "-"}
                  />
                  <Column
                    column={12}
                    label="Publication:"
                    value={refItem.PublicationSource || "-"}
                  />
                  <br />
                  <br />
                </Row>
              );
            })}

            {obj.ReferenceDetail ? (
              <Row className="mr-bottom-lg">
                <Column
                  column={12}
                  label="SourceName:"
                  value={obj.ReferenceDetail.SourceName || "-"}
                />
                <Column
                  column={12}
                  label="Headline:"
                  value={obj.ReferenceDetail.Headline || "-"}
                />
                <Column
                  column={12}
                  label="Web page:"
                  value={
                    (
                      <a href={obj.ReferenceDetail.WebPageURL} target="_blank">
                        {obj.ReferenceDetail.WebPageURL}
                      </a>
                    ) || "-"
                  }
                />
                <Column
                  column={12}
                  label="Source type:"
                  value={obj.ReferenceDetail.SourceTypeText || "-"}
                />
                <Column
                  column={12}
                  label="Publisher Name:"
                  value={obj.ReferenceDetail.PublisherName || "-"}
                />
                <Column
                  column={12}
                  label="Publication:"
                  value={obj.ReferenceDetail.PublicationSource || "-"}
                />
                <br />
                <br />
              </Row>
            ) : null}
          </Panel>

          <Panel
            header={
              <div className="match-title t-16 -text-bold">Event details</div>
            }
            key="3"
            style={customPanelStyle}
          >
            {_.map(obj.EventDetail, function(refItem) {
              return (
                <Row gutter={16} className="mr-bottom-lg">
                  {_.size(refItem.ReferenceDetail)
                    ? _.map(refItem.ReferenceDetail, function(item) {
                        return (
                          <div>
                            {item.SourceName ? (
                              <Column
                                column={12}
                                label="Source Name:"
                                value={item.SourceName}
                              />
                            ) : null}

                            {item.Headline ? (
                              <Column
                                column={12}
                                label="Headline:"
                                value={item.Headline || "-"}
                              />
                            ) : null}

                            {item.WebPageURL ? (
                              <Column
                                column={12}
                                label="Web page:"
                                value={
                                  (
                                    <a href={item.WebPageURL} target="_blank">
                                      {item.WebPageURL}
                                    </a>
                                  ) || "-"
                                }
                              />
                            ) : null}

                            {item.SourceTypeText ? (
                              <Column
                                column={12}
                                label="Source type:"
                                value={item.SourceTypeText || "-"}
                              />
                            ) : null}

                            {item.PublisherName ? (
                              <Column
                                column={12}
                                label="Publisher Name:"
                                value={item.PublisherName || "-"}
                              />
                            ) : null}

                            {item.PublicationSource ? (
                              <Column
                                column={12}
                                label="Publication:"
                                value={item.PublicationSource || "-"}
                              />
                            ) : null}
                          </div>
                        );
                      })
                    : null}

                  <Column
                    column={12}
                    label="Event Text:"
                    value={refItem.EventText || "-"}
                  />

                  <Column
                    column={12}
                    label="Event Date:"
                    value={refItem.EventDate || "-"}
                  />
                  <Column
                    column={12}
                    label="Event Type Text:"
                    value={refItem.EventTypeText || "-"}
                  />

                  <Column
                    column={12}
                    label="Event Type Code:"
                    value={getAbbr(
                      refItem.EventTypeCode,
                      refItem.EventSubTypeCode
                    )}
                  />

                  <Column
                    column={12}
                    label="Event SubType Text:"
                    value={refItem.EventSubTypeText || "-"}
                  />

                  <Column
                    column={12}
                    label="Postal Code:"
                    value={refItem.PostalCode || "-"}
                  />

                  <br />
                  <br />
                </Row>
              );
            })}
          </Panel>

          <Panel
            header={
              <div className="match-title t-16 -text-bold">Entity URL</div>
            }
            key="5"
            style={customPanelStyle}
          >
            <Row gutter={16} className="mr-bottom-lg">
              {_.map(obj.NonspecificParameterDetail, function(item) {
                if (item.ParameterIdentificationNumber !== "RGP") {
                  return (
                    <Column
                      column={12}
                      label={item.ParameterIdentificationNumber + ":"}
                      value={
                        item.ParameterIdentificationNumber === "URL" ? (
                          <a href={item.ParameterValue} target="_blank">
                            {item.ParameterValue}
                          </a>
                        ) : (
                          item.ParameterValue
                        )
                      }
                    />
                  );
                }
              })}
              <br />
              <br />
            </Row>
          </Panel>
        </Collapse>
      </div>
    </div>
  );
};

const GetTable = props => {
  // for error
  if (
    props.jsonData.SearchComplianceAlertsResponse.TransactionResult.ResultID !=
    "PD021"
  ) {
    return (
      <div className="text-center text-red">
        {
          props.jsonData.SearchComplianceAlertsResponse.TransactionResult
            .ResultText
        }
      </div>
    );
  }

  if (
    !_.size(
      props.jsonData.SearchComplianceAlertsResponse
        .SearchComplianceAlertsResponseDetail.AlertDetail
    ) ||
    !_.size(
      props.jsonData.SearchComplianceAlertsResponse
        .SearchComplianceAlertsResponseDetail.AlertDetail[0]["AlertEntity"]
    )
  ) {
    return <div className="text-center text-red">No result found!</div>;
  }

  const data =
    props.jsonData.SearchComplianceAlertsResponse
      .SearchComplianceAlertsResponseDetail.AlertDetail[0]["AlertEntity"];

  const columns = [
    {
      title: "Entity name",
      dataIndex: "EntityName",
      key: "EntityName"
    },
    {
      title: "Risk class (CVIP)",
      dataIndex: "CVIP",
      key: "CVIP"
    },
    {
      title: "Risk score",
      dataIndex: "RiskScore",
      key: "RiskScore"
    },
    {
      title: "Type",
      dataIndex: "EntityTypeText",
      key: "EntityTypeText"
    },
    {
      title: "Comments",
      key: "ubo_index",
      render: record => {
        let flag_data = _.size(props.flag_dict[record.AlertEntityID])
          ? props.flag_dict[record.AlertEntityID]
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
              {props.commentCount[record.AlertEntityID]
                ? props.commentCount[record.AlertEntityID] + " comment(s)"
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
    <Table
      dataSource={data}
      pagination={true}
      columns={columns}
      rowKey="AlertEntityID"
      expandedRowRender={record => buildDetails(record)}
    />
  );
};

export const RDC = props => {
  return <DnbRDC {...props} />;
};
