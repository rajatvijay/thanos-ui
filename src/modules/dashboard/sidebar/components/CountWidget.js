import React from "react";
import styled from "@emotion/styled";

const CountWidget = ({ value, innerColour }) => {
  return (
    <StyledCountWidget background={innerColour}>{value}</StyledCountWidget>
  );
};

export default CountWidget;

const StyledCountWidget = styled.span`
  border-radius: 20px;
  background-color: ${({ background }) => background || "red"};
  color: white;
  margin: 0;
  padding: 0 7px;
  font-size: 14px;
  width: auto;
  height: 20px;
  line-height: 20px;
  text-align: center;
  display: inline-block;
`;
