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
  render() {
    const { workflowDetailsHeader, workflowDetails } = this.props;
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
            {Object.values(workflowDetailsHeader).length &&
            workflowDetailsHeader.workflowDetailsHeader
              ? workflowDetailsHeader.workflowDetailsHeader.name
              : ""}
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
            expandIcon={({ isActive }) => null}
          >
            {Object.values(workflowDetails).length &&
            workflowDetails.workflowDetails
              ? workflowDetails.workflowDetails.stepGroups.results.map(
                  (stepgroup, index) => (
                    <Panel
                      header={
                        <span style={{ display: "flex", alignItems: "center" }}>
                          <i className="material-icons t-22 pd-right-sm">
                            {stepgroup.completed
                              ? "check_circle"
                              : "panorama_fish_eye"}
                          </i>{" "}
                          {stepgroup.definition.name}
                        </span>
                      }
                      key={index + 1}
                      extra={genExtra("2/2")}
                    >
                      {stepgroup.steps.map(step => (
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
                          {step.name}
                        </p>
                      ))}
                    </Panel>
                  )
                )
              : null}
          </Collapse>
        </div>
      </Sider>
    );
  }
}

function mapStateToProps(state) {
  const { workflowDetailsHeader, workflowDetails } = state;
  return {
    workflowDetailsHeader,
    workflowDetails
  };
}

export default connect(mapStateToProps)(Sidebar);
