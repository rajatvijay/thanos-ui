import React from "react";
import { Modal, Checkbox, Button, Icon } from "antd";
import { css } from "emotion";
import { get as lodashObjectGet, set as lodashObjectSet } from "lodash";
import {
  submitWorkflows,
  fetchWorkflowDetails
} from "../../services/workflowPdfApi";
import { FormattedMessage } from "react-intl";
import styled from "@emotion/styled";
import showNotification from "../../../modules/common/notification";

const META_INFO = [
  {
    value: "include_flags",
    label: "workflowsInstances.flagsText"
  },
  {
    value: "include_comments",
    label: "workflowsInstances.commentsText"
  },
  {
    value: "include_archived_related_workflows",
    label: "workflowsInstances.relatedWorkflowsText"
  }
];

class PDFChecklistModal extends React.Component {
  state = {
    pdfConfig: null,
    loading: false,
    error: false,
    tickMarkAtleastOne: false,
    selectAll: false,
    userSelection: {}
  };

  componentDidMount = () => {
    this.fetchWorkflowDetails();
  };

  getUserSelectionObjectPath = (parentTag, workflowType) => {
    if (["PARENT_WORKFLOW", "STATIC_SECTIONS", "META"].includes(workflowType)) {
      return parentTag;
    } else {
      return `childWorkflow.${parentTag}`;
    }
  };

  onSelectWorkflow = (tag, parentTag, workflowType, e) => {
    const { checked } = e.target;
    const path = this.getUserSelectionObjectPath(parentTag, workflowType);

    this.setState(state => {
      lodashObjectSet(state.userSelection, path + "." + tag, checked);
      return {
        userSelection: state.userSelection,
        selectAll: !checked ? false : state.selectAll,
        tickMarkAtleastOne: false
      };
    });
  };

  toggleSelectAll = event => {
    if (this.state.error || !this.hasResults) return;

    const checked = event
      ? lodashObjectGet(event, "target.checked", false)
      : true;

    const results = this.state.pdfConfig.results[0];
    const parentWorkflowSteps = lodashObjectGet(
      results,
      "parent_workflows.steps",
      []
    );
    const childWorkflows = lodashObjectGet(results, "child_workflows", []);
    const staticSections = lodashObjectGet(results, "extra_sections", []);

    const userSelection = {};

    parentWorkflowSteps.forEach(step => {
      lodashObjectSet(userSelection, "parentWorkflow." + step.value, checked);
    });

    childWorkflows.forEach(workflow => {
      workflow.steps.forEach(step => {
        lodashObjectSet(
          userSelection,
          "childWorkflow." + workflow.value + "." + step.value,
          checked
        );
      });
    });

    staticSections.forEach(section => {
      lodashObjectSet(
        userSelection,
        "staticSections." + section.value,
        checked
      );
    });

    META_INFO.forEach(meta => {
      lodashObjectSet(userSelection, "meta." + meta.value, checked);
    });

    this.setState({
      userSelection,
      selectAll: checked,
      tickMarkAtleastOne: !checked
    });
  };

  handleOk = () => {
    this.props.handleModalVisibility(true);
  };

  handleCancel = () => {
    this.props.handleModalVisibility(false);
  };

  setLoading = loading => this.setState({ loading });

  validateSelection = userSelection => {
    const {
      parent_steps_to_print,
      extra_sections,
      child_steps_to_print
    } = userSelection;

    const childSteps = child_steps_to_print
      ? Object.values(child_steps_to_print).filter(child => child.length)
      : [];

    if (
      !parent_steps_to_print.length ||
      !childSteps.length ||
      !extra_sections.length
    ) {
      this.setState({ tickMarkAtleastOne: true });
      return true;
    }
  };

  preparePayload = () => {
    const payload = {};
    const { userSelection } = this.state;
    if (userSelection.parentWorkflow) {
      const data = [];
      Object.entries(userSelection.parentWorkflow).forEach(([key, value]) => {
        if (value) data.push(key);
      });
      payload.parent_steps_to_print = data;
    }

    if (userSelection.staticSections) {
      const data = [];
      Object.entries(userSelection.staticSections).forEach(([key, value]) => {
        if (value) data.push(key);
      });
      payload.extra_sections = data;
    }

    if (userSelection.childWorkflow) {
      payload.child_steps_to_print = {};
      Object.keys(userSelection.childWorkflow).forEach(workflowTag => {
        const data = [];
        Object.entries(userSelection.childWorkflow[workflowTag]).forEach(
          ([key, value]) => {
            if (value) data.push(key);
          }
        );
        payload.child_steps_to_print[workflowTag] = data;
      });
    }

    META_INFO.forEach(item => {
      payload[item.value] = lodashObjectGet(
        userSelection,
        "meta." + item.value,
        false
      );
    });

    return payload;
  };

