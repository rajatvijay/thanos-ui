export const MODULE_NAME = "WORKFLOW_LIST";
export const MY_TASK_FILTER_NAME = "user-step-tag";
export const STATUS_FILTER_NAME = "status";
export const REGION_FILTER_NAME = "region";
export const BUSINESS_UNIT_FILTER_NAME = "business_unit";
export const TASK_QUEUE_FILTER_NAME = "stepgroupdef";
export const ALERTS_FILTER_NAME = "alerts"; // TODO: Add this
export const KIND_FILTER_NAME = "kind";
export const PRIMARY_KEY_SORTING_FILTER_NAME = "ordering";
export const PAGE_FILTER_NAME = "page";
// export const ADVANCED_FILTER_NAME = "answer";
export const FIELD_ANSWER_PARAM = "answer";

export const WORKLFOW_ASC_SORT_PARAM = "sorting_primary_field";
export const WORKLFOW_DESC_SORT_PARAM = "-sorting_primary_field";

export const FILTERS_ENUM = {
  KIND_FILTER: { key: "kind", name: "KIND_FILTER" },
  MY_TASK_FILTER: { key: "user-step-tag", name: "MY_TASK_FILTER" },
  TASK_QUEUE_FILTER: { key: "stepgroupdef", name: "TASK_QUEUE_FILTER" },
  ALERT_FILTER: { key: "alerts", name: "ALERT_FILTER" },
  STATUS_FILTER: { key: "status", name: "STATUS_FILTER" },
  REGION_FILTER: { key: "region", name: "REGION_FILTER" },
  BUSINESS_UNIT_FILTER: { key: "business_unit", name: "BUSINESS_UNIT_FILTER" },
  PAGE_FILTER: { key: "page", name: "PAGE_FILTER" },
  FIELD_ANSWER_FILTER: { key: "answer", name: "FIELD_ANSWER_FILTER" },
  ADVANCED_FILTER: { key: "answer", name: "ADVANCED_FILTER" },
  ORDERING_FILTER: { key: "ordering", name: "ORDERING_FILTER" }
};
