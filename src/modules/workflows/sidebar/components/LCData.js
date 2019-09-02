import React from "react";
import { Row, Col } from "antd";
import { FormattedLCData } from "../../../common/components/FormattedLCData";
import styled from "@emotion/styled";
import { css } from "emotion";
import { FormattedMessage, injectIntl } from "react-intl";

function LCData({ lcData, status, dispatch, ...restProps }) {
  return (
    <Row {...restProps}>
      {status && (
        <LCDataItem
          data={{
            label: <FormattedMessage id="commonTextInstances.status" />,
            value: status
          }}
        />
      )}
      {lcData.map(data => (
        <LCDataItem data={data} key={data.label} />
      ))}
    </Row>
  );
}

export default injectIntl(LCData);

// ========================================================================================== //
// ========================================================================================== //
// ========================================================================================== //
// ========================================================================================== //

const StyledLCDataLabel = styled.span`
  opacity: 0.3;
  color: #000;
  font-size: 12px;
  font-weight: bold;
  letter-spacing: -0.02px;
  line-height: 12px;
`;

const LCDataItem = ({ data }) => (
  <Col span={12}>
    <StyledLCDataLabel>{data.label}</StyledLCDataLabel>
    <br />
    <FormattedLCData
      {...data}
      className={css`
        color: #000000;
        font-size: 12px;
        letter-spacing: -0.02px;
        line-height: 29px;
        word-wrap: break-word;
      `}
    />
  </Col>
);
