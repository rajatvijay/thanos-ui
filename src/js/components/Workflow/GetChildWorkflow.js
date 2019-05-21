import React, { Component } from "react";
import _ from "lodash";
import { connect } from "react-redux";
import WorkflowItem from "./WorkflowItem";
import { Tabs, Checkbox, notification } from "antd";
import { authHeader, baseUrl } from "../../_helpers";

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
    this.state = { relatedKinds: [], children: [] };
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
    let rk = this.state.relatedKinds;
    let children = this.state.children;

    let workflowFilterByKind = _.map(rk, kind => {
      let k = {
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
        if (child.checkmarked_types.includes(kind.tag)) {
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

  onChildCheckboxClick = (
    workflowId,
    kindTag,
    is_checkbox_checked,
    kindDetail
  ) => {
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
      baseUrl + "workflows/" + workflowId + "/checkmark-related-type/",
      requestOptions
    ).then(response => {
      if (!response.ok) {
        return openNotificationWithIcon({
          type: "error",
          message: "Failed!"
        });
      }
      let rk = this.state.relatedKinds;
      let children = this.state.children;

      let workflowFilterByKind = _.map(rk, kind => {
        let k = {
          name: kind.name,
          id: kind.id,
          is_related_checkmarking_enabled: kind.is_related_checkmarking_enabled,
          tag: kind.tag,
          is_checkbox_checked: false,
          workflows: kind.workflows
        };
        _.forEach(children, child => {
          if (response.json().checkmarked_types.includes(kindDetail.tag)) {
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
      console.log(response.json());
      return response.json();
    });
  };

  getChildCheckbox = kind => {
    if (
      kind.is_related_checkmarking_enabled &&
      this.props.config.permissions.includes("Can checkmark related workflows")
    ) {
      return (
        <div>
          <Checkbox
            checked={kind.is_checkbox_checked}
            onChange={e =>
              this.onChildCheckboxClick(
                this.props.workflow.id,
                kind.tag,
                kind.is_checkbox_checked,
                kind
              )
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
    let workflowId = props.workflow.id;
    return (
      <Tabs tabBarExtraContent={cbtn}>
        {_.map(this.state.relatedKinds, (kind, key) => {
          return (
            <TabPane tab={this.getChildCheckbox(kind)} key={kind.name}>
              <div className="pd-ard-lg">
                {_.size(kind.workflows) ? (
                  _.map(kind.workflows, function(item, index) {
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
                  })
                ) : (
                  <div className="pd-ard-sm">No workflows</div>
                )}
              </div>
            </TabPane>
          );
        })}
      </Tabs>
    );
  }
}

function mapPropsToState(state) {
  const { workflowKind, workflowFilterType, workflowChildren } = state;
  return {
    workflowKind,
    workflowFilterType,
    workflowChildren
  };
}

const ChildWorkflow = connect(mapPropsToState)(GetChildWorkflow);

export default GetChildWorkflow;
