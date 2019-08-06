import React from "react";
import { Link } from "react-router-dom";
import moment from "moment";
import _ from "lodash";
import { Row, Col, Tooltip, Checkbox, Popover } from "antd";
import { ProcessLcData } from "./ProcessLcData";
import { css } from "emotion";

//////////////////
/*workflow Head*/
/////////////////

// title --- lc data + alerts ---- status --- rank --- go to details //

function displaySortingKey(workflow) {
  const obj =
    Array.isArray(workflow.definition.extra_fields_json) &&
    workflow.definition.extra_fields_json.find(
      ({ label }) => label === "sorting_primary_field"
    );

  if (obj) {
    if (obj.format === "date") {
      return moment(workflow.sorting_primary_field, moment.ISO_8601).isValid()
        ? moment(workflow.sorting_primary_field).format("DD/MM/YYYY")
        : "";
    } else {
      return workflow.sorting_primary_field;
    }
  }
}

export const WorkflowHeader = props => {
  const { workflow, isEmbedded } = props;

  const headerData = (
    <Row
      type="flex"
      align="middle"
      className="lc-card-head"
      style={{ padding: "0px 12px 0 12px" }}
    >
      {props.isEmbedded ? (
        <Col span={1} className="text-left">
          <Checkbox
            checked={
              props.bulkActionWorkflowChecked.filter(
                item => item.id === props.workflow.id
              ).length
            }
            className={css`
              .ant-checkbox-inner {
                width: 20px;
                height: 20px;
              }
            `}
            onChange={event =>
              props.handleChildWorkflowCheckbox(
                event,
                props.workflow.id,
                props.workflow.definition.kind
              )
            }
            onClick={event => event.stopPropagation()}
          />
        </Col>
      ) : null}

      <Col span={isEmbedded ? 5 : 6} className="text-left ">
        <HeaderTitle {...props} />
      </Col>

      <Col span={isEmbedded ? 6 : 8}>
        <GetMergedData {...props} />
      </Col>

      <Col span={4}>
        <HeaderLcData {...props} />
      </Col>

      <Col span={1} className="text-center">
        {props.workflow.sorting_primary_field && props.sortingEnabled ? (
          <span
            className={
              "risk-item bg-" +
              getScoreColor(props.workflow.sorting_primary_field)
            }
          >
            {props.rank}
          </span>
        ) : null}
      </Col>

      {isEmbedded && (
        <Col span={2}>
          <div>{displaySortingKey(workflow)}</div>
        </Col>
      )}

      <Col span={5}>
        <HeaderOptions {...props} />
      </Col>
    </Row>
  );

  return (
    <Row
      style={{ cursor: "pointer" }}
      onClick={() => props.showModal(props.workflow.id)}
      type="flex"
      align="middle"
    >
      <Col span={props.isExpanded ? 22 : 24}>{headerData}</Col>
    </Row>
  );
};

const createFamilyListForBreadcrums = family => {
  return family.map((item, index) => (
    <React.Fragment key={`${index}`}>
      <Link style={{ color: "black" }} to={"/workflows/instances/" + item.id}>
        {" "}
        {item.name}
      </Link>
      <span> /</span>
    </React.Fragment>
  ));
};

const HeaderTitle = props => {
  const { workflow } = props;
  const { family } = workflow;

  if (family.length === 1 || props.isEmbedded) {
    return (
      <div>
        <span
          title={props.workflow.name}
          style={{
            color: "#000000",
            fontSize: "20px",
            letterSpacing: "-0.04px",
            lineHeight: "24px"
          }}
        >
          {workflow.name}
        </span>
      </div>
    );
  } else if (family.length === 2) {
    return (
      <div>
        <span
          title={props.workflow.name}
          style={{
            color: "#000000",
            fontSize: "20px",
            letterSpacing: "-0.04px",
            lineHeight: "24px"
          }}
        >
          <Link
            className={css`
              color: #b5b5b5;
              &:hover {
                color: black;
              }
            `}
            to={"/workflows/instances/" + family[0].id}
          >
            {family[0].name}
          </Link>{" "}
          / {family[1].name}
        </span>
      </div>
    );
  } else {
    return (
      <div>
        <Popover content={createFamilyListForBreadcrums(family)}>
          <span
            title={props.workflow.name}
            style={{
              color: "#000000",
              fontSize: "16px",
              letterSpacing: "-0.04px",
              lineHeight: "24px"
            }}
          >
            <Link
              className={css`
                color: #b5b5b5;
                &:hover {
                  color: black;
                }
              `}
              to={"/workflows/instances/" + family[0].id}
            >
              {family[0].name}
            </Link>
            <span style={{ color: "#b5b5b5" }}> /... / </span>
            {workflow.name}
          </span>
        </Popover>
      </div>
    );
  }
};

