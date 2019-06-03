import React from "react";
import CountWidget from "./CountWidget";
import styled from "@emotion/styled";

function TaskQueue({ item, onSelect, selected }) {
  return (
    <StyledListItem
      selected={selected}
      data-testid="task-queue-list-item"
      onClick={() => onSelect(item)}
    >
      <span className="name">{item.name}</span>
      <WorkflowCounts
        workflowCount={item.count}
        overdueCount={item.overdue_count}
      />
    </StyledListItem>
  );
}

export default TaskQueue;

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

const StyledListItem = styled.li`
  border-top: 1px solid rgba(0, 0, 0, 0.3);
  display: flex;
  justify-content: space-between;
  padding: 10px 20px;
  cursor: pointer;
  background-color: ${({ selected }) =>
    selected ? "rgb(20, 137, 210)" : "none"};

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
