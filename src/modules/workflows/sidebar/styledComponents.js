import styled from "@emotion/styled";
import { Collapse, Layout } from "antd";
import {
  WORKFLOW_DETAILS_SIDEBAR_WIDTH,
  WORKFLOW_DETAILS_SIDEBAR_PADDING
} from "../../../js/components/WorkflowDetails/utils/constants";

const { Sider } = Layout;

export const StyledSidebar = styled(Sider)`
  /* Overriding the background color from antd-component */
  background-color: #f6f7f9;
  margin-right: 25px;

  /* Make the sidebar fixed */
  .ant-layout-sider-children {
    position: fixed;
    overflow-y: scroll;
    width: ${WORKFLOW_DETAILS_SIDEBAR_WIDTH};
    padding: 0 ${WORKFLOW_DETAILS_SIDEBAR_PADDING};
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
  padding-left: 7px;
  padding-top: 5px;
  padding-bottom: 5px;
  margin-left: -9px;
  margin-bottom: 8;
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
