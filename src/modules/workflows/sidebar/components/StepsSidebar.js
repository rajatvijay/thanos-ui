import React, { Component } from "react";
import { Tooltip, Collapse } from "antd";
import { css } from "emotion";
import { get as lodashGet } from "lodash";
import { StyledCollapseItem, StyledCollapse } from "../styledComponents";

import { getIntlBody } from "../../../../js/_helpers/intl-helpers";
import ColoredCount from "../../../../js/components/common/coloredCount";

const { Panel } = Collapse;

// TODO: SelectedPanelId flow needs to be refactored
class StepsSideBar extends Component {
  renderStepGroupIcon(stepGroup) {
    const allStepsCompleted = !stepGroup.steps.find(step => !step.completed_by);
    const isOverdue = stepGroup.overdue;

    if (allStepsCompleted) {
      return (
        <i
          className="material-icons t-24 pd-right-sm anticon anticon-check-circle"
          style={{ color: "#00C89B" }}
        >
          check_circle
        </i>
      );
    }

    if (isOverdue) {
      return (
        <Tooltip title="Overdue">
          <i
            className="material-icons t-24 pd-right-sm anticon anticon-check-circle"
            style={{ color: "#d40000" }}
          >
            alarm
          </i>
        </Tooltip>
      );
    }

    return (
      <i
        className="material-icons t-24 pd-right-sm anticon anticon-check-circle"
        style={{ color: "#CCCCCC" }}
      >
        panorama_fish_eye
      </i>
    );
  }
  renderStepsCountStatus(stepGroup) {
    return (
      <span
        className={css`
          font-weight: 500;
          font-size: 14px;
          opacity: 0.2;
          color: #000000;
          letter-spacing: -0.03px;
          line-height: 18px;
        `}
      >
        {stepGroup.steps.filter(step => step.completed_by).length}/
        {stepGroup.steps.length}
      </span>
    );
  }
  renderAlertsCount = data => {
    const hasAlerts = !!lodashGet(data, "alerts.length", 0);
    if (hasAlerts) {
      const { count, color } = this.getAlertInfo(data);
      return <ColoredCount text={count} color={color} />;
    }
    return null;
  };

  getAlertInfo(stepGroup) {
    return {
      count: stepGroup.alerts.length,
      color: stepGroup.alerts[0].alert.category.color_label
    };
  }

  isSelectedStepGroup = stepGroup => {
    const { selectedPanelId } = this.props;
    return Number(stepGroup.id) === Number(selectedPanelId);
  };

  renderStepGroup(stepGroup) {
    return (
      <div
        className={css`
          display: flex;
          align-items: center;
          justify-content: space-between;
          background-color: transparent;
          margin-left: -14px;
        `}
      >
        <span
          className={css`
            display: flex;
            align-items: center;
            font-weight: 500;
            font-size: 14;
          `}
        >
          {this.renderStepGroupIcon(stepGroup)}

          {getIntlBody(stepGroup.definition, "name")}
        </span>
        <div>
          {this.isSelectedStepGroup(stepGroup) ? null : (
            <span style={{ marginRight: 5 }}>
              {this.renderAlertsCount(stepGroup)}
            </span>
          )}
          {this.renderStepsCountStatus(stepGroup)}
        </div>
      </div>
    );
  }

  isStepSelected = step => {
    const { selectedStep } = this.props;
    // eslint-disable-next-line
    return selectedStep == step.id;
  };

  isStepOverdue = step => !!step.overdue;

  renderStepIcon = step => {
    const isCompleted = !!step.completed_by;
    const isSelected = this.isStepSelected(step);
    const isOverdue = this.isStepOverdue(step);
    const isLocked = step.is_locked;

    if (isLocked) {
      const selectedStyle = isSelected
        ? { color: "#ffffff" }
        : { color: "#7f7f7f" };

      return (
        <i
          data-testid="step-locked-icon"
          className="material-icons t-14 anticon pd-right-sm anticon-check-circle"
          fill="#FFF"
          style={selectedStyle}
        >
          lock
        </i>
      );
    }

    if (isCompleted) {
      return (
        <i
          className="material-icons t-14 pd-right-sm anticon anticon-check-circle"
          fill="#FFF"
          style={
            isSelected
              ? { color: "#00C89B", fontSize: 14 }
              : { color: "#00C89B" }
          }
        >
          check_circle
        </i>
      );
    }

    if (isOverdue) {
      return (
        <Tooltip title="overdue">
          {/* TODO: Refactor all the icons */}
          <i
            className="material-icons t-14 pd-right-sm anticon anticon-check-circle"
            style={{ color: "#d40000" }}
          >
            alarm
          </i>
        </Tooltip>
      );
    }

    return (
      <i
        className="material-icons t-14 pd-right-sm anticon anticon-check-circle"
        fill="#FFF"
        style={
          isSelected ? { color: "#FFFFFF", fontSize: 14 } : { color: "#CCCCCC" }
        }
      >
        {isSelected ? "lens" : "panorama_fish_eye"}
      </i>
    );
  };

  renderSteps = (step, stepGroup) => {
    const hasAlerts = !!lodashGet(step, "alerts.length", 0);
    const isSelected = this.isStepSelected(step);
    return (
      <StyledCollapseItem
        key={"step" + step.id}
        className={css`
          display: flex;
          justify-content: space-between;
        `}
        onClick={event => this.props.handleStepClick(stepGroup.id, step.id)}
        selected={isSelected}
      >
        <div>
          {this.renderStepIcon(step)}
          {step.name}
        </div>
        {hasAlerts && this.renderAlertsCount(step)}
      </StyledCollapseItem>
    );
  };

  render() {
    const { stepGroups, selectedPanelId } = this.props;
    return (
      <StyledCollapse
        // TODO: This should be handled in a better way
        activeKey={String(selectedPanelId)}
        accordion
        onChange={this.props.onChangeOfCollapse}
      >
        {stepGroups.map(stepGroup => (
          <Panel
            key={stepGroup.id}
            showArrow={false}
            header={this.renderStepGroup(stepGroup)}
          >
            {stepGroup.steps.map(step => this.renderSteps(step, stepGroup))}
          </Panel>
        ))}
      </StyledCollapse>
    );
  }
}

export default StepsSideBar;
