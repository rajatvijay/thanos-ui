import React from "react";
import { Modal, Layout } from "antd";
import { connect } from "react-redux";
import {
  createWorkflow,
  workflowActions,
  toggleMinimalUI
} from "../../actions";
import _ from "lodash";
import { FormattedMessage } from "react-intl";
import { WorkflowHeader } from "./WorkflowHeader";
import WorkflowDetails from "../WorkflowDetails";
import ModalHeader from "./ModalHeader";
import ModalFooter from "./ModalFooter";
import { withRouter } from "react-router-dom";

const { Content, Sider } = Layout;

class ChecklistModal extends React.Component {
  state = {
    visible: false,
    selectedStep: null,
    selectedGroup: null
  };

  componentDidMount = () => {
    this.setState({
      visible: true
    });
  };

  setParameter = (selectedStep, selectedGroup) => {
    this.setState({ selectedGroup, selectedStep });
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

  render = () => {
    return (
      <Modal
        style={this.calcTopPos()}
        footer={null}
        bodyStyle={{ padding: 0, maxHeight: 600 }}
        width="77vw"
        destroyOnClose={true}
        visible={this.state.visible}
        onOk={this.handleOk}
        onCancel={this.handleCancel}
        className="workflow-modal"
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            padding: "20px 30px",
            alignItems: "center",
            position: "absolute",
            zIndex: 1,
            width: "77vw",
            backgroundColor: "white",
            paddingRight: "60px",
            boxShadow: "rgba(0,0,0,0.05) 0px 5px 10px"
          }}
        >
          <h2>Checklist Modal</h2>
        </div>
        <div style={{ maxHeight: 600, overflowY: "scroll" }}>
          <Layout className="workflow-details-container inner-container">
            <Sider />
            <Layout
              style={{
                background: "#FBFBFF",
                minHeight: "100vh",
                paddingTop: "30px"
              }}
            >
              <Content>
                <div className="printOnly ">
                  <div className="mr-ard-lg  shadow-1 bg-white" id="StepBody">
                    <div className="text-center text-metal mr-ard-lg">
                      <br />
                      <br />
                      <div>WorkFlow</div>
                      <div>we can say child process</div>
                      <div>Step Groups</div>
                      <div>Steps</div>
                      <br />
                      <br />
                      <br />
                    </div>
                  </div>
                </div>
              </Content>
            </Layout>
          </Layout>
        </div>

        <div
          style={{
            width: "100%",
            position: "absolute",
            backgroundColor: " #148CD6",
            textAlign: "center",
            padding: "10px 0px",
            bottom: 0,
            zIndex: 1,
            fontSize: 18,
            color: "white"
          }}
        >
          SUBMIT
        </div>
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

export default withRouter(
  connect(
    mapPropsToState,
    { toggleMinimalUI }
  )(ChecklistModal)
);
