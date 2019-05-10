import React from "react";

export default function List({ item, onSelect, selected }) {
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
          <span
            style={{
              borderRadius: "50%",
              backgroundColor: "#D40000",
              color: "white",
              margin: "0px 5px",
              fontSize: 10,
              width: 25,
              height: 25,
              lineHeight: "25px",
              textAlign: "center",
              display: "inline-block"
            }}
          >
            {item.overdue_count}
          </span>
        )}
        <span style={{ fontSize: 12, color: "#567C9C" }}>{item.count}</span>
      </div>
    </li>
  );
}
