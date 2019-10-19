import { css } from "emotion";
import styled from "@emotion/styled";

export const FilterDropdownClass = css`
  flex: 1;
  flex-basis: 33%;
  margin-right: 40px;
  &:last-child {
    margin-right: 0;
  }
`;

export const FilterRow = styled.div`
  display: flex;
  justify-content: space-between;
`;
