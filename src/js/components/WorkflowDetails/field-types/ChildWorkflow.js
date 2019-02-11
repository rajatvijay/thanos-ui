import React, { Component } from "react";
import { authHeader, baseUrl, handleResponse } from "../../../_helpers";
import { WorkflowHeader } from "../../Workflow/workflow-item";
import { connect } from "react-redux";
import {
  Form,
  Input,
  Button,
  Dropdown,
  Row,
  Menu,
  Col,
  Table,
  Icon,
  Divider,
  Select,
  Tag,
  Switch
} from "antd";
import _ from "lodash";
import { commonFunctions } from "./commons";
import { workflowKindActions, createWorkflow } from "../../../actions";

const FormItem = Form.Item;
const Option = Select.Option;
const { Column, ColumnGroup } = Table;
const {
  getLabel,
  onFieldChange,
  onFieldChangeArray,
  arrayToString,
  stringToArray,
  field_error,
  getRequired,
  feedValue,
  getLink,
  isDisabled
} = commonFunctions;

class ChildWorkflowField2 extends Component {
  constructor() {
    super();
    this.state = {
      field: null,
      country: null,
      statusView: true,
      kindChecked: false,
      showRelatedWorkflow: false
    };
  }

  componentDidMount = () => {
    let kind = this.props.field.definition.extra.child_workflow_kind_id;
    this.getChildWorkflow(this.props.workflowId, kind);

    if (
      !_.size(this.props.workflowKind.workflowKind) &&
      this.state.kindChecked === false
    ) {
      this.props.dispatch(workflowKindActions.getAll());
      this.setState({ kindChecked: true });
    }
  };

  getChildWorkflow = (parentId, kind, isChildWorkflow) => {
    const requestOptions = {
      method: "GET",
      headers: authHeader.get(),
      credentials: "include"
    };

    let parent_id = parentId;
    //let kind = this.props.field.definition.extra.child_workflow_kind_id;

    let url =
      baseUrl +
      "workflows-list/?limit=100&parent_workflow_id=" +
      parent_id +
      "&kind=" +
      kind;

    if (isChildWorkflow) {
      this.setState({ fetchingChild: true });
    } else {
      this.setState({ fetching: true });
    }

    fetch(url, requestOptions)
      .then(response => response.json())
      .then(body => {
        if (isChildWorkflow) {
          this.setState({
            [parentId]: body.results,
            fetchingChild: false
          });
        } else {
          this.setState({
            childWorkflow: body.results,
            fetching: false
          });
          this.createFilterTag();
        }
      });
  };

  getKindID = kindTag => {
    let kind = _.find(this.props.workflowKind.workflowKind, function(k) {
      return k.tag === kindTag;
    });
    return kind.id;
  };

  getGroupedData = children => {
    let grouped = _.groupBy(children, function(child) {
      return child.definition.kind;
    });
    return grouped;
  };

  onChildSelect = e => {
    let payload = {
      status: 1,
      kind: e.key,
      name: "Draft",
      parent: this.props.workflowId
    };

    this.props.dispatch(createWorkflow(payload));
  };

  getRelatedTypes = () => {
    let related = this.props.workflowDetailsHeader.workflowDetailsHeader
      .definition.related_types;

    let that = this;

    let rt = [];
    if (related.length !== 0) {
      _.map(related, function(rtc) {
        _.filter(that.props.workflowKind.workflowKind, function(kind) {
          if (kind.tag === rtc) {
            rt.push(kind);
          }
        });
      });
    }

    return rt;
  };

  getKindMenu = () => {
    let workflowKindFiltered = [];
    const relatedKind = this.getRelatedTypes();

    _.map(relatedKind, function(item) {
      if (item.is_related_kind && _.includes(item.features, "add_workflow")) {
        workflowKindFiltered.push(item);
      }
    });

    let menu = (
      <Menu onClick={this.onChildSelect}>
        {!_.isEmpty(workflowKindFiltered) ? (
          _.map(workflowKindFiltered, function(item, index) {
            return <Menu.Item key={item.tag}>{item.name}</Menu.Item>;
          })
        ) : (
          <Menu.Item disabled>No related workflow kind</Menu.Item>
        )}
      </Menu>
    );

    return menu;
  };

  getAddMenu = () => {
    let menu = (
      <Dropdown
        overlay={this.getKindMenu()}
        className="child-workflow-dropdown"
        placement="bottomRight"
        //disabled={isDisabled(this.props)}
      >
        <Button
          type="primary"
          loading={this.props.workflowKind.loading ? true : false}
        >
          Add {this.state.fetching ? "loadin..." : ""}
          <i className="material-icons t-14">keyboard_arrow_down</i>
        </Button>
      </Dropdown>
    );

    return menu;
  };

