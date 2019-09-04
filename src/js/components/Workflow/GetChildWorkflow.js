import React, { Component } from "react";
import _ from "lodash";
import WorkflowItem from "./WorkflowItem";
import { Tabs, Checkbox, notification } from "antd";
import { authHeader } from "../../_helpers";
import { apiBaseURL } from "../../../config";
import { checkPermission } from "../../../modules/common/permissions/Chowkidaar";
import Permission from "../../../modules/common/permissions/permissionsList";

const TabPane = Tabs.TabPane;

const openNotificationWithIcon = data => {
  notification[data.type]({
    message: data.message,
    description: data.body,
    placement: "bottomLeft"
  });
};

class GetChildWorkflow extends Component {
  constructor(props) {
    super(props);
    this.state = { relatedKinds: [], children: [], isLoading: false };
  }

  componentDidUpdate = prevProps => {
    const { id } = this.props.workflow;

    if (
      _.size(this.props.relatedKinds) &&
      _.size(this.state.relatedKinds) === 0
    ) {
      this.setState({ relatedKinds: this.props.relatedKinds });
    }

    if (
      this.props.workflowChildren[id] !== prevProps.workflowChildren[id] &&
      _.size(this.props.workflowChildren[id].children)
    ) {
      this.setState(
        { children: this.props.workflowChildren[id].children },
        () => {
          this.assignChilrenToKind();
        }
      );
    }
  };

  assignChilrenToKind = () => {
    const rk = this.state.relatedKinds;
    const children = this.state.children;
    const workFlowDetail = this.props.workflow;

    const workflowFilterByKind = _.map(rk, kind => {
      const k = {
        name: kind.name,
        id: kind.id,
        is_related_checkmarking_enabled: kind.is_related_checkmarking_enabled,
        tag: kind.tag,
        is_checkbox_checked: false,
        workflows: []
      };
      _.forEach(children, child => {
        if (child.definition.kind === kind.id) {
          k.workflows.push(child);
        }
        if (workFlowDetail.checkmarked_types.includes(kind.tag)) {
          k.is_checkbox_checked = true;
        }
      });
      return k;
    });

    this.setState({
      relatedKinds: _.orderBy(
        workflowFilterByKind,
        ["workflows.length"],
        ["desc"]
      )
    });
  };

  onChildCheckboxClick = (workflowId, kindTag, is_checkbox_checked) => {
    this.setState({
      isLoading: true
    });
    const requestOptions = {
      method: "POST",
      headers: authHeader.post(),
      credentials: "include",
      body: JSON.stringify({
        related_type: kindTag,
        action: !is_checkbox_checked ? "add" : "remove"
      })
    };
    return fetch(
      apiBaseURL + "workflows/" + workflowId + "/checkmark-related-type/",
      requestOptions
    )
      .then(response => {
        if (!response.ok) {
          this.setState({
            isLoading: false
          });
          return openNotificationWithIcon({
            type: "error",
            message: "Failed!"
          });
        }
        return response.json();
      })
      .then(data => {
        // login successful if there's a jwt token in the response
        if (data) {
          const rk = this.state.relatedKinds;

          const workflowFilterByKind = rk.map(kind => {
            const k = {
              name: kind.name,
              id: kind.id,
              is_related_checkmarking_enabled:
                kind.is_related_checkmarking_enabled,
              tag: kind.tag,
              is_checkbox_checked: data.checkmarked_types.includes(kind.tag),
              workflows: kind.workflows
            };
            return k;
          });

          this.setState({
            relatedKinds: _.orderBy(
              workflowFilterByKind,
              ["workflows.length"],
              ["desc"]
            ),
            isLoading: false
          });
        }
      });
  };

  getChildCheckbox = kind => {
    const regexForUrl = /\/instances\/[\d]+/;
    if (kind.is_related_checkmarking_enabled) {
      return (
        <div>
          <Checkbox
            checked={kind.is_checkbox_checked}
            onChange={e =>
              this.onChildCheckboxClick(
                this.props.workflow.id,
                kind.tag,
                kind.is_checkbox_checked
              )
            }
            disabled={
              checkPermission({
                permissionsAllowed: this.props.permission,
                permissionName: Permission.CAN_CHECKMARK_RELATED_WORKFLOWS
              }) ||
              !regexForUrl.test(document.location.pathname) ||
              this.state.isLoading
            }
          />
          <span>{kind.name + " (" + _.size(kind.workflows) + ")"}</span>
        </div>
      );
    }
    return <span>{kind.name + " (" + _.size(kind.workflows) + ")"}</span>;
  };

  render() {
    const { props } = this;
    const cbtn = (
      <span style={{ paddingRight: "20px" }}>{props.createButton}</span>
    );

    return (
      <Tabs tabBarExtraContent={cbtn}>
        {_.map(this.state.relatedKinds, (kind, key) => {
          return (
            <TabPane tab={this.getChildCheckbox(kind)} key={`${kind.name}`}>
              <div className="pd-ard-lg">
                {_.size(kind.workflows) ? (
                  _.map(kind.workflows, function(item, index) {
                    return (
                      <WorkflowItem
                        isChild={true}
                        workflow={item}
                        key={`${index}`}
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
                  })
                ) : (
                  <div className="pd-ard-sm">No results found</div>
                )}
              </div>
            </TabPane>
          );
        })}
      </Tabs>
    );
  }
}

export default GetChildWorkflow;
