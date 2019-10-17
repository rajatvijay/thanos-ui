import React, { Component } from "react";
import { Row, Col, Table, Divider, Tag, Tabs, Tooltip } from "antd";
import _ from "lodash";
import { commonFunctions } from "./commons";
import { dunsFieldActions } from "../../../actions";
import { event_status } from "../EventStatuses";
import { FormattedMessage } from "react-intl";
import IntegrationLoadingWrapper from "../utils/IntegrationLoadingWrapper";

const TabPane = Tabs.TabPane;
const { getIntegrationSearchButton } = commonFunctions;

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
    const payload = {
      workflow: this.props.workflowId,
      fieldId: this.props.field.id
    };

    this.props.dispatch(dunsFieldActions.dunsSaveField(payload));
  };

  getComment = (e, data) => {
    this.props.getIntegrationComments(
      data.AlertEntitySystemID,
      this.props.field.id
    );
  };

  render = () => {
    const { field, currentStepFields } = this.props;

    const props = {
      field: field,
      onSearch: this.onSearch,
      currentStepFields: this.props.currentStepFields,
      is_locked: this.props.is_locked,
      completed: this.props.completed,
      permission: this.props.permission
    };

    const finalHTML = (
      <IntegrationLoadingWrapper
        currentStepFields={currentStepFields}
        field={field}
        step={field.step}
        check={"default"}
      >
        <div className="mr-top-lg mr-bottom-lg">
          <GetTabsFilter
            getComment={this.getComment}
            jsonData={field.integration_json}
            commentCount={field.integration_comment_count}
            flag_dict={field.selected_flag}
          />
        </div>
      </IntegrationLoadingWrapper>
    );

    return (
      <div>
        {getFields(props)} {finalHTML}
      </div>
    );
  };
}