export const HeaderLcData = props => {
  const subtext = _.filter(props.workflow.lc_data, item => {
    return item.display_type === "normal";
  });
  return (
    <div
      style={{
        color: "#000000",
        fontSize: "13px",
        letterSpacing: "-0.03px",
        lineHeight: "16px",
        opacity: 0.3
      }}
    >
      {_.size(subtext) >= 2 ? (
        <Tooltip
          title={
            <span>
              {subtext[1].label}: {ProcessLcData(subtext[1])}
            </span>
          }
        >
          <span className="t-cap">
            {subtext[1].show_label ? subtext[1].label + ": " : ""}
          </span>
          {ProcessLcData(subtext[1])}
        </Tooltip>
      ) : (
        ""
      )}
    </div>
  );
};

class HeaderOptions extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showSidebar: false,
      isWorkflowPDFModalVisible: false
    };
  }

  toggleSidebar = () => {
    this.setState({ showSidebar: !this.state.showSidebar });
  };

  getComment = (object_id, e) => {
    e.preventDefault();
    e.stopPropagation();

    this.state.loading_sidebar = true;
    this.state.object_id = object_id;
    this.props.addComment(object_id, "workflow");
  };

  toggleWorkflowPDFModal = () => {
    this.setState(state => ({
      isWorkflowPDFModalVisible: !state.isWorkflowPDFModalVisible
    }));
  };

  render = () => {
    const props = this.props;

    let selected_flag = null;
    if (_.size(props.workflow.selected_flag)) {
      selected_flag = props.workflow.selected_flag[props.workflow.id];
    }
    const that = this;
    const { workflow } = this.props;

    const statusLabel =
      this.props.workflow.status.label ||
      this.props.workflow.status.kind_display;

    const status = (
      <Tooltip title={statusLabel} placement="topRight">
        <div className="pd-left-sm status-text text-black t-12 text-right text-ellipsis">
          {statusLabel}
        </div>
      </Tooltip>
    );

    const showComment =
      props.showCommentIcon && props.isEmbedded && workflow.comments_allowed;

    const adjudicateText =
      selected_flag && props.isEmbedded
        ? selected_flag.flag_detail.label
        : "Adjudicate";

    const adjudicateTooltip =
      selected_flag && props.isEmbedded
        ? selected_flag.reason_code
        : "Adjudicate";

    const adjBtnColor = selected_flag
      ? selected_flag.flag_detail.extra.color
      : "";

    return (
      <Row>
        <Col
          span={
            props.showCommentIcon &&
            props.isEmbedded &&
            workflow.comments_allowed
              ? 8
              : 24
          }
          style={{ lineHeight: "33px" }}
        >
          {status}
        </Col>

        {props.isEmbedded ? (
          <Col span={16} className="text-right">
            {showComment ? (
              <span
                title="Adjudicate"
                className="add_comment_btn text-ellipsis"
              >
                <Tooltip title={adjudicateTooltip}>
                  <span
                    className="ant-btn ant-btn-primary btn-o btn-sm text-ellipsis"
                    style={{ color: adjBtnColor, borderColor: adjBtnColor }}
                    onClick={that.getComment.bind(that, props.workflow.id)}
                  >
                    {adjudicateText}
                  </span>
                </Tooltip>
              </span>
            ) : null}
          </Col>
        ) : null}
      </Row>
    );
  };
}

