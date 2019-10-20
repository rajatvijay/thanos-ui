import React from "react";
import CountWidget from "./CountWidget";
import styled from "@emotion/styled";
import { Spin, Icon } from "antd";

export function TaskQueue({ item, onClick, isSelected }) {
  return (
    <StyledTaskQueueContainer
      isSelected={isSelected}
      data-testid="task-queue-list-item"
      onClick={() => onClick(item)}
    >
      <span className="name">{item.name}</span>
      <WorkflowCounts
        workflowCount={item.count}
        overdueCount={item.overdue_count}
      />
    </StyledTaskQueueContainer>
  );
}

export function DefaultTaskQueue({ item, loading, onClick, isSelected }) {
  return (
    <StyledTaskQueueContainer isSelected={isSelected} onClick={onClick}>
      <div>
        <i
          className="material-icons text-middle"
          style={{ color: "#FFF", marginRight: 10, marginBottom: 5 }}
        >
          person
        </i>
        <span className="name">{item.name}</span>
      </div>
      {loading ? (
        <Spin
          indicator={<Icon type="loading" style={{ fontSize: 20 }} spin />}
        />
      ) : (
        <WorkflowCounts
          workflowCount={item.count}
          overdueCount={item.overdue_count}
        />
      )}
    </StyledTaskQueueContainer>
  );
}

function WorkflowCounts({ workflowCount, overdueCount }) {
  return (
    <StyledCountContainer>
      {overdueCount > 0 ? (
        <CountWidget value={overdueCount} innerColour="#D40000" />
      ) : null}
      <span className="workflow-count">{workflowCount}</span>
    </StyledCountContainer>
  );
}

const StyledTaskQueueContainer = styled.li`
  border-top: 1px solid rgba(0, 0, 0, 0.3);
  display: flex;
  justify-content: space-between;
  padding: 10px 20px;
  cursor: pointer;
  background-color: ${({ isSelected }) =>
    isSelected ? "rgb(20, 137, 210)" : "none"};

  .name {
    font-size: 16px;
    color: #cfdae3;
  }
`;

const StyledCountContainer = styled.div`
  display: flex;
  align-items: center;

  .workflow-count {
    font-size: 14px;
    color: rgba(255, 255, 255, 0.3);
    margin-left: 8px;
  }
`;