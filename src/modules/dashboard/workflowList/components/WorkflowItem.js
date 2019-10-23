import React, { Component } from "react";
import { css } from "emotion";
import styled from "@emotion/styled";
import { Link } from "react-router-dom";
import { Popover, Tooltip } from "antd";
import { LCDataValue } from "../../../common/components/LCDataValue";

/**
 * TODO: P0
 * [] Alerts from lc data? exmaple?
 * [] Tooltip for alerts
 * [] Link for alerts
 * [] Modularize this file => move components out of this file
 * [] Refactor some of the components
 * [] Display Risk ranking
 * [x] Grouping of workflows
 * [] Show modal on click
 * [] Positioning of quick multiple views
 */

const WorkflowItem = ({ onClick, workflow, showSortingValue }) => {
  const normalLCData = workflow.lc_data
    .filter(data => data.display_type === "normal" && !!data.value)
    .slice(0, 2);
  const status = workflow.status.label || workflow.status.kind_display;
  const showAlerts = !!workflow.alerts.length;
  const showAlertsColumn = showAlerts || normalLCData[0];
  const showLCDataColumn = showAlerts ? normalLCData[0] : normalLCData[1];
  return (
    <div
      onClick={e => onClick(workflow.id)}
      className={css`
        display: flex;
        padding: 0 20px;
        border-bottom: 1px solid #9797;
        cursor: pointer;
        align-items: center;
        min-height: 60px;
      `}
    >
      <div
        className={css`
          width: 20%;
        `}
      >
        <WorkflowTitle
          name={workflow.name}
          family={workflow.family}
          showBreadcrums={true}
        />
      </div>

      <div
        className={css`
          width: 40%;
        `}
      >
        {showAlertsColumn ? (
          showAlerts ? (
            <WorkflowAlerts alerts={workflow.alerts} />
          ) : (
            <WorkflowLCData data={normalLCData[0]} />
          )
        ) : null}
      </div>

      <div
        className={css`
          width: 20%;
        `}
      >
        {showLCDataColumn ? (
          showAlerts ? (
            <WorkflowLCData data={normalLCData[0]} />
          ) : (
            <WorkflowLCData data={normalLCData[1]} />
          )
        ) : null}
      </div>

      <div
        className={css`
          width: 10%;
          text-align: right;
        `}
      >
        {showSortingValue && (
          <StyledSortingValue>{workflow.rank}</StyledSortingValue>
        )}
      </div>

      <div
        className={css`
          width: 20%;
          text-align: right;
        `}
      >
        <WorkflowStatus status={status} />
      </div>
    </div>
  );
};

export default WorkflowItem;

const WorkflowTitle = ({ name, family, showBreadcrums }) => {
  if (!showBreadcrums || family.length === 1) {
    return <StyledWorkflowName title={name}>{name}</StyledWorkflowName>;
  }

  if (family.length === 2) {
    return (
      <StyledWorkflowName title={family[0].name}>
        <StyledWorkflowLink to={"/workflows/instances/" + family[0].id}>
          {family[0].name}
        </StyledWorkflowLink>{" "}
        / {family[1].name}
      </StyledWorkflowName>
    );
  }

  return (
    <Popover content={<WorkflowBreadcrums family={family} />}>
      <StyledWorkflowName>
        <StyledWorkflowLink to={"/workflows/instances/" + family[0].id}>
          {family[0].name}
        </StyledWorkflowLink>
        <span style={{ color: "#b5b5b5" }}> /... / </span>
        {name}
      </StyledWorkflowName>
    </Popover>
  );
};

const WorkflowBreadcrums = ({ family }) => {
  return family.map((member, index) => (
    <React.Fragment key={member.id}>
      <Link style={{ color: "black" }} to={"/workflows/instances/" + member.id}>
        {" "}
        {member.name}
      </Link>
      <span> /</span>
    </React.Fragment>
  ));
};

// TODO: Optimize it later
// Can be create a HOC for show more and show less functionality, with mnarkup as render prop
class WorkflowAlerts extends Component {
  state = {
    showingMore: false
  };
  toggleShowingMore = () => {
    this.setState(({ showingMore }) => ({ showingMore: !showingMore }));
  };
  renderAlerts = () => {
    const { alerts } = this.props;
    const { showingMore } = this.state;
    if (!showingMore) {
      return alerts
        .slice(0, 2) // Showing only the first two alerts
        .map(alert => <WorkflowAlertItem alert={alert} />);
    }

    // Showing all alerts
    return alerts.map(alert => <WorkflowAlertItem alert={alert} />);
  };
  renderShowIcon = () => {
    const { showingMore } = this.state;
    const { alerts } = this.props;
    return (
      <span
        className={css`
          background-color: #ddd;
          color: black;
          font-size: 13px;
          border-radius: 10px;
          padding: 2px 8px;
          white-space: nowrap;
        `}
        onClick={this.toggleShowingMore}
      >
        {showingMore ? "-" : "+"}
        {alerts.length - 2} {/** Showing only the count of extra alert */}
      </span>
    );
  };
  render() {
    const { alerts } = this.props;
    return (
      <div
        className={css`
          display: flex;
          flex-wrap: wrap;
          align-items: center;
        `}
      >
        {this.renderAlerts()}
        {alerts.length > 2 && this.renderShowIcon()}
      </div>
    );
  }
}

const WorkflowAlertItem = ({ alert }) => (
  <StyledAlertName color={alert.alert.category.color_label}>
    {alert.alert.tag}
  </StyledAlertName>
);

const WorkflowLCData = ({ data }) => (
  <Tooltip
    title={
      <span>
        {!!data.value && `${data.label}: `}
        <LCDataValue
          label={data.label}
          value={data.value}
          format={data.format}
        />
      </span>
    }
  >
    <StyledLCData>
      {data.showLabel && `${data.label}: `}
      <LCDataValue label={data.label} value={data.value} format={data.format} />
    </StyledLCData>
  </Tooltip>
);

const WorkflowStatus = ({ status }) => (
  <Tooltip title={status}>
    <StyledStatus>
      <span>{status}</span>
    </StyledStatus>
  </Tooltip>
);

const StyledStatus = styled.span`
  font-size: 12px;
`;

const StyledLCData = styled.span`
  opacity: 0.5;
  font-size: 14px;
`;

const StyledSortingValue = styled.span`
  background: #00000048;
  padding: 2px 6px;
  border-radius: 15%;
  color: white;
  font-size: 14px;
  border-radius: 2px;
  line-height: 21px;
`;

const StyledAlertName = styled.span`
  word-break: break-word;
  white-space: nowrap;
  color: white;
  font-size: 12px;
  padding: 2px 10px;
  border-radius: 10px;
  text-transform: uppercase;
  margin-right: 5px;
  margin-top: 2px;
  margin-bottom: 2px;
  background-color: ${props => props.color};
`;

const StyledWorkflowName = styled.span`
  font-size: 20px;
  color: black;
`;

const StyledWorkflowLink = styled(Link)`
  color: #b5b5b5;
  &:hover {
    color: black;
  }
`;
