import React from "react";
import SidebarCircle from "./SidebarCircle";

function TaskQueueList({ item, onSelect, selected }) {
  return (
    <li
      onClick={() => onSelect(item)}
      style={{
        borderTop: "1px solid rgba(0, 0, 0, 0.3)",
        display: "flex",
        justifyContent: "space-between",
        padding: "10px 20px",
        cursor: "pointer",
        backgroundColor: item["name"] === selected && "rgb(20, 137, 210)"
      }}
    >
      <span style={{ fontSize: 16, color: "#CFDAE3" }}>{item.name}</span>
      <div style={{ display: "flex", alignItems: "center" }}>
        {item.overdue_count > 0 && (
          <SidebarCircle value={item.overdue_count} innerColour="#D40000" />
        )}
        <span
          style={{
            fontSize: 14,
            color: "rgba(255, 255, 255, 0.3)",
            marginLeft: "8px"
          }}
        >
          {item.count}
        </span>
      </div>
    </li>
  );
}

export default TaskQueueList;
