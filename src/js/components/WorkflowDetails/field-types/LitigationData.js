import React from "react";
import { Row, Col, Collapse } from "antd";
import _ from "lodash";

const Panel = Collapse.Panel;
const LitigationData = props => {
  const suit_list =
    props.field.integration_json["OrderProductResponse"][
      "OrderProductResponseDetail"
    ] &&
    props.field.integration_json["OrderProductResponse"][
      "OrderProductResponseDetail"
    ]["Product"]["Organization"]["Events"] &&
    props.field.integration_json["OrderProductResponse"][
      "OrderProductResponseDetail"
    ]["Product"]["Organization"]["Events"]["LegalEvents"]["SuitInformation"]
      ? props.field.integration_json["OrderProductResponse"][
          "OrderProductResponseDetail"
        ]["Product"]["Organization"]["Events"]["LegalEvents"][
          "SuitInformation"
        ]["Suit"]
      : null;

  const customPanelStyle = {
    borderRadius: 4,
    marginBottom: 24,
    border: 0,
    overflow: "hidden"
  };

  const InfoRow = props => {
    return (
      <Col span={props.col}>
        <span className="dt-value">{props.label}</span>
        <span className="pull-right dt-value">
          {props.value ? props.value : "-"}
        </span>
      </Col>
    );
  };

  return (
    <div>
      {_.size(suit_list) ? (
        <Collapse
          defaultActiveKey={["panel-0"]}
          bordered={false}
          className="financial-statement-collapse"
        >
          {_.map(suit_list, function(b, index) {
            return (
              <Panel
                header={"Litigation Statement for " + b.FilingStatusDate.$}
                key={"panel-" + index}
                style={customPanelStyle}
              >
                <div key={b.custom_hash}>
                  <div className="table table-striped data-table">
                    <Row>
                      <InfoRow
                        label="Court Assigned Number"
                        value={b.CourtAssignedNumber}
                        col={12}
                      />
                      <InfoRow
                        label="Filing Date"
                        value={b.FilingDate["$"]}
                        col={12}
                      />
                    </Row>
                    <Row>
                      <InfoRow
                        label="Filing Status Date"
                        value={b.FilingStatusDate["$"]}
                        col={12}
                      />
                      <InfoRow
                        label="Filing Status Text"
                        value={
                          b.FilingStatusText ? b.FilingStatusText["$"] : "-"
                        }
                        col={12}
                      />
                    </Row>
                    <Row>
                      <InfoRow
                        label="Filing Amount"
                        value={b.FilingAmount ? b.FilingAmount["$"] : "-"}
                        col={12}
                      />
                      <InfoRow
                        label="Received Date"
                        value={b.ReceivedDate ? b.ReceivedDate["$"] : "-"}
                        col={12}
                      />
                    </Row>
                    <Row>
                      <InfoRow
                        label="Filing Medium Description"
                        value={b.FilingMediumDescription || "-"}
                        col={12}
                      />
                      <InfoRow
                        label="Filing Office Name"
                        value={b.FilingOfficeName || "-"}
                        col={12}
                      />
                    </Row>

                    {_.size(b.RolePlayer) ? (
                      <div className="mr-bottom-lg">
                        <br />
                        <Col span={24}>
                          <span className="dt-label">
                            Role Players ({_.size(b.RolePlayer)})
                          </span>
                        </Col>
                        <br />
                        <br />
                      </div>
                    ) : null}

                    {_.map(b.RolePlayer, function(rp, index) {
                      let addr = rp.RolePlayerLocation || "-";
                      if (addr && addr.StreetAddressLine) {
                        addr =
                          addr.StreetAddressLine[0]["LineText"] +
                          ", " +
                          addr.PrimaryTownName +
                          ", " +
                          addr.TerritoryAbbreviatedName +
                          ", " +
                          addr.PostalCode;
                      }
                      return (
                        <div key={`row_${index}`}>
                          <Row>
                            <InfoRow
                              label="Role Player Name"
                              value={rp.RolePlayerName || "-"}
                              col={12}
                            />
                            <InfoRow
                              label="RolePlayerTypeText"
                              value={
                                rp.RolePlayerTypeText
                                  ? rp.RolePlayerTypeText["$"]
                                  : "-"
                              }
                              col={12}
                            />
                          </Row>
                          <Row>
                            <InfoRow
                              label="Role Player Address"
                              value={addr}
                              col={24}
                            />
                          </Row>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </Panel>
            );
          })}
        </Collapse>
      ) : (
        <div className="text-center mr-ard-lg t-18 text-medium text-grey">
          Litigation data not available
        </div>
      )}
    </div>
  );
};

export default LitigationData;
