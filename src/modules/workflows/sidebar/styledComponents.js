import styled from "@emotion/styled";
import { Collapse, Layout } from "antd";

const { Sider } = Layout;

export const StyledSidebar = styled(Sider)`
  /* Overriding the background color from antd-component */
  background-color: #f6f7f9;
  margin-right: 25px;

  /* Make the sidebar fixed */
  .ant-layout-sider-children {
    position: fixed;
    overflow-y: scroll;
    width: 350px;
    padding: 0 40px;
    max-height: ${props => (props.minimalui ? "400px" : "100vh")};
    padding-bottom: 100px;
  }

  /* Overriding the background color from antd-component */
  .ant-collapse,
  .ant-collapse-content {
    background-color: transparent;
  }
`;

export const StyledSidebarHeader = styled.div`
  padding: 25px 20px;
  cursor: pointer;
  /* background-color: #fafafa; */
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
  border-top: none;
  border-right: none;
  border-radius: 0;
  margin-bottom: 30;
`;

export const StyledCollapseItem = styled.span`
  text-decoration: none;
  cursor: pointer;
  border-radius: 50px;
  padding: ${props => (props.orphan ? "5px 12px 5px 5px" : "5px 0 5px 7px")};
  margin-left: -9px;
  margin-bottom: 8;
  margin-top: ${props => (props.orphan ? "7px" : "0")};
  display: flex;
  align-items: center;
  font-size: 14;
  background-color: ${props => (props.selected ? "#104774" : "transparent")};
  color: ${props => (props.selected ? "white" : "black")};
`;

export const StyledBreadCrumbItem = styled.span`
  color: gray;
  font-size: 12px;
  margin-right: 6px;
`;
