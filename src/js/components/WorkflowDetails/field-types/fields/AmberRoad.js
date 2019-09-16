import React, { Component } from "react";
import { Divider, Row, Col } from "antd";
import { FormattedMessage } from "react-intl";
import IntegrationLoadingWrapper from "../../utils/IntegrationLoadingWrapper";

export class AmberRoad extends Component {
  render() {
    const { field, currentStepFields } = this.props;
    const fieldJson = field.integration_json;

    const finalHTML = (
      <IntegrationLoadingWrapper
        currentStepFields={currentStepFields}
        field={field}
        step={field.step}
        check={
          fieldJson.PartnerRecord.Entities.Entity &&
          fieldJson.PartnerRecord.Entities.Entity.length > 0
        }
      >
        <div className="mr-top-lg mr-bottom-lg">
          <InfoTable entities={fieldJson.PartnerRecord.Entities.Entity} />
        </div>
      </IntegrationLoadingWrapper>
    );

    return finalHTML;
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
