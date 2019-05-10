import React from "react";
import SidebarCircle from "./SidebarCircle";

 function TaskQueueList({ item, onSelect, selected }) {
  return (
    <li
      onClick={() => onSelect(item)}
      style={{
        borderTop: "1px solid black",
        display: "flex",
        justifyContent: "space-between",
        padding: "10px 29px",
        cursor: "pointer",
        backgroundColor: item["name"] == selected && "rgb(20, 137, 210)"
      }}
    >
      <span style={{ fontSize: 16, color: "#CFDAE3" }}>{item.name}</span>
      <div style={{ display: "flex", alignItems: "center" }}>
        {item.overdue_count > 0 && (
          <SidebarCircle  value={item.overdue_count} innerColour="#D40000"  />
        )}
        <span style={{ fontSize: 12, color: "#567C9C" }}>{item.count}</span>
      </div>
    </li>
  );
}

export default TaskQueueList