import React from "react";
import { Modal, Layout, Checkbox, Button } from "antd";
import { connect } from "react-redux";
import _ from "lodash";
import { css } from "emotion";
import { withRouter } from "react-router-dom";
import { authHeader } from "../../_helpers";

const { Content } = Layout;

class ChecklistModal extends React.Component {
  state = {
    visible: false,
    workflowData: null,
    parentWorkflow: [],
    childWorkflow: {},
    staticWorkflow: []
  };

  componentDidMount = () => {
    this.fetchWorkflowDetails();
    this.setState({
      visible: true
    });
  };

  fetchWorkflowDetails = () => {
    fetch(
      "https://af3e2827-dd97-40a5-bb17-befe64b64f54.mock.pstmn.io/api/v1/workflow/pdf/config/2133/?trigger_step=step_tag"
    )
      .then(response => response.json())
      .then(workflow => {
        this.setState({
          workflowData: workflow
        });
      });
  };

  onSelectWorkflow = (e, step, workflowName) => {
    const checked = e.target.checked;
    const value = step.value;
    if (checked && workflowName !== "childWorkflow") {
      this.setState({
        [workflowName]: [...this.state[workflowName], value]
      });
    } else if (checked && workflowName === "childWorkflow") {
      if ([workflowName].length) {
        this.setState({
          [workflowName]: {
            ...this.state[workflowName],
            [value]: [value]
          }
        });
      } else {
        this.setState({
          [workflowName]: {
            ...this.state[workflowName],
            [value]: [...this.state[workflowName][value], [value]]
          }
        });
      }
    } else if (!checked && workflowName === "childWorkflow") {
      this.setState({
        [workflowName]: {
          ...this.state[workflowName],
          [this.state[workflowName][value]]: [
            ...this.state[workflowName][value].filter(function(child) {
              return child !== step.value;
            })
          ]
        }
      });
      if (Object.values(this.state[workflowName][value])) {
        this.setState({
          [workflowName]: { ...this.state[workflowName][value], undefined } // to be modified for deletion of key having empty array
        });
      }
    } else {
      this.setState({
        [workflowName]: this.state[workflowName].filter(function(parent) {
          return parent !== step.value;
        })
      });
    }
  };

  calcTopPos = () => {
    const { list } = this.props.expandedWorkflows;
    const index = list.indexOf(this.props.workflow);
    const style = {
      left: "21vw",
      margin: 0,
      top: "calc((100vh - 600px) / 2)"
    };

    if (index > -1) {
      const topPosition = (600 - index * 120).toString() + "px";
      style.top = `calc((100vh - ${topPosition}) / 2)`;
    }

    return style;
  };

  handleOk = e => {
    this.setState({
      visible: false
    });
  };

  handleCancel = e => {
    this.setState({
      visible: false
    });
  };

  submit = () => {
    const { parentWorkflow, staticWorkflow } = this.state;
    const requestOptions = {
      method: "POST",
      headers: authHeader.post(),
      body: JSON.stringify({
        config_id: 863,
        workflow_id: 28157,
        parent_steps_to_print: parentWorkflow,
        child_steps_to_print: {
          "grey-list": ["grey_list_information"]
        },
        static_sections: staticWorkflow,
        include_flags: true,
        include_comments: true,
        include_archived_related_workflows: false
      })
    };

    fetch(
      "https://af3e2827-dd97-40a5-bb17-befe64b64f54.mock.pstmn.io/api/v1/workflow/pdf/print/",
      requestOptions
    )
      .then(function(response) {
        console.log(response);
      })
      .catch(function(error) {
        console.log(error);
      });
  };

  renderParentWorkflow = () => {
    const { workflowData } = this.state;
    return workflowData.results[0].parent_workflows.steps.map((step, key) => {
      return (
        <div key={key}>
          <Checkbox
            className={css`
              font-size: 17px;
              margin-left: 15px;
              margin-top: 3px;
            `}
            onChange={e => this.onSelectWorkflow(e, step, "parentWorkflow")}
          >
            {step.label}
          </Checkbox>
        </div>
      );
    });
  };

