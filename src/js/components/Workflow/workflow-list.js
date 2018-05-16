import React, { Component } from "react";
import { Layout, Collapse, Pagination } from "antd";
import Moment from "react-moment";
import { Link } from "react-router-dom";
import Config from "../../utils/config";
import WorkflowItem, { WorkflowHeader, WorkflowBody } from "./workflow-item";
import { workflowActions } from "../../actions";
import _ from "lodash";
import { calculatedDate } from "./calculated-data";

const { Content } = Layout;
const { getProcessedData, getProgressData } = calculatedDate;

const Panel = Collapse.Panel;

class WorkflowList extends Component {
  handlePageChange = (page, rage) => {
    let param = [{ label: "page", value: page }];
    this.props.dispatch(workflowActions.getAll(param));
  };

  render() {
    const data = this.props.workflow;
    let that = this;
    let page = 1;
    if (data.next) {
      page = data.next.split("?page=");
      page = parseInt(page[1]) - 1;
    } else if (data.previous) {
      page = data.previous.split("?page=");
      page = parseInt(page[1]) + 1;
    }

    return (
      <div>
        <Content
          style={{
            margin: "24px 16px 0",
            overflow: "initial",
            background: "#fff"
          }}
        >
          {data.workflow && data.workflow.length > 0 ? (
            <div>
              <Collapse accordion className="workflow-list ">
                {_.map(data.workflow, function(item, index) {
                  let proccessedData = getProcessedData(item.step_groups);

                  return (
                    <Panel
                      showArrow={false}
                      header={<WorkflowHeader workflow={item} />}
                      key={index}
                      className="lc-card"
                    >
                      <WorkflowBody workflow={item} pData={proccessedData} />
                    </Panel>
                  );
                })}
              </Collapse>

              <div className="mr-top-lg text-center pd-bottom-lg">
                <Pagination
                  defaultCurrent={page ? page : 1}
                  total={data.count}
                  onChange={this.handlePageChange.bind(this)}
                />
              </div>
            </div>
          ) : (
            <div className="text-center text-medium text-metal">
              {" "}
              No workflows to show. Try clearing the filters.
            </div>
          )}
        </Content>
      </div>
    );
  }
}

export default WorkflowList;