  handleSubmit = () => {
    const preparedData = this.preparePayload();
    if (this.validateSelection(preparedData)) return;

    const { workflowId } = this.props;
    const { config_id: configId } = this.state.pdfConfig.results[0];
    const body = {
      config_id: configId,
      workflow_id: workflowId,
      ...preparedData
    };

    this.setLoading(true);
    submitWorkflows(body)
      .then(response => {
        if (!response.ok) {
          this.setLoading(false);
          showNotification({
            type: "error",
            message: "notificationInstances.asyncActionFail"
          });
        } else {
          this.handleCancel();
          this.setLoading(false);
          showNotification({
            type: "success",
            message: "notificationInstances.asyncActionSuccess"
          });
        }
        return;
      })
      .catch(() => {
        this.setLoading(false);
        showNotification({
          type: "error",
          message: "notificationInstances.networkError",
          description: "notificationInstances.networkErrorDescription"
        });
      });
  };

  fetchWorkflowDetails = () => {
    const { definition } = this.props;
    // TODO: Remove this hardcoding also
    const stepTag = "pdf_modal";
    const definitionId = definition.workflowdef;
    this.setLoading(true);
    fetchWorkflowDetails(stepTag, definitionId)
      .then(workflow => {
        this.setState(
          {
            // pdfConfig: WORKFLOW_DATA,
            pdfConfig: workflow,
            error: false,
            loading: false
          },
          () => {
            this.toggleSelectAll();
          }
        );
      })
      .catch(() => {
        this.setState({
          error: true,
          loading: false
        });
      });
  };

  renderParentWorkflow = steps => (
    <CheckboxGroup
      items={steps}
      selected={lodashObjectGet(this.state.userSelection, "parentWorkflow", {})}
      onChange={this.onSelectWorkflow}
      parentTag="parentWorkflow"
      workflowType="PARENT_WORKFLOW"
    />
  );

