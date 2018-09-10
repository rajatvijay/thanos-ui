import React from "react";
import { Row, Col, Divider, Collapse } from "antd";
import _ from "lodash";
import NumberFormat from "../../../_helpers/NumberFormat";

const Panel = Collapse.Panel;
const FinancialData = props => {
  var fs_list =
    props.field.integration_json["OrderProductResponse"][
      "OrderProductResponseDetail"
    ]["Product"]["Organization"]["Financial"]["FinancialStatement"];

  const customPanelStyle = {
    borderRadius: 4,
    marginBottom: 24,
    border: 0,
    overflow: "hidden"
  };

  const Column = props => {
    return (
      <Col span={props.column ? props.column : 24}>
        <span className="dt-value">{props.label}</span>
        <span className="pull-right dt-value">
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

  const FinSection = props => {
    let cols = [];
    const list = props.list;
    let length = list.length;

    _.map(list, function(item, index) {
      var col = (
        <Column
          label={item.ItemDescriptionText ? item.ItemDescriptionText["$"] : "-"}
          value={
            item.ItemAmount ? (
              <NumberFormat value={item.ItemAmount["$"]} format={"0,0"} />
            ) : (
              "-"
            )
          }
          column={12}
        />
      );
      cols.push(col);
    });

    return (
      <div className="statement-section">
        <RowHead label={props.header} className="mr-top-lg mr-bottom-lg" />
        <Columnizer cols={cols} />
      </div>
    );
  };

  return (
    <div>
      <Collapse
        defaultActiveKey={["panel-0"]}
        bordered={false}
        className="financial-statement-collapse"
      >
        {_.map(fs_list, function(b, index) {
          var shd = b.StatementHeaderDetails || {};
          var bs = b.BalanceSheet || {};
          var bs_assets = _.size(bs) ? bs.Assets || {} : {};
          var lb = _.size(bs) ? bs.Liabilities : {};
          var pnl = b.ProfitAndLossStatement || {};
          var fr = b.FinancialRatios || {};
          return (
            <Panel
              header={
                "Financial Statement for " +
                (shd.FinancialStatementToDate
                  ? shd.FinancialStatementToDate["$"]
                  : "-")
              }
              key={"panel-" + index}
              style={customPanelStyle}
            >
              <div key={b.custom_hash}>
                <div className="table table-striped data-table">
                  <RowHead label="Statement Details" />

                  <Row gutter={24}>
                    <Column
                      label={"Financial Statement To Date"}
                      value={shd.FinancialStatementToDate["$"]}
                      column={12}
                    />
                    <Column
                      label={"Unit Of Size Text"}
                      value={shd.UnitOfSizeText ? shd.UnitOfSizeText["$"] : "-"}
                      column={12}
                    />
                  </Row>

                  <Row gutter={24}>
                    <Column
                      label={"Currency Code"}
                      value={shd.CurrencyISOAlpha3Code || "-"}
                      column={12}
                    />
                    <Column
                      label={"Financial Period Duration"}
                      value={shd.FinancialPeriodDuration || "-"}
                      column={12}
                    />
                  </Row>

                  <div>
                    {_.size(bs_assets) ? (
                      <RowHead
                        label="Balance Sheet Assets"
                        className="mr-top-lg mr-bottom-lg"
                      />
                    ) : null}

                    {_.size(bs_assets) ? (
                      <Row gutter={24}>
                        <Column
                          label={"Total Current Assets Amount"}
                          value={
                            bs_assets.TotalCurrentAssetsAmount ? (
                              <NumberFormat
                                value={bs_assets.TotalCurrentAssetsAmount["$"]}
                              />
                            ) : (
                              "-"
                            )
                          }
                          column={24}
                        />
                      </Row>
                    ) : null}
                  </div>

                  {_.size(bs_assets) &&
                  _.size(
                    bs_assets.LongTermAssets &&
                      bs_assets.LongTermAssets.StatementItem
                  ) ? (
                    <FinSection
                      list={bs_assets.LongTermAssets.StatementItem}
                      header="Long Term Assets Statements"
                    />
                  ) : null}

                  <Row gutter={24}>
                    <Column
                      label={"Total Assets Amount"}
                      value={
                        bs.TotalAssetsAmount ? (
                          <NumberFormat value={bs.TotalAssetsAmount["$"]} />
                        ) : (
                          "-"
                        )
                      }
                      column={12}
                    />

                    <Column
                      label={"Total Current Liabilities Amount"}
                      value={
                        lb.TotalCurrentLiabilitiesAmount ? (
                          <NumberFormat
                            value={lb.TotalCurrentLiabilitiesAmount["$"]}
                          />
                        ) : (
                          "-"
                        )
                      }
                      column={12}
                    />
                  </Row>

                  <Row gutter={24}>
                    <Column
                      label={"Total Equity Amount"}
                      value={
                        lb.TotalEquityAmount ? (
                          <NumberFormat value={lb.TotalEquityAmount["$"]} />
                        ) : (
                          "-"
                        )
                      }
                      column={24}
                    />
                  </Row>

                  {_.size(lb.Equity && lb.Equity.StatementItem) ? (
                    <FinSection
                      list={lb.Equity.StatementItem}
                      header="Equity"
                    />
                  ) : null}

                  {_.size(pnl.StatementItem) ? (
                    <FinSection
                      list={pnl.StatementItem}
                      header="Profit And Loss Statement"
                    />
                  ) : null}

                  {_.size(fr) && _.size(fr.FinancialRatioCategory) ? (
                    <RowHead
                      label="Financial Ratios"
                      className="mr-top-lg mr-bottom-lg"
                    />
                  ) : null}

                  {_.size(fr) && _.size(fr.FinancialRatioCategory)
                    ? _.map(fr.FinancialRatioCategory, function(frc) {
                        var fri = frc.FinancialRatioItem || [];
                        if (!_.size(fri)) {
                          return <span />;
                        }
                        fri = fri[0];
                        return (
                          <Row gutter={24}>
                            <Column
                              label={
                                fri.ItemDescriptionText
                                  ? fri.ItemDescriptionText["$"]
                                  : "-"
                              }
                              value={fri.ItemAmount ? fri.ItemAmount["$"] : "-"}
                              column={12}
                            />
                          </Row>
                        );
                      })
                    : null}

                  <br />
                  <Divider>END</Divider>
                  <br />
                </div>
              </div>
            </Panel>
          );
        })}
      </Collapse>
    </div>
  );
};

export default FinancialData;
