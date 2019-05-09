import React, { Component } from "react";

import {
  Layout,
  Menu,
  Icon,
  Divider,
  Badge,
  Tag,
  Tooltip,
  Typography,
  Collapse
} from "antd";
import _ from "lodash";

import { connect } from "react-redux";
import Collapsible from "react-collapsible";
const { Header, Content, Footer, Sider } = Layout;

const { Title, Text } = Typography;
const Panel = Collapse.Panel;

const genExtra = value => value;

class Sidebar extends Component {
  state = {
    collapse: true
  };

  render() {
    const { collapse } = this.state;
    return (
      <Sider
        width={400}
        style={{
          position: "fixed",
          overflow: "scroll",
          height: "100vh",
          left: 0,
          backgroundColor: "#FAFAFA",
          padding: "56px",
          paddingTop: 0
        }}
      >
        <div
          style={{
            width: 300,
            paddingBottom: 100,
            height: "100%",
            backgroundColor: "#FAFAFA"
          }}
        >
          <div
            style={{
              color: "#000",
              padding: "25px 20px",
              cursor: "pointer",
              backgroundColor: "#fafafa",
              justifyContent: "space-between",
              display: "flex",
              fontSize: 24,
              paddingBottom: 0,
              paddingLeft: 0,
              paddingRight: 0,
              letterSpacing: "-0.05px",
              lineHeight: "29px"
            }}
          >
            Guiseppestad
            <Icon type="more" />
          </div>
          <Divider />
          <div style={{ marginBottom: 25 }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between"
              }}
            >
              <div>
                <p
                  style={{
                    opacity: 0.3,
                    color: "#000000",
                    fontSize: "12px",
                    fontWeight: "bold",
                    letterSpacing: "-0.02px",
                    lineHeight: "15px"
                  }}
                >
                  PHONE
                </p>
                <p
                  style={{
                    color: "#000000",
                    fontSize: "12px",
                    letterSpacing: "-0.02px",
                    lineHeight: "29px"
                  }}
                >
                  +44 824525246
                </p>
              </div>
              <div>
                <p
                  style={{
                    opacity: 0.3,
                    color: "#000000",
                    fontSize: "12px",
                    fontWeight: "bold",
                    letterSpacing: "-0.02px",
                    lineHeight: "15px"
                  }}
                >
                  COUNTRY
                </p>
                <p
                  style={{
                    color: "#000000",
                    fontSize: "12px",
                    letterSpacing: "-0.02px",
                    lineHeight: "29px"
                  }}
                >
                  United Kingdom
                </p>
              </div>
            </div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between"
              }}
            >
              <div>
                <p
                  style={{
                    opacity: 0.3,
                    color: "#000000",
                    fontSize: "12px",
                    fontWeight: "bold",
                    letterSpacing: "-0.02px",
                    lineHeight: "15px"
                  }}
                >
                  CREATED BY
                </p>
                <p
                  style={{
                    color: "#000000",
                    fontSize: "12px",
                    letterSpacing: "-0.02px",
                    lineHeight: "29px"
                  }}
                >
                  David
                </p>
              </div>
              <div>
                <p
                  style={{
                    opacity: 0.3,
                    color: "#000000",
                    fontSize: "12px",
                    fontWeight: "bold",
                    letterSpacing: "-0.02px",
                    lineHeight: "15px"
                  }}
                >
                  CREATED ON
                </p>
                <p
                  style={{
                    color: "#000000",
                    fontSize: "12px",
                    letterSpacing: "-0.02px",
                    lineHeight: "29px"
                  }}
                >
                  Jan 3rd 2019
                </p>
              </div>
            </div>
          </div>
          <Collapse
            defaultActiveKey={["1"]}
            style={{
              borderLeft: "none",
              borderRight: "none",
              borderRadius: 0
            }}
            expandIcon={({ isActive }) => (
              <Icon
                type="check-circle"
                style={{ fontSize: "16px", color: "#00C89B" }}
              />
            )}
          >
            <Panel header="Overview" key="1" extra={genExtra("2/2")}>
              {/* <p>{text}</p> */}hi
            </Panel>
            <Panel header="Add/Edit" key="2" extra={genExtra("6/6")}>
              {/* <p>{text}</p> */}hi
            </Panel>
            <Panel
              header="Additional Information"
              key="3"
              extra={genExtra("4/6")}
            >
              <p>
                {" "}
                <Icon
                  type="check-circle"
                  style={{
                    fontSize: "12px",
                    color: "#00C89B",
                    marginRight: "12px"
                  }}
                />{" "}
                Additional Contacts
              </p>
            </Panel>
            <Panel header="Review TPI" key="4" extra={genExtra("0/4")}>
              {/* <p>{text}</p> */}hi
            </Panel>
            <Panel header="CAR Operatiobns" key="5" extra={genExtra("0/4")}>
              {/* <p>{text}</p> */}hi
            </Panel>
          </Collapse>
        </div>
      </Sider>
    );
  }
}

function mapStateToProps(state) {
  const {
    workflowKind,
    workflowFilterType,
    workflowFilters,
    config,
    languageSelector,
    showFilterMenu
  } = state;
  return {
    workflowKind,
    workflowFilterType,
    workflowFilters,
    config,
    languageSelector,
    showFilterMenu
  };
}

export default connect(mapStateToProps)(Sidebar);