  renderChildWorkflow = workflows => {
    if (!workflows) return null;
    return (
      <div
        className={css`
          width: 100%;
          margin-top: 35px;
        `}
      >
        <h2 style={{ fontSize: 18 }}>
          <FormattedMessage id="workflowsInstances.childWorkflows" />
        </h2>
        <div
          className={css`
            white-space: nowrap;
            overflow-x: scroll;
            display: flex;
            padding-bottom: 20px;
          `}
        >
          {workflows.map((workflow, key) => {
            return (
              <div
                key={key}
                className={css`
                  display: flex;
                  flex-direction: column;
                  width: 50%;
                  margin-top: 20px;
                `}
              >
                <h2 style={{ fontSize: 18 }}>{workflow.label}</h2>
                <CheckboxGroup
                  items={workflow.steps}
                  selected={lodashObjectGet(
                    this.state.userSelection,
                    "childWorkflow." + workflow.value,
                    {}
                  )}
                  onChange={this.onSelectWorkflow}
                  parentTag={workflow.value}
                  workflowType="CHILD_WORKFLOW"
                />
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  renderStaticWorkflow = sections => (
    <CheckboxGroup
      items={sections}
      selected={lodashObjectGet(this.state.userSelection, "staticSections", {})}
      onChange={this.onSelectWorkflow}
      parentTag="staticSections"
      workflowType="STATIC_SECTIONS"
    />
  );

  renderMetaInformation = () => (
    <CheckboxGroup
      items={META_INFO}
      selected={lodashObjectGet(this.state.userSelection, "meta", {})}
      onChange={this.onSelectWorkflow}
      parentTag="meta"
      workflowType="META"
      renderLabel={label => <FormattedMessage id={label} />}
      className={css`
        width: 33%;
      `}
    />
  );

  renderFetchFailPlaceholder = () => {
    return (
      <div className="mr-top-lg text-center text-bold text-metal">
        <FormattedMessage id="errorMessageInstances.noWorkflowDetails" />
        <div
          className={css`
            margin-top: 15px;
            cursor: pointer;
          `}
          onClick={this.fetchWorkflowDetails}
        >
          <FormattedMessage
            className="mr-bottom-lg"
            id="commonTextInstances.reloadWorkflowDetails"
          />
          <Icon type="reload" style={{ marginLeft: "5px" }} />
        </div>
      </div>
    );
  };

  renderWorkflowDetails = () => {
    const { pdfConfig } = this.state;

    return (
      <div style={{ margin: "0px 35px" }}>
        <h2 style={{ fontSize: 18 }}>
          <FormattedMessage id="workflowsInstances.parentWorkflow" />:{" "}
          {pdfConfig.results[0].parent_workflows.label}
        </h2>
        {this.renderParentWorkflow(pdfConfig.results[0].parent_workflows.steps)}
        <div
          className={css`
            display: flex;
            flex-direction: row;
            flex-wrap: wrap;
            margin-top: 30px;
            width: 100%;
          `}
        >
          {this.renderChildWorkflow(pdfConfig.results[0].child_workflows)}
        </div>
        <div
          className={css`
            margin-top: 30px;
          `}
        >
          <h2 style={{ fontSize: 18 }}>
            <FormattedMessage id="workflowsInstances.staticSection" />
          </h2>
          {this.renderStaticWorkflow(pdfConfig.results[0].extra_sections)}
        </div>
        <div
          className={css`
            margin-top: 30px;
            display: flex;
            width: 100%;
          `}
        >
          {this.renderMetaInformation()}
        </div>
      </div>
    );
  };

  renderEmptyDataMessage = () => {
    return (
      <div className="mr-top-lg text-center text-bold text-metal">
        <FormattedMessage id="errorMessageInstances.resultIsEmpty" />
      </div>
    );
  };

  renderModalContent = () => {
    const { pdfConfig, error } = this.state;

    return error
      ? this.renderFetchFailPlaceholder()
      : !!pdfConfig
      ? !this.hasResults
        ? this.renderEmptyDataMessage()
        : this.renderWorkflowDetails()
      : null;
  };

  get hasResults() {
    const { pdfConfig } = this.state;
    return !!(
      pdfConfig &&
      Array.isArray(pdfConfig.results) &&
      pdfConfig.results.length
    );
  }

  renderFooter = () => {
    const { loading, tickMarkAtleastOne, error } = this.state;

    if (!error && this.hasResults) {
      return [
        <div
          key="footer"
          className={css`
            display: flex;
            flex-direction: row;
            padding-top: 12px;
            padding-bottom: 12px;
            .ant-btn-primary:focus,
            .ant-btn-primary:hover,
            .ant-btn-primary:active {
              background-color: #025fb5;
              border-color: #025fb5;
            }
          `}
        >
          <div
            className={css`
              flex: 1;
              align-items: center;
              display: flex;
            `}
          >
            <StyledCheckbox
              checked={this.state.selectAll}
              onChange={this.toggleSelectAll}
            >
              <FormattedMessage id="commonTextInstances.selectAll" />
            </StyledCheckbox>
          </div>
          <div
            className={css`
              display: flex;
              align-items: center;
            `}
          >
            {tickMarkAtleastOne ? (
              <span
                className={css`
                  margin-right: 10px;
                  color: red;
                `}
              >
                &#9432;{" "}
                <FormattedMessage id="errorMessageInstances.selectAtLeastOneCategory" />
              </span>
            ) : null}
            <Button
              loading={loading}
              onClick={this.handleSubmit}
              type="primary"
            >
              <FormattedMessage id="commonTextInstances.submitButtonText" />
            </Button>
          </div>
        </div>
      ];
    } else {
      return null;
    }
  };

  render = () => {
    const { visible } = this.props;
    return (
      <Modal
        bodyStyle={{ padding: "30px 0px", maxHeight: 530, overflowY: "auto" }}
        width="77vw"
        destroyOnClose={true}
        visible={visible}
        onOk={this.handleOk}
        onCancel={this.handleCancel}
        className="workflow-modal"
        footer={this.renderFooter()}
      >
        <div style={{ borderRadius: 5 }}>
          <div
            style={{
              background: "white"
            }}
          >
            {this.renderModalContent()}
          </div>
        </div>
      </Modal>
    );
  };
}

export default PDFChecklistModal;

/**
 * CheckboxGroup renders a group of checkboxes
 * using an Array source, where each element has it's own
 * label and value.
 *
 * @param {Array} items [{label, value}]
 * @param {object} selected Key should be item.value and it's value should be boolean
 * @param {Function} onChage Handler for on Change event with parameters as: item.value, parentTag, workflowType, event
 * @param {string} parentTag
 * @param {string} workflowType
 * @param {Function} renderLabel To be used to map label into some other string or component
 *
 * @returns {React.DetailedReactHTMLElement<any, HTMLElement>[]}
 */
const CheckboxGroup = ({
  items,
  selected,
  onChange,
  parentTag,
  workflowType,
  renderLabel,
  ...otherProps
}) =>
  !items
    ? null
    : items.map(item => (
        <StyledCheckbox
          key={item.value}
          checked={lodashObjectGet(selected, item.value, false)}
          onChange={onChange.bind(null, item.value, parentTag, workflowType)}
          {...otherProps}
        >
          {renderLabel && renderLabel.apply
            ? renderLabel(item.label)
            : item.label}
        </StyledCheckbox>
      ));

const StyledCheckbox = styled(Checkbox)`
  font-size: 17px;
  margin-left: 10px;
  margin-top: 3px;
`;