  createFilterTag = () => {
    let that = this;
    if (!_.size(that.state.childWorkflow)) {
      this.setState({ filterTags: <span /> });
      return;
    }

    let filter_tag_count = { All: _.size(that.state.childWorkflow) };
    let tag_workflow_map = { All: that.state.childWorkflow };
    _.map(that.state.childWorkflow, function(v, k) {
      _.map(v.lc_data, function(tag, i) {
        if (!tag.value) {
          return true;
        }
        if (tag.type && tag.type["type"] == "normal") {
          return true;
        }
        if (filter_tag_count[tag.label]) {
          filter_tag_count[tag.label] += 1; //parseInt(tag.value)
        } else {
          filter_tag_count[tag.label] = 1; //parseInt(tag.value)
        }

        if (tag_workflow_map[tag.label]) {
          tag_workflow_map[tag.label].push(v);
        } else {
          tag_workflow_map[tag.label] = [v];
        }
      });
    });

    this.state.tag_workflow_map = tag_workflow_map;
    let styling = this.props.field.definition.extra.lc_data_colorcodes || {};
    let filterTags = (
      <div>
        {_.map(filter_tag_count, function(v, k) {
          return (
            <Tag
              style={styling[k]}
              className="alert-tag-item alert-primary"
              onClick={that.onFilterTagChange.bind(that, k)}
            >
              {k} ({v})
            </Tag>
          );
        })}
      </div>
    );
    this.setState({ filterTags: filterTags });
  };

  onFilterTagChange = tag => {
    let filtered_workflow = this.state.tag_workflow_map[tag];
    this.setState({ childWorkflow: filtered_workflow });
  };

  // expandChildWorkflow = () => {
  //   this.setState({ showRelatedWorkflow: !this.state.showRelatedWorkflow });

  //   this.props.dispatch(
  //     workflowActions.getChildWorkflow(this.props.workflow.id)
  //   );
  // };

  render = () => {
    let props = this.props;
    let { field, workflowKind } = props;
    let that = this;

    //const childWorkflowMenu = this.getKindMenu();
    return (
      <FormItem
        label={""}
        className={
          "from-label " + (_.size(props.field.selected_flag) ? " has-flag" : "")
        }
        style={{ display: "block" }}
        key={props.field.id}
        message=""
        required={getRequired(props)}
        hasFeedback
        autoComplete="new-password"
        {...field_error(props)}
      >
        {this.state.fetching ? (
          <div className="text-center mr-top-lg">
            <Icon type="loading" style={{ fontSize: 24 }} />
          </div>
        ) : (
          <div>
            <Row>
              <Col span="18">
                <span
                  className="text-metal"
                  style={{ marginRight: "10px", float: "left" }}
                >
                  Filters:{" "}
                </span>
                <span>{this.state.filterTags}</span>
              </Col>
              <Col span="6" className="text-right text-light small">
                {this.props.workflowDetailsHeader.workflowDetailsHeader
                  ? this.getAddMenu()
                  : null}
              </Col>
            </Row>
            <Divider />

            <Row className="text-metal">
              <Col span="7">Name</Col>
              <Col span="12">Alerts</Col>
              <Col span="2" />
              <Col span="3">Status</Col>
            </Row>

            <br />

            <div className="workflow-list workflows-list-embedded">
              <div className="paper" style={{ padding: "7px" }}>
                {_.size(this.state.childWorkflow) ? (
                  _.map(this.state.childWorkflow, function(workflow) {
                    return (
                      <ChildItem
                        workflow={workflow}
                        field={field}
                        workflowKind={workflowKind}
                      />
                    );
                  })
                ) : (
                  <div>No related workflows</div>
                )}
              </div>
            </div>
          </div>
        )}
      </FormItem>
    );
  };
}

// export const WorkflowHeader = props => {
//   let proccessedData = getProcessedData(props.workflow.step_groups);
//   let progressData = getProgressData(props.workflow);

//   return (
//     <div className="ant-collapse-header">
//       <Row type="flex" align="middle" className="lc-card-head">
//         {props.isChild ? null : (
//           <Col span={1} className=" text-anchor">
//             {props.detailsPage ? (
//               <span onClick={history.goBack} className="text-anchor pd-ard-sm ">
//                 <i
//                   className="material-icons text-secondary"
//                   style={{ fontSize: "18px", verticalAlign: "middle" }}
//                 >
//                   keyboard_backspace
//                 </i>
//               </span>
//             ) : (
//               <span className="pd-right">
//                 <Popover
//                   content={
//                     <div className="text-center">
//                       <div className="small">{progressData}% completed</div>
//                     </div>
//                   }
//                 >
//                   <Progress
//                     type="circle"
//                     percent={progressData}
//                     width={35}
//                     format={percent => (
//                       <i
//                         className="material-icons"
//                         style={{ fontSize: "18px", verticalAlign: "middle" }}
//                       >
//                         {props.kind === ""
//                           ? "folder_open"
//                           : getIcon(props.workflow.definition.kind, props.kind)}
//                       </i>
//                     )}
//                   />
//                 </Popover>
//               </span>
//             )}
//           </Col>
//         )}

