import styled from "@emotion/styled";
import { Collapse, Layout } from "antd";

const { Sider } = Layout;

export const StyledSidebar = styled(Sider)`
  overflow: scroll;
  left: 0;
  background-color: #fafafa;
  padding: 30px;
  padding-top: 0;
  padding-left: ${({ minimalui }) => (minimalui ? "30px" : "55px")};
  z-index: 0;
  margin-right: ${({ minimalui }) => (minimalui ? 0 : 35)};
  padding-right: 0;
  position: relative;
  margin-top: ${({ minimalui }) => (minimalui ? 0 : 35)};
`;

export const StyledSidebarHeader = styled.div`
  padding: 25px 20px;
  cursor: pointer;
  background-color: #fafafa;
  justify-content: space-between;
  display: flex;
  padding-bottom: 0;
  padding-left: 0;
  padding-right: 0;
  letter-spacing: -0.05px;
  line-height: 29px;
  align-items: center;
`;

export const StyledWorkflowName = styled.span`
  max-width: 100%;
  color: black;
  font-size: 24px;
  text-overflow: ellipsis;
  overflow: hidden;
  display: inline-block;
`;

export const StyledCollapse = styled(Collapse)`
  border-left: none;
  border-right: none;
  border-radius: 0;
  margin-bottom: 30;
`;

export const StyledCollapseItem = styled.span`
  text-decoration: none;
  cursor: pointer;
  border-radius: 50px;
  padding-left: 7px;
  padding-top: 5px;
  padding-bottom: 5px;
  margin-left: -9px;
  margin-bottom: 8;
  display: flex;
  align-items: center;
  font-size: 14;
  background-color: ${props => (props.selected ? "#104774" : "#FAFAFA")};
  color: ${props => (props.selected ? "white" : "black")};
`;

export const StyledBreadCrumbItem = styled.span`
  color: gray;
  font-size: 12px;
  margin-right: 6px;
`;
