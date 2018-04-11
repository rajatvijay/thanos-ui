import React, { Component } from "react";
import { Layout, Collapse } from "antd";
import Moment from "react-moment";
import { Link } from "react-router-dom";
import Config from "../../utils/config";
import WorkflowItem, { WorkflowHeader, WorkflowBody } from "./workflow-item";
import _ from "lodash";

const { Content } = Layout;

const Panel = Collapse.Panel;

class WorkflowList extends Component {
  render() {
    const data2 = this.props.workflow.workflow;

    return (
      <div>
        <Content
          style={{
            margin: "24px 16px 0",
            overflow: "initial",
            background: "#fff"
          }}
        >
          <Collapse accordion>
            {_.map(data2, function(item, index) {
              return (
                <Panel
                  showArrow={false}
                  header={<WorkflowHeader workflow={item} />}
                  key={index}
                  style={{ background: "#fff" }}
                  className="lc-card"
                >
                  <WorkflowBody workflow={item} />
                </Panel>
              );
            })}
          </Collapse>
        </Content>
      </div>
    );
  }
}

export default WorkflowList;
