import React from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { Layout, Icon, Divider, Form } from "antd";
import _ from "lodash";
import { injectIntl } from "react-intl";
import { workflowStepActions, workflowDetailsActions } from "../../actions";
import Comments from "../WorkflowDetails/comments";
import FieldItem from "../WorkflowDetails/FieldItem";

const { Content, Sider } = Layout;
class StepPreview extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      object_id: null
    };
  }

  toggleSidebar = (object_id, content_type, isEmbedded) => {
    this.state.loading_sidebar = true;
    this.state.object_id = object_id;
    this.props.dispatch(
      workflowDetailsActions.getComment(object_id, content_type, "", true)
    );
  };

  addComment = (payload, step_reload_payload, isEmbedded) => {
    this.state.adding_comment = true;
    this.state.object_id = payload.object_id;
    this.props.dispatch(
      workflowStepActions.addComment(payload, step_reload_payload, true)
    );
  };

  getIntegrationComments = (uid, field_id) => {
    this.state.loading_sidebar = true;
    const payload = {
      uid: uid,
      field_id: field_id
    };
    this.props.dispatch(
      workflowDetailsActions.getComment(1, "integrationresult", payload, true)
    );
  };

  changeFlag = payload => {
    this.props.dispatch(workflowStepActions.updateFlag(payload, true));
  };

  changeIntegrationStatus = payload => {
    this.props.dispatch(
      workflowStepActions.updateIntegrationStatus(payload, true)
    );
  };

  render() {
    const currentField = this.props.stepPreviewFields;

    const param = {
      currentStepFields: currentField,
      error: null,
      workflowId: currentField.currentStepFields.workflow,
      formProps: this.props.form,
      is_locked: true,
      addComment: this.toggleSidebar,
      changeFlag: this.changeFlag,
      getIntegrationComments: this.getIntegrationComments,
      dispatch: this.props.dispatch,
      intl: this.props.intl,
      permission: [],
      dynamicUserPerms: [],
      isEmbedded: true
    };

    const getFieldForRender = field => {
      const fieldParams = Object.assign({}, param);
      fieldParams["field"] = field;
      return <FieldItem fieldParams={fieldParams} />;
    };

    const RenderField = () => {
      const body = (
        <Form
          layout="vertical"
          onSubmit={this.handleSubmit}
          className="step-form"
          autoComplete="off"
        >
          {_.map(currentField.currentStepFields.data_fields, (field, index) => {
            return (
              <div className="mr-bottom-sm" key={`${index}`}>
                <div className="mr-bottom-sm">{getFieldForRender(field)}</div>
              </div>
            );
          })}
        </Form>
      );

      return body;
    };

    const comment_data = this.props.workflowComments.data;

    if (currentField.loading) {
      return (
        <div className="text-center mr-top">
          {" "}
          <Icon type="loading" />
        </div>
      );
    } else {
      const step = currentField.currentStepFields;
      return (
        <div>
          <Sider
            className="comments-sidebar profile-sidebar sidebar-right animated slideInRight"
            style={{
              background: "#fff",
              overflow: "auto",
              height: "calc(100vh - 65px)",
              position: "fixed",
              right: 0,
              top: "65px",
              zIndex: 1
            }}
            width="700"
            collapsed={!this.props.showQuickDetails}
            collapsedWidth={0}
            collapsible
            trigger={null}
          >
            <div className="comment-details" style={{ width: "700px" }}>
              <div className="sidebar-head">
                <span className="sidebar-title">{this.props.workflowName}</span>
                <Icon
                  type="close"
                  onClick={this.props.hideQuickDetails}
                  style={{
                    position: "absolute",
                    top: "0px",
                    right: "0px",
                    width: "48px",
                    height: "48px",
                    lineHeight: "48px",
                    cursor: "pointer"
                  }}
                />
              </div>
              <Content style={{ padding: "15px", paddingBottom: "50px" }}>
                <div>
                  <Link
                    className="float-right"
                    to={{
                      pathname: "/workflows/instances/" + step.workflow,
                      search: "?group=" + step.step_group + "&step=" + step.id,
                      state: {
                        step: step.id,
                        group: step.step_group
                      }
                    }}
                  >
                    Go to step <Icon type="arrow-right" />
                  </Link>
                  <span className="text-metal text-medium">
                    {currentField.currentStepFields.name}{" "}
                  </span>
                </div>
                <Divider />
                <RenderField />
              </Content>
            </div>
          </Sider>

          {comment_data &&
          comment_data.results &&
          comment_data.results.length > 0 ? (
            <Comments
              object_id={this.state.object_id}
              toggleSidebar={this.toggleSidebar}
              addComment={this.addComment}
              gotoStep={this.fetchStepData}
              selectActiveStep={this.selectActiveStep}
              changeFlag={this.changeFlag}
              changeIntegrationStatus={this.changeIntegrationStatus}
              isEmbedded={true}
              currentStepFields={currentField}
              {...this.props}
            />
          ) : null}
        </div>
      );
    }
  }
}

function mapPropsToState(state) {
  const { stepPreviewFields, workflowComments } = state;
  return {
    stepPreviewFields,
    workflowComments
  };
}

export default connect(mapPropsToState)(injectIntl(StepPreview));
