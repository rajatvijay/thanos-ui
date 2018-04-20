import React, { Component } from "react";
import { Layout, Collapse, Pagination } from "antd";
import Moment from "react-moment";
import { Link } from "react-router-dom";
import Config from "../../utils/config";
import WorkflowItem, { WorkflowHeader, WorkflowBody } from "./workflow-item";
import { workflowActions } from "../../actions";
import _ from "lodash";

const { Content } = Layout;

const Panel = Collapse.Panel;

class WorkflowList extends Component {
  componentWillReceiveProps = nextProps => {
    console.log(nextProps);
  };

  componentDidMount = () => {
    console.log(this.props);
  };

  handlePageChange = (page, rage) => {
    let param = [{ label: "page", value: page }];
    console.log("padingations sdfnksdnflasndfansd");
    console.log(this.props);
    //console.log(this.props.dispatch)

    this.props.dispatch(workflowActions.getAll(param));
  };

  render() {
    const data = this.props.workflow;
    console.log(data);
    let page = 1;
    if (data.next) {
      page = data.next.split("?page=");
      page = parseInt(page[1]) - 1;
    } else if (data.previous) {
      page = data.previous.split("?page=");
      page = parseInt(page[1]) + 1;
    }

    console.log(page);

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
            {_.map(data.workflow, function(item, index) {
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

          <div className="mr-top-lg text-center pd-bottom-lg">
            <Pagination
              defaultCurrent={page ? page : 1}
              total={data.count}
              onChange={this.handlePageChange.bind(this)}
            />
          </div>
        </Content>
      </div>
    );
  }
}

export default WorkflowList;
