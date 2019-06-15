import React, { Component } from "react";
import _ from "lodash";
import { connect } from "react-redux";
import WorkflowItem from "./WorkflowItem";
import {
  StepGroupList,
  LcData,
  MetaRow,
  GetQuickData
} from "./WorkflowBodyComponents";
import { Tabs, Icon, Row, Col, Alert } from "antd";

const TabPane = Tabs.TabPane;

const WorkflowBodyContainer = props => {
  let finalHtml = null;
  let workflowId = props.workflow.id;
  const cbtn = props.createButton;
  let showRelated = false;

  finalHtml = (
    <div className="lc-card-body">
      <Tabs tabBarExtraContent={cbtn}>
        <TabPane tab={"STATUS"} key={1} style={{ marginLeft: "8px" }}>
          {props.stepdataloading ? (
            <div className="text-center mr-top-lg">
              {" "}
              <Icon type="loading" />{" "}
            </div>
          ) : (
            <StepGroupList {...props} />
          )}
        </TabPane>

        <TabPane tab={"PROFILE"} key={2}>
          <LcData {...props} />
        </TabPane>

        {_.map(props.relatedKinds, (kind, key) => {
          return (
            <TabPane
              tab={kind.name + " (" + _.size(kind.workflows) + ")"}
              key={kind.name}
            >
              <div className="workflow-list">
                {_.map(kind.workflows, function(item, index) {
                  return (
                    <WorkflowItem
                      isChild={true}
                      workflow={item}
                      key={index}
                      kinds={props.kinds}
                      dispatch={props.dispatch}
                      workflowFilterType={props.workflowFilterType}
                      statusView={props.statusView}
                      addComment={props.addComment || null}
                      showCommentIcon={props.showCommentIcon}
                      isEmbedded={props.isEmbedded}
                      expandedWorkflows={props.expandedWorkflows}
                      config={props.config}
                      workflowChildren={props.workflowChildren}
                    />
                  );
                })}
              </div>
            </TabPane>
          );
        })}
      </Tabs>
      {props.workflow.lc_message ? (
        <Row className="mr-top-lg">
          <Col span="24" className="mr-top">
            <Alert message={props.workflow.lc_message} type="info" showIcon />
          </Col>
        </Row>
      ) : null}
    </div>
  );

  return finalHtml;
  //return <div/>
};

function mapPropsToState(state) {
  const { workflowKind, workflowFilterType, workflowChildren } = state;
  return {
    workflowKind,
    workflowFilterType,
    workflowChildren
  };
}

const WorkflowBody = connect(mapPropsToState)(WorkflowBodyContainer);

export default WorkflowBody;
