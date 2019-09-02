import React, { Component } from "react";
import { Divider, Row, Col } from "antd";
import { FormattedMessage } from "react-intl";

export class AmberRoad extends Component {
  render() {
    const fieldJson = this.props.field.integration_json;

    let final_html = null;

    if (
      !fieldJson.PartnerRecord.Entities.Entity ||
      fieldJson.PartnerRecord.Entities.Entity.length === 0
    ) {
      final_html = (
        <div className="text-center text-medium pd-ard-sm text-light">
          {" "}
          <FormattedMessage id="messages.noResult" />
        </div>
      );
    } else {
      const entities = fieldJson.PartnerRecord.Entities.Entity;

      final_html = <InfoTable entities={entities} />;
    }

    return final_html;
  }
}

const PhraseRow = props => {
  const { Phrase } = props;

  return (
    <div>
      <Row>
        <InfoRow
          label={<FormattedMessage id="amberRoadInstances.name" />}
          value={Phrase.Name.$}
          col={12}
        />
        <InfoRow
          label={<FormattedMessage id="amberRoadInstances.decision" />}
          value={Phrase.Decision.$}
          col={12}
        />
      </Row>

      <Row>
        <InfoRow
          label={<FormattedMessage id="amberRoadInstances.phraseId" />}
          value={Phrase.PhraseId.$}
          col={12}
        />
        <InfoRow
          label={<FormattedMessage id="amberRoadInstances.matchScore" />}
          value={Phrase.MatchScore.$}
          col={12}
        />
      </Row>

      <Row>
        <InfoRow
          label={<FormattedMessage id="amberRoadInstances.phraseType" />}
          value={Phrase.PhraseType.$}
          col={12}
        />
      </Row>
      <br />
    </div>
  );
};

const InfoTable = props => {
  const { entities } = props;

  return (
    <div className="data-table table-striped amber-road-table">
      {entities.map((entity, index) => {
        return (
          <div className="entity mr-bottom-lg">
            <div className="t-16 t-bold ">
              <FormattedMessage id="amberRoadInstances.matchScore" />:{" "}
              {entity.MatchScore.$} (
              <FormattedMessage id="amberRoadInstances.entityId" />:{" "}
              {entity.EntityId.$})
            </div>
            <br />
            {Array.isArray(entity.Phrases) ? (
              entity.Phrases.map(phrase => {
                return <PhraseRow Phrase={phrase.Phrase} />;
              })
            ) : (
              <PhraseRow Phrase={entity.Phrases.Phrase} />
            )}

            <Row>
              <InfoRow
                label={<FormattedMessage id="amberRoadInstances.rplType" />}
                value={entity.RplType.$}
                col={12}
              />

              <InfoRow
                label={<FormattedMessage id="amberRoadInstances.countryCode" />}
                value={entity.RplCtryCode.$}
                col={12}
              />
            </Row>

            <Divider />
            <br />
          </div>
        );
      })}
    </div>
  );
};

const InfoRow = props => {
  return (
    <Col span={props.col}>
      <span className="dt-value text-medium">{props.label}:</span>
      <span className="float-right dt-value">
        {props.value ? props.value : "-"}
      </span>
    </Col>
  );
};