  renderChildWorkflow = () => {
    const { workflowData } = this.state;
    return workflowData.results[0].child_workflows.map((workflow, key) => {
      return workflow.steps.map(step => (
        <div
          key={key}
          className={css`
            width: 50%;
          `}
        >
          <h2>{workflow.label}</h2>
          <Checkbox
            className={css`
              font-size: 17px;
              margin-left: 15px;
              margin-top: 3px;
            `}
            onChange={e => this.onSelectWorkflow(e, step, "childWorkflow")}
          >
            {step.label}
          </Checkbox>
        </div>
      ));
    });
  };

  renderStaticWorkflow = () => {
    const { workflowData } = this.state;
    return workflowData.results[0].extra_sections.map((section, key) => (
      <div key={key}>
        <Checkbox
          className={css`
            font-size: 17px;
            margin-left: 15px;
            margin-top: 3px;
          `}
          onChange={e => this.onSelectWorkflow(e, section, "staticWorkflow")}
        >
          {section.label}
        </Checkbox>
      </div>
    ));
  };

  render = () => {
    const {
      workflowData,
      parentWorkflow,
      childWorkflow,
      staticWorkflow
    } = this.state;
    console.log(this.state.childWorkflow);
    return (
      <Modal
        // style={this.calcTopPos()}
        footer={null}
        bodyStyle={{ padding: 0, maxHeight: 600 }}
        width="77vw"
        destroyOnClose={true}
        visible={this.state.visible}
        onOk={this.handleOk}
        onCancel={this.handleCancel}
        className="workflow-modal"
      >
        <div style={{ maxHeight: 600, overflowY: "auto", borderRadius: 5 }}>
          <div
            style={{
              background: "white"
            }}
          >
            <div>
              <div className="printOnly">
                <div style={{ margin: "0px 35px" }}>
                  <div className="text-metal">
                    <br />
                    <br />
                    {workflowData ? (
                      <>
                        <h2>
                          {workflowData.results[0].parent_workflows.label}
                        </h2>
                        {workflowData.results[0].parent_workflows
                          ? this.renderParentWorkflow()
                          : null}
                        <div
                          className={css`
                            display: flex;
                            flex-direction: row;
                            margin-top: 30px;
                            width: 100%;
                          `}
                        >
                          {workflowData.results[0].child_workflows
                            ? this.renderChildWorkflow()
                            : null}
                        </div>
                        <div
                          className={css`
                            margin-top: 30px;
                          `}
                        >
                          <h2>Static Section</h2>
                          {workflowData.results[0].extra_sections
                            ? this.renderStaticWorkflow()
                            : null}
                        </div>
                        <Button
                          disabled={
                            !parentWorkflow.length &&
                            !Object.keys(childWorkflow).length &&
                            !staticWorkflow.length
                          }
                          className={css`
                            margin-top: 30px;
                          `}
                          onClick={() => this.submit()}
                          type="primary"
                        >
                          SUBMIT
                        </Button>
                      </>
                    ) : null}
                    <br />
                    <br />
                    <br />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* <div
          onClick={() => this.submit()}
          style={{
            width: "100%",
            position: "absolute",
            backgroundColor: " #148CD6",
            textAlign: "center",
            padding: "10px 0px",
            bottom: 0,
            zIndex: 1,
            fontSize: 18,
            color: "white",
            cursor: "pointer"
          }}
        >
          SUBMIT
        </div> */}
      </Modal>
    );
  };
}

function mapPropsToState(state) {
  const { workflowChildren, expandedWorkflows, minimalUI } = state;
  return {
    workflowChildren,
    expandedWorkflows,
    minimalUI
  };
}

export default withRouter(connect(mapPropsToState)(ChecklistModal));
