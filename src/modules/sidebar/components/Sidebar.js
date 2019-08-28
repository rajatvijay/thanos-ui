import React, { Component } from "react";
import { Layout } from "antd";
import TaskQueueList from "./TaskQueueList";
import AlertList from "./AlertList";
import {
  workflowFiltersActions,
  workflowKindActions
} from "../../../js/actions";
import { connect } from "react-redux";
import { css } from "emotion";
import _ from "lodash";
import { taskQueueCount } from "../sidebarActions";
import { injectIntl } from "react-intl";
import FilterDropdown from "../../../js/components/WorkflowDetails/FilterDropdown";

const { Sider } = Layout;

//sample data for now
const field_tags_for_filter = [
  {
    attachment: null,
    body: "CAR PDF",
    body_de: "",
    body_en: "CAR PDF",
    body_es: "",
    body_es_419: "",
    body_es_cl: "",
    body_fr: "",
    body_fr_ca: "",
    body_ind: "",
    body_ja: "",
    body_ko: "",
    body_ms: "",
    body_pt: "",
    body_ru: "",
    body_th: "",
    body_vi: "",
    body_zh_cn: "",
    body_zh_tw: "",
    created_at: "2019-08-20T13:02:10.945239Z",
    data_json_path: "",
    default_value: "",
    disabled: true,
    ext_is_required: false,
    external_tag: null,
    extra: {},
    extra_de: {},
    extra_en: {},
    extra_es: {},
    extra_es_419: {},
    extra_es_cl: {},
    extra_fr: {},
    extra_fr_ca: {},
    extra_ind: {},
    extra_ja: {},
    extra_ko: {},
    extra_ms: {},
    extra_pt: {},
    extra_ru: {},
    extra_th: {},
    extra_vi: {},
    extra_zh_cn: {},
    extra_zh_tw: {},
    field_type: "text",
    help_text: "",
    help_text_de: "",
    help_text_en: "",
    help_text_es: "",
    help_text_es_419: "",
    help_text_es_cl: "",
    help_text_fr: "",
    help_text_fr_ca: "",
    help_text_ind: "",
    help_text_ja: "",
    help_text_ko: "",
    help_text_ms: "",
    help_text_pt: "",
    help_text_ru: "",
    help_text_th: "",
    help_text_vi: "",
    help_text_zh_cn: "",
    help_text_zh_tw: "",
    hidden: true,
    id: 3472856,
    is_encrypted: false,
    is_filterable: true,
    is_required: false,
    jmes_path: "",
    log_on_change: false,
    meta: {},
    model_field_name: null,
    order: 10,
    parent_json_field: null,
    regex_error: "",
    regex_value: "",
    required_on_step_submit: false,
    search_param_json: {},
    size: 1,
    source_csv_json: {},
    source_mapping: null,
    step: 101308,
    tag: "workflow_pdf",
    target_transliterate_field: "",
    transliterate: false,
    transliterate_lang_field: "",
    transliterate_on_change: "",
    updated_at: "2019-08-20T13:02:13.062099Z",
    validation_type: "",
    workflow_mapping: null,
    workflowdef: 3798
  }
];

class Sidebar extends Component {
  state = {
    activeFilter: [],
    parent: null,
    collapse: true
  };

  componentDidMount() {
    this.props.taskQueueCount();
  }

  setFilter = () => {
    const payload = {
      filterType: "alert_category",
      filterValue: this.state.activeFilter
    };
    this.props.dispatch(workflowFiltersActions.setFilters(payload));
  };

  componentDidUpdate(prevProps) {
    const { workflowKind, selectedKindValue } = this.props;
    const { workflowKind: prevWorkflowKind } = prevProps;

    if (workflowKind.workflowKind && !prevWorkflowKind.workflowKind) {
      // So, we just got workflow kinds populated.
      // Now, we'll check if there's no selected workflow kind
      // Or if the one selected is not available anymore,
      // in which case, we'll assign a default one.
      if (
        !selectedKindValue ||
        !workflowKind.workflowKind.find(
          workflow => workflow.id === selectedKindValue.id
        )
      ) {
        this.props.dispatch(
          workflowKindActions.setValue(workflowKind.workflowKind[0])
        );
      }
    }
  }

  onSelectAlert = value => {
    if (this.state.activeFilter[0] === value.tag) {
      this.setState({ activeFilter: [] }, function() {
        this.setFilter();
      });
    } else {
      this.setState({ activeFilter: [value.tag] }, function() {
        this.setFilter();
      });
    }
  };

  onSelectTask = value => {
    const payload = {
      filterType: "stepgroupdef",
      filterValue: value ? [value.id] : []
    };
    if (!!value)
      this.props.dispatch(workflowFiltersActions.setFilters(payload));
    else this.props.dispatch(workflowFiltersActions.removeFilters(payload));
  };

  onSelectMyTask = tag => {
    const payload = {
      filterType: "user-step-tag",
      filterValue: tag ? [tag] : []
    };
    this.props.dispatch(workflowFiltersActions.setFilters(payload));
  };

  get isMyTaskSelected() {
    return (
      this.props.workflowFilters["user-step-tag"] &&
      this.props.workflowFilters["user-step-tag"].filterValue &&
      this.props.workflowFilters["user-step-tag"].filterValue.length &&
      this.props.workflowFilters["user-step-tag"].filterValue.includes(
        "Assignee"
      )
    );
  }

  render() {
    const { isError } = this.props.workflowAlertGroupCount;

    return (
      <Sider
        width={300}
        style={{
          overflow: "auto",
          height: "100vh",
          left: 0,
          backgroundColor: "#104774"
        }}
      >
        <div
          className={css`
            width: 300px;
            padding-bottom: 100px;
            height: 100%;
            fontfamily: Cabin;
            min-height: 110vh;
            background: #104775;
          `}
        >
          <div className="logo" />

          <FilterDropdown fieldTags={field_tags_for_filter} />

          <div
            style={{
              backgroundColor: "#104774",
              padding: "5px 0px",
              maxHeight: "80vh",
              overflowY: "scroll"
            }}
            className={css`
              .sidebarList:hover {
                opacity: 0.4;
              }
            `}
          >
            <div>
              <TaskQueueList
                count={this.props.count}
                activeTaskQueue={this.props.workflowFilters}
                taskQueues={this.props.workflowGroupCount.stepgroupdef_counts}
                loading={this.props.workflowAlertGroupCount.loading}
                onSelectTask={this.onSelectTask}
                onSelectMyTask={this.onSelectMyTask}
                isMyTaskSelected={this.isMyTaskSelected}
              />
            </div>

            <div style={{ display: isError ? "none" : "block" }}>
              <AlertList
                alerts={this.props.workflowAlertGroupCount.alert_details}
                loading={this.props.workflowAlertGroupCount.loading}
                onSelectAlert={this.onSelectAlert}
              />
            </div>
          </div>
        </div>
      </Sider>
    );
  }
}

function mapStateToProps(state) {
  const {
    workflowKind,
    workflowFilterType,
    workflowFilters,
    workflowKindValue,
    config,
    languageSelector,
    showFilterMenu,
    taskQueueCount
  } = state;
  return {
    workflowKind,
    workflowFilterType,
    workflowFilters,
    selectedKindValue: workflowKindValue.selectedKindValue,
    config,
    languageSelector,
    showFilterMenu,
    count: taskQueueCount.count
  };
}

export default connect(
  mapStateToProps,
  { taskQueueCount }
)(injectIntl(Sidebar));