const buildDetails = obj => {
  const Column = props => {
    return (
      <Col span={props.column ? props.column : 24} className="pd-left pd-right">
        <span className="dt-value text-medium">{props.label}:</span>
        <span className="dt-value pd-left">
          {props.value ? props.value : "-"}
        </span>
      </Col>
    );
  };

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

  const getImg = () => {
    const imgItem = _.find(obj.NonspecificParameterDetail, item => {
      return item.ParameterIdentificationNumber === "IMG";
    });
    return imgItem ? (
      <Col span={12}>
        <img src={imgItem.ParameterValue} style={{ maxWidth: "100%" }} alt="" />
      </Col>
    ) : (
      <span />
    );
  };

  const getBirthDate = () => {
    if (obj.PersonalDetail && obj.PersonalDetail.BirthDate) {
      const dates = _.map(obj.PersonalDetail.BirthDate, date => {
        return (
          <span key={`${date}`} className="pd-right-lg">
            {date},
          </span>
        );
      });
      return <Column column={12} label="Date of Birth:" value={dates} />;
    } else {
      return <div />;
    }
  };

  const getSex = () => {
    const sexitem = _.find(obj.NonspecificParameterDetail, item => {
      return item.ParameterIdentificationNumber === "SEX";
    });
    return sexitem ? (
      <Column column={12} label="Sex:" value={sexitem.ParameterValue} />
    ) : (
      <div />
    );
  };

  const getRisk = () => {
    const riskItem = _.find(obj.NonspecificParameterDetail, item => {
      return item.ParameterIdentificationNumber === "RID";
    });
    return riskItem ? (
      <span className="text-uppercase">{riskItem.ParameterValue}</span>
    ) : null;
  };

  const getPepType = () => {
    const pepItem = _.find(obj.NonspecificParameterDetail, item => {
      return item.ParameterIdentificationNumber === "PTY";
    });
    const pepDesc = _.find(obj.NonspecificParameterDetail, item => {
      return item.ParameterIdentificationNumber === "RGP";
    });
    return pepItem && pepItem.ParameterValue ? (
      <div>
        {pepItem.ParameterValue}
        <br />
        {pepDesc ? pepDesc.ParameterValue : ""}
      </div>
    ) : null;
  };

  const getPepRating = () => {
    const ratingItem = _.find(obj.NonspecificParameterDetail, item => {
      return item.ParameterIdentificationNumber === "PRT";
    });
    return ratingItem ? ratingItem.ParameterValue : null;
  };

  const RowItem = props => {
    return (
      <div style={{ borderBottom: "1px solid #f6f6f6", padding: "10px" }}>
        {props.text}
      </div>
    );
  };

  return (
    <div
      id="rdc-table"
      className="dnb-rdc-wrapper"
      style={{ marginLeft: "-50px", marginTop: "-16px" }}
    >
      <div className="match-item company-item">
        <Tabs defaultActiveKey="1" tabPosition="top">
          <TabPane
            tab={<FormattedMessage id="fields.entityDetailsAndAlias" />}
            key="1"
          >
            <Row gutter={16} className="mr-bottom-lg">
              {getImg()}
              <Column
                column={12}
                label={<FormattedMessage id="fields.entityName" />}
                value={obj.EntityName || "-"}
              />
              <Column
                column={12}
                label={<FormattedMessage id="fields.entityId" />}
                value={obj.AlertEntityID || "-"}
              />
              <Column
                column={12}
                label={<FormattedMessage id="fields.riskId" />}
                value={getRisk() || "-"}
              />
              <Column
                column={12}
                label={<FormattedMessage id="fields.pepRating" />}
                value={getPepRating() || "-"}
              />
              {getBirthDate()}
              {getSex()}
              <Column
                column={12}
                label={<FormattedMessage id="fields.pepType" />}
                value={getPepType() || "-"}
              />
            </Row>

            <Row gutter={16} className="mr-bottom-lg">
              {_.map(obj.Alias, function(aliasItem, index) {
                return (
                  <Column
                    key={`${index}`}
                    column={8}
                    label={aliasItem.AliasType}
                    value={aliasItem.AliasName || "-"}
                  />
                );
              })}

              <br />
              <br />
            </Row>
          </TabPane>

          <TabPane tab={<FormattedMessage id="fields.addresses" />} key="2">
            {_.map(obj.Address, function(address, index) {
              let wholeAddress = //STREET ADDRESS
                address.StreetAddressLine &&
                address.StreetAddressLine[0].LineText
                  ? address.StreetAddressLine[0].LineText + ","
                  : "";

              wholeAddress = //TERRITORY
                wholeAddress +
                (address.TerritoryName ? address.TerritoryName + ", " : "");

              wholeAddress = //TOWN
                wholeAddress +
                (address.PrimaryTownName ? address.PrimaryTownName + ", " : "");

              wholeAddress = //COUNTRY
                wholeAddress +
                (address.CountryISOAlpha2Code
                  ? address.CountryISOAlpha2Code + ", "
                  : "");

              wholeAddress = //PIN CODE
                wholeAddress + (address.PostalCode ? address.PostalCode : "");
              return <RowItem key={`${index}`} text={wholeAddress} />;
            })}
          </TabPane>

          {obj.EntityTypeText === "Person" ? (
            <TabPane tab={<FormattedMessage id="fields.position" />} key="3">
              {obj.Positions && obj.Positions.Position
                ? _.map(obj.Positions.Position, function(position, index) {
                    return <RowItem key={`${index}`} text={position} />;
                  })
                : null}
            </TabPane>
          ) : null}

          <TabPane tab={<FormattedMessage id="fields.riskography" />} key="4">
            <Row gutter={16} className="mr-bottom-lg">
              {_.map(obj.NonspecificParameterDetail, function(item) {
                if (item.ParameterIdentificationNumber === "RGP") {
                  return (
                    <Column
                      key={`${item.ParameterValue}`}
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
          </TabPane>

          <TabPane tab={<FormattedMessage id="fields.eventDetails" />} key="5">
            <div>
              <EventDetailComp obj={obj} />
            </div>
          </TabPane>

          {obj.EntityTypeText === "Person" ? (
            <TabPane
              tab={<FormattedMessage id="fields.relationship" />}
              key="6"
            >
              {_.map(obj.Relationships, function(relationship, index) {
                return (
                  <RowItem
                    key={`${index}`}
                    text={
                      <Row>
                        <Column
                          column={12}
                          label={<FormattedMessage id="fields.name" />}
                          value={relationship.EntityName}
                        />
                        <Column
                          column={12}
                          label={<FormattedMessage id="fields.relationship" />}
                          value={relationship.RelationshipType}
                        />
                        <Column
                          column={12}
                          label={
                            <FormattedMessage id="fields.relationshipDirection" />
                          }
                          value={relationship.RelationshipDirection}
                        />
                        <Column
                          column={12}
                          label={<FormattedMessage id="fields.entitySysId" />}
                          value={relationship.AlertEntitySystemID}
                        />
                      </Row>
                    }
                  />
                );
              })}
            </TabPane>
          ) : null}

          <TabPane tab={<FormattedMessage id="fields.source" />} key="7">
            {_.map(referenceBuilder(obj), function(refItem, index) {
              return (
                <Row key={`${index}`} className="mr-bottom-lg">
                  <Column
                    column={12}
                    label={<FormattedMessage id="fields.sourceName" />}
                    value={refItem.SourceName || "-"}
                  />
                  <Column
                    column={12}
                    label={<FormattedMessage id="fields.headline" />}
                    value={refItem.Headline || "-"}
                  />
                  <Column
                    column={12}
                    label={<FormattedMessage id="fields.webpage" />}
                    value={
                      (
                        <a
                          href={refItem.WebPageURL}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          {refItem.WebPageURL}
                        </a>
                      ) || "-"
                    }
                  />
                  <Column
                    column={12}
                    label={<FormattedMessage id="fields.sourceType" />}
                    value={refItem.SourceTypeText || "-"}
                  />
                  <Column
                    column={12}
                    label={<FormattedMessage id="fields.publisherName" />}
                    value={refItem.PublisherName || "-"}
                  />
                  <Column
                    column={12}
                    label={<FormattedMessage id="fields.publication" />}
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
                  label={<FormattedMessage id="fields.sourceName" />}
                  value={obj.ReferenceDetail.SourceName || "-"}
                />
                <Column
                  column={12}
                  label={<FormattedMessage id="fields.headline" />}
                  value={obj.ReferenceDetail.Headline || "-"}
                />
                <Column
                  column={12}
                  label={<FormattedMessage id="fields.webpage" />}
                  value={
                    (
                      <a
                        href={obj.ReferenceDetail.WebPageURL}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {obj.ReferenceDetail.WebPageURL}
                      </a>
                    ) || "-"
                  }
                />
                <Column
                  column={12}
                  label={<FormattedMessage id="fields.sourceType" />}
                  value={obj.ReferenceDetail.SourceTypeText || "-"}
                />
                <Column
                  column={12}
                  label={<FormattedMessage id="fields.publisherName" />}
                  value={obj.ReferenceDetail.PublisherName || "-"}
                />
                <Column
                  column={12}
                  label={<FormattedMessage id="fields.publication" />}
                  value={obj.ReferenceDetail.PublicationSource || "-"}
                />
                <br />
                <br />
              </Row>
            ) : null}
          </TabPane>

          <TabPane tab="URL" key="8">
            {_.map(obj.NonspecificParameterDetail, function(item, index) {
              if (item.ParameterIdentificationNumber === "URL") {
                return (
                  <RowItem
                    key={`${index}`}
                    text={
                      <a
                        href={item.ParameterValue}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {" "}
                        {item.ParameterValue}{" "}
                      </a>
                    }
                  />
                );
              }
            })}
          </TabPane>
        </Tabs>
      </div>
    </div>
  );
};

class EventDetailComp extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: this.props.obj.EventDetail,
      activeFilter: null
    };
  }

  componentDidMount = () => {
    this.setState({ data: this.props.obj.EventDetail });
  };

  toggleFilter = tag => {
    let list = [];

    if (tag !== this.state.activeFilter) {
      this.setState({ activeFilter: tag });
      list = _.filter(this.props.obj.EventDetail, function(i) {
        return i.krypton_category === tag;
      });
    } else {
      this.setState({ activeFilter: "" });
      list = this.props.obj.EventDetail;
    }
    this.setState({ data: list });
  };

  getEventItem = refItem => {
    return (
      <div>
        {_.size(refItem.ReferenceDetail)
          ? _.map(refItem.ReferenceDetail, function(item, index) {
              return (
                <div key={`${index}`} className="mr-bottom-lg">
                  <div>
                    {item.Headline ? (
                      <h4 className="t-16 text-medium">{item.Headline}</h4>
                    ) : null}

                    <p className="text-light">{refItem.EventText || ""}</p>

                    {item.WebPageURL ? (
                      <div className="mr-bottom">
                        <a
                          href={item.WebPageURL}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          {item.WebPageURL}
                        </a>
                      </div>
                    ) : null}
                  </div>
                  <div>
                    <Row>
                      {item.SourceName ? (
                        <Block
                          column={4}
                          label={<FormattedMessage id="fields.sourceName" />}
                          value={item.SourceName}
                        />
                      ) : null}

                      {item.SourceTypeText ? (
                        <Block
                          column={4}
                          label={<FormattedMessage id="fields.sourceType" />}
                          value={item.SourceTypeText || "-"}
                        />
                      ) : null}

                      {item.PublisherName ? (
                        <Block
                          column={4}
                          label={<FormattedMessage id="fields.publisherName" />}
                          value={item.PublisherName || "-"}
                        />
                      ) : null}

                      {item.PublicationSource ? (
                        <Block
                          column={4}
                          label={<FormattedMessage id="fields.publication" />}
                          value={item.PublicationSource || "-"}
                        />
                      ) : null}
                    </Row>
                  </div>
                </div>
              );
            })
          : null}

        <Row>
          <Block
            column={4}
            label={<FormattedMessage id="fields.eventDate" />}
            value={refItem.EventDate || "-"}
            className="mr-bottom-sm"
          />
          <Block
            column={4}
            label={<FormattedMessage id="fields.eventTypeText" />}
            value={refItem.EventTypeText || "-"}
            className="mr-bottom-sm"
          />

          <Block
            column={4}
            label={<FormattedMessage id="fields.eventTypeCode" />}
            value={getAbbr(refItem.EventTypeCode, refItem.EventSubTypeCode)}
            className="mr-bottom-sm"
          />

          {refItem.krypton_category ? (
            <Block
              column={4}
              label={<FormattedMessage id="fields.carRiskCode" />}
              value={
                <Tag className="alert-tag-item">
                  {" "}
                  {refItem.krypton_category}
                </Tag>
              }
              className="mr-bottom-sm"
            />
          ) : null}

          {refItem.krypton_status ? (
            <Block
              column={4}
              label={<FormattedMessage id="commonTextInstances.status" />}
              value={
                refItem.krypton_status ? (
                  <Tag color={event_status[refItem.krypton_status]["class"]}>
                    {event_status[refItem.krypton_status]["label"]}
                  </Tag>
                ) : (
                  "-"
                )
              }
              className="mr-bottom-sm"
            />
          ) : null}

          <Block
            column={4}
            label={<FormattedMessage id="fields.eventSubtypeText" />}
            value={refItem.EventSubTypeText || "-"}
            className="mr-bottom-sm"
          />
        </Row>
        <Divider />
      </div>
    );
  };

  render() {
    const obj = this.props.obj;
    const that = this;

    const { activeFilter, data } = this.state;

    return (
      <div>
        {_.size(obj.custom_counts) ? (
          <div className="mr-bottom-lg mr-top-lg">
            <span className="text-metal pd-right-sm">Filter by: </span>

            {_.map(obj.custom_counts, function(v, k) {
              return (
                <Tag
                  className={
                    "alert-tag-item " +
                    (activeFilter === k ? "alert-primary" : "")
                  }
                  onClick={that.toggleFilter.bind(that, k)}
                >
                  {k} ({v})
                </Tag>
              );
            })}
          </div>
        ) : null}

        <Divider />

        {_.map(data, function(refItem, index) {
          return (
            <React.Fragment key={`${index}`}>
              {that.getEventItem(refItem)}
            </React.Fragment>
          );
        })}
      </div>
    );
  }
}

const Block = props => {
  return (
    <Col
      span={props.column ? props.column : 24}
      className={"pd-right t-12 " + props.className}
    >
      <div className="dt-value  mr-bottom-sm">{props.label}:</div>
      <div className="dt-value text-light">
        {props.value ? props.value : "-"}
      </div>
    </Col>
  );
};

const getAbbr = (code, subCode) => {
  const abbrList = [
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
      value: "Perjury, Obstruction of Justice, False Filings, False Statements"
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
      value: "Copyright Infringement (Intellectual Property, Electronic Piracy"
    },
    {
      label: "ENV",
      value: "Environmental Crimes (Poaching, Illegal Logging, Animal Cruelty)"
    },
    { label: "IPR", value: "Illegal Prostitution" },
    { label: "MIS", value: "Misconduct" },
    { label: "NSC", value: "Nonspecific Crimes" }
  ];

  const tootliptext1 = _.find(abbrList, function(o) {
    return o.label === code;
  });
  const tootliptext2 = _.find(abbrList, function(o) {
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

const GetTable = props => {
  const data = props.jsonData;
  const columns = [
    {
      title: <FormattedMessage id="fields.entityName" />,
      dataIndex: "EntityName",
      key: "EntityName"
    },
    {
      title: <FormattedMessage id="fields.riskClassCvip" />,
      dataIndex: "CVIP",
      key: "CVIP"
    },
    {
      title: <FormattedMessage id="fields.riskScore" />,
      dataIndex: "RiskScore",
      key: "RiskScore"
    },
    {
      title: <FormattedMessage id="fields.type" />,
      dataIndex: "EntityTypeText",
      key: "EntityTypeText"
    },
    {
      title: <FormattedMessage id="fields.systemId" />,
      key: "AlertEntitySystemID",
      render: record => {
        return (
          <span style={{ wordBreak: "break-all" }}>
            {record.AlertEntitySystemID}
          </span>
        );
      }
    },
    {
      title: <FormattedMessage id="workflowsInstances.commentsText" />,
      key: "ubo_index",
      render: record => {
        let flag_data = _.size(props.flag_dict[record.AlertEntitySystemID])
          ? props.flag_dict[record.AlertEntitySystemID]
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
              {props.commentCount[record.AlertEntitySystemID] ? (
                <FormattedMessage
                  id="commonTextInstances.commentsText"
                  values={{
                    count: props.commentCount[record.AlertEntitySystemID]
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
    <Table
      dataSource={data}
      pagination={true}
      columns={columns}
      indentSize={-15}
      rowKey="AlertEntitySystemID"
      expandedRowRender={record => buildDetails(record)}
      expandRowByClick={true}
    />
  );
};

const GetTabsFilter = props => {
  // for error

  if (
    _.get(
      props,
      "jsonData.SearchComplianceAlertsResponse.TransactionResult.ResultID",
      null
    ) !== "PD021"
  ) {
    return (
      <div className="text-center text-red">
        {_.get(
          props,
          "jsonData.SearchComplianceAlertsResponse.TransactionResult.ResultText",
          ""
        )}
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
    return (
      <div className="text-center text-red">
        <FormattedMessage id="commonTextInstances.noResults" />
      </div>
    );
  }

  const data =
    props.jsonData.SearchComplianceAlertsResponse
      .SearchComplianceAlertsResponseDetail.AlertDetail[0]["AlertEntity"];

  const category_counts = {};
  _.map(data, function(e) {
    _.map(e["custom_counts"], function(v, k) {
      if (!category_counts[k]) {
        category_counts[k] = 0;
      }
      category_counts[k] += v;
    });
  });

  let categories = [];
  if (_.size(category_counts)) {
    categories = _.map(category_counts, function(v, k) {
      return { label: k, value: k, data: [], count: 0 };
    });
  }

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

    const sanitizedData = [];

    categories.forEach(category => {
      const data = _.uniq(category.data, alert => {
        return alert.label;
      });
      sanitizedData.push({ ...category, data: data, count: data.length });
    });

    fList = fList.concat(sanitizedData);

    _.map(data, function(i) {
      const categs = i["custom_counts"] || {};
      _.map(fList, function(f, index) {
        if (categs[f.label]) {
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
      {getFilterData(data).length > 0
        ? getFilterData(data).map(function(tab, index) {
            if (!tab.label) {
              return null;
            }

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
          })
        : null}
    </Tabs>
  );
};

export const RDC = props => {
  return <DnbRDC {...props} />;
};
