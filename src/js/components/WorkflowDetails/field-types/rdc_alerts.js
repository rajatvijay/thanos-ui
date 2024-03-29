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
  getIntegrationSearchButton,
  isDnBIntegrationDataLoading
} = commonFunctions;

//Field Type DUNS SEARCH
const getFields = props => {
  return getIntegrationSearchButton(props);
};

//duns field
class DnbRDCAlerts extends Component {
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
    this.props.getIntegrationComments(data.sysId, this.props.field.id);
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
    if (
      this.props.currentStepFields.integration_data_loading ||
      isDnBIntegrationDataLoading(this.props)
    ) {
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
  var akas = obj["alias"];

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

  akas = _.map(akas, function(aka) {
    return (
      <span>
        <span>
          &nbsp;<b>{aka.aliasTyp}: </b>
          {aka.aliasName}
        </span>
        <br />
      </span>
    );
  });

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
          <Column column={12} label="Alert Entity ID:" value={obj.entityId} />
          <Column
            column={12}
            label="Source name:"
            value={obj.source.sourceName || "-"}
          />

          <Column
            column={12}
            label="Source  date"
            value={obj.source.entityDt || "-"}
          />

          <Column
            column={12}
            label="Source format"
            value={obj.source.format || "-"}
          />

          <Column column={12} label="System Id" value={obj.sysId || "-"} />
          <Column
            column={12}
            label="URL"
            value={
              <a href={obj.rdcURL} target="_blank">
                {obj.rdcURL}
              </a>
            }
          />
        </Row>

        <Collapse accordion bordered={false}>
          <Panel
            header={<div className="match-title t-16 -text-bold">Event</div>}
            key="event"
            style={customPanelStyle}
          >
            <Row>
              {_.map(obj.event, function(refItem) {
                return (
                  <Row gutter={16} className="mr-bottom-lg">
                    {refItem.category ? (
                      <div>
                        {refItem.category.categoryCode ? (
                          <Column
                            column={12}
                            label="Category:"
                            value={
                              refItem.category.categoryCode +
                              " / " +
                              refItem.category.categoryDesc
                            }
                          />
                        ) : null}

                        {refItem.eventDesc ? (
                          <Column
                            column={12}
                            label="Description:"
                            value={refItem.eventDesc || "-"}
                          />
                        ) : null}

                        {refItem.eventDt ? (
                          <Column
                            column={12}
                            label="Event date:"
                            value={refItem.eventDt || "-"}
                          />
                        ) : null}

                        {refItem.subCategory ? (
                          <Column
                            column={12}
                            label="Sub category:"
                            value={
                              refItem.subCategory.categoryCode +
                                " / " +
                                refItem.subCategory.categoryDesc || "-"
                            }
                          />
                        ) : null}
                      </div>
                    ) : null}

                    <br />
                    <br />
                  </Row>
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
              {_.map(obj.postAddr, function(address) {
                return (
                  <div>
                    <Column
                      column={12}
                      label="Locator Type:"
                      value={getAbbr(address.locatorTyp) || "-"}
                    />
                    <Column
                      column={12}
                      label="Country Code:"
                      value={address.countryCode.countryCodeValue || "-"}
                    />
                  </div>
                );
              })}

              <br />
              <br />
            </Row>
          </Panel>

          <Panel
            header={
              <div className="match-title t-16 -text-bold">Attribute</div>
            }
            key="attribute"
            style={customPanelStyle}
          >
            {_.map(obj.attribute, function(arrtitem) {
              return (
                <Row gutter={16} className="mr-bottom-lg">
                  <Column
                    column={12}
                    label="Attribute Code:"
                    value={arrtitem.attCode + " / " + arrtitem.attDesc || "-"}
                  />

                  <Column
                    column={12}
                    label="Attribute value:"
                    value={arrtitem.attVal || "-"}
                  />

                  <br />
                  <br />
                </Row>
              );
            })}
          </Panel>

          <Panel
            header={<div className="match-title t-16 -text-bold">Alias</div>}
            key="4"
            style={customPanelStyle}
          >
            {_.map(obj.alias, function(aliasItem) {
              return (
                <Row gutter={16} className="mr-bottom-lg">
                  <Column
                    column={12}
                    label={aliasItem.aliasTyp + ":"}
                    value={aliasItem.aliasName || "-"}
                  />
                  <Column
                    column={12}
                    label={aliasItem.aliasTyp + ":"}
                    value={aliasItem.aliasName || "-"}
                  />

                  <br />
                  <br />
                </Row>
              );
            })}
          </Panel>
        </Collapse>
      </div>
    </div>
  );
};

const GetTable = props => {
  // for error
  if (
    props.jsonData.SearchComplianceAlertsResponse &&
    props.jsonData.SearchComplianceAlertsResponse.TransactionResult.ResultID
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

  let data = [];
  if (
    props.jsonData.gridAlertInfo &&
    _.size(props.jsonData.gridAlertInfo.alerts) &&
    _.size(props.jsonData.gridAlertInfo.alerts.alertEntity)
  ) {
    data = props.jsonData.gridAlertInfo.alerts.alertEntity;
  } else {
    return <div className="text-center text-red">No alerts found!</div>;
  }

  const columns = [
    {
      title: "Entity name",
      dataIndex: "entityName",
      key: "entityName"
    },
    {
      title: "Risk class (CVIP)",
      dataIndex: "cvip",
      key: "cvip"
    },
    {
      title: "Risk score",
      dataIndex: "riskScore",
      key: "riskScore"
    },
    {
      title: "Type",
      dataIndex: "entityTyp",

      key: "entityTyp"
    },
    {
      title: "Comments",
      key: "ubo_index",
      render: record => {
        let flag_data = _.size(props.flag_dict[record.sysId])
          ? props.flag_dict[record.sysId]
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
              {props.commentCount[record.sysId]
                ? props.commentCount[record.sysId] + " comment(s)"
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
      rowKey="sysId"
      expandedRowRender={record => buildDetails(record)}
    />
  );
};

export const RDCAlerts = props => {
  return <DnbRDCAlerts {...props} />;
};
