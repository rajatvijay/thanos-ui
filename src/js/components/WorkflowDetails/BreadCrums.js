import React from "react";

class BreadCrums extends React.Component {
  render() {
    const { items } = this.props;

    if (!items || !items.length) {
      return null;
    }

    return (
      <div
        style={{
          fontSize: 12,
          marginTop: -15,
          borderTop: "1px solid #eee",
          borderBottom: "1px solid #eee",
          marginBottom: "10px",
          marginLeft: -15,
          marginRight: -15,
          padding: "2px 80px",
          color: "#305ebe"
        }}
      >
        {items.map(item => <span>{`${item.name} > `}</span>)}
      </div>
    );
  }
}

export default BreadCrums;