export class GetMergedData extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      expanded: false
    };
  }

  toggleExpand = e => {
    e.preventDefault();
    e.stopPropagation();
    this.setState({ expanded: !this.state.expanded });
  };

  render() {
    const data = this.props.workflow.lc_data;

    const alert_data = _.map(this.props.workflow.alerts, function(alert) {
      const alertReduced = {
        display_type: "alert",
        label: alert.alert.category.name,
        link:
          "/workflows/instances/" +
          alert.workflow +
          "/" +
          "?group=" +
          alert.step_group +
          "&step=" +
          alert.step,
        color: alert.alert.category.color_label
      };
      return alertReduced;
    });

    _.forEach(data, function(v) {
      if (v.display_type === "alert" && v.value) {
        alert_data.push(v);
      }
    });

    const lc_data = _.filter(data, function(v) {
      return v.display_type === "normal";
    });

    const lc_data_filtered = _.filter(lc_data, function(v, index) {
      return v.value && index > 1;
    });

    const that = this;

    const expander = data => {
      const count = 2;
      if (_.size(data) > count) {
        return (
          <span
            className="ant-tag v-tag pd-right "
            onClick={this.toggleExpand}
            style={{ background: "#B2B2B2", color: "#fff" }}
          >
            {this.state.expanded ? "-" : "+"}
            {_.size(data) - count}
          </span>
        );
      } else {
        return;
      }
    };

    const TagItem = (item, index, is_alert) => {
      let classes = "  t-12 text-middle text-light ";
      if (is_alert) {
        classes += " ant-tag v-tag pd-right";
      } else {
        classes += " pd-right-lg";
      }
      const tagLabel = (
        <span>
          <span
            className={" ellip-small text-middle "}
            style={{
              maxWidth: "100%",
              whiteSpace: "normal",
              wordBreak: "break-word",
              overflow: "hidden",
              whiteSpace: "nowrap"
            }}
          >
            <span className="t-cap">
              {item.show_label || (is_alert && item.link) ? item.label : ""}
              {item.link ? "" : item.show_label ? ": " : ""}
            </span>
            {ProcessLcData(item, is_alert) || ""}
          </span>
        </span>
      );

      let tagWrapper = null;

      if (item.link) {
        tagWrapper = (
          <Link
            to={item.link}
            className={classes}
            style={
              is_alert && item.color
                ? {
                    background: item.color,
                    color: "#fff"
                  }
                : {}
            }
          >
            {tagLabel}
          </Link>
        );
      } else {
        tagWrapper = (
          <span
            className={classes}
            style={
              is_alert && item.color
                ? {
                    background: item.color,
                    color: "#fff"
                  }
                : {}
            }
          >
            {tagLabel}
          </span>
        );
      }

      return (
        <Tooltip
          key={`${index}`}
          title={item.label + ": " + (item.value || "")}
        >
          {tagWrapper}
        </Tooltip>
      );
    };

    return (
      <div className="group-overviewl">
        <div className="overflow-wrapper">
          <div className="step-ui">
            <Row type="flex" align="middle">
              {_.size(alert_data)
                ? _.map(alert_data, function(item, index) {
                    const count = index + 1;
                    if (count < 3) {
                      return TagItem(item, index, true);
                    } else if (that.state.expanded) {
                      return TagItem(item, index, true);
                    }
                  })
                : _.map(lc_data_filtered, function(item, index) {
                    const count = index + 1;
                    if (count < 2) {
                      return TagItem(item, index, false);
                    }
                  })}
              {expander(alert_data)}
            </Row>
          </div>
        </div>
      </div>
    );
  }
}

const getScoreColor = riskValue => {
  const value = parseInt(riskValue, 10);
  if (value >= 7) {
    return "green";
  } else if (value >= 4 && value <= 6) {
    return "yellow";
  } else if (value <= 3) {
    return "red";
  } else {
    return "light";
  }
};