//         <HeaderTitle {...props} />

//         {props.isEmbedded && _.size(props.workflow.lc_data) ? (
//           <Col span={11}>
//             <GetQuickData {...props} />
//           </Col>
//         ) : _.size(props.workflow.alerts) ? (
//           <Col span={11}>
//             <GetAlertData {...props} />
//           </Col>
//         ) : (
//           <HeaderWorkflowGroup
//             {...props}
//             //progressData={progressData}
//             pdata={proccessedData}
//           />
//         )}

//         <Col span="2" className="text-center">
//           {props.workflow.sorting_primary_field ? (
//             <Badge
//               count={<span>{props.workflow.sorting_primary_field}</span>}
//               style={{
//                 backgroundColor: getScoreColor(
//                   props.workflow.sorting_primary_field
//                 )
//               }}
//             />
//           ) : null}{" "}
//         </Col>
//         <HeaderOptions2 {...props} />
//       </Row>
//     </div>
//   );
// };

class ChildItem extends Component {
  constructor() {
    super();
    this.state = {
      hasChild: false,
      isExpanded: false,
      childWorkflow: null,
      kind: null
    };
  }

  componentDidMount = () => {
    this.setKind();
  };

  getKindID = kindTag => {
    let kind = null;
    kind = _.find(this.props.workflowKind.workflowKind, function(k) {
      return k.tag === kindTag;
    });

    if (kind) {
      return kind.id;
    } else {
      return;
    }
  };

  toggleExpand = (parent, kind) => {
    this.setState({ isExpanded: !this.state.isExpanded });
    if (!this.state.childWorkflow) {
      this.getWorkflows(parent, kind);
    }
  };

  setKind = () => {
    let rKind = null;
    if (_.size(this.props.workflowKind.workflowKind)) {
      rKind = this.getKindID(this.props.workflow.definition.related_types[0]);
      this.setState({ kind: rKind });
    }
  };

  componentDidUpdate = prevProps => {
    if (this.props.workflowKind !== prevProps.workflowKind) {
      this.setKind();
    }
  };

  getWorkflows = (parent, kind) => {
    let resp = { fetching: true };

    const requestOptions = {
      method: "GET",
      headers: authHeader.get(),
      credentials: "include"
    };

    let url =
      baseUrl +
      "workflows-list/?&parent_workflow_id=" +
      parent +
      "&kind=" +
      kind;

    this.setState({ fetching: true });

    fetch(url, requestOptions)
      .then(response => {
        if (response.ok) {
          return response.json();
        } else {
          throw new Error("Something went wrong");
        }
      })
      .then(body => {
        this.setState({ fetching: false, childWorkflow: body.results });
      })
      .catch(error => {
        this.setState({ fetching: false, error: error });
        console.log(error);
      });
  };

  render = () => {
    let that = this;
    let props = this.props;
    const { workflow, workflowKind, field } = props;
    const { isExpanded, kind, fetching } = this.state;
    return (
      <div class={"workflow-list-item " + (isExpanded ? "expanded " : "")}>
        <WorkflowHeader
          workflow={workflow}
          field={field}
          link={true}
          kind={""}
          statusView={true}
          isChild={true}
          hasChild={workflow.children_count}
          isEmbedded={true}
          showCommentIcon={true}
        />

        {workflow.children_count > 0 ? (
          <span
            className="child-workflow-expand text-anchor "
            onClick={that.toggleExpand.bind(that, workflow.id, kind)}
            title="Show child workflow"
          >
            {this.state.kind ? (
              <i
                className="material-icons t-16"
                style={{ verticalAlign: "middle" }}
              >
                {isExpanded ? "remove" : "add"}
              </i>
            ) : (
              <Icon type="loading" style={{ fontSize: 12 }} />
            )}
          </span>
        ) : null}

        {fetching ? (
          <div className="text-center pd-ard">loading...</div>
        ) : that.state.childWorkflow && isExpanded ? (
          <div className="pd-left-lg child-container">
            {_.map(this.state.childWorkflow, function(child) {
              return <ChildItem workflow={child} workflowKind={kind} />;
            })}
          </div>
        ) : null}
      </div>
    );
  };
}

function mapPropsToState(state) {
  const { workflowDetailsHeader, workflowKind } = state;
  return {
    workflowDetailsHeader,
    workflowKind
  };
}

const ChildWorkflowFieldComponent = connect(mapPropsToState)(
  ChildWorkflowField2
);

export const ChildWorkflowField = props => {
  return <ChildWorkflowFieldComponent {...props} />;
};
