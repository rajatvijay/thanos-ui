// TODO: Tree shake
import moment from "moment";
import { FILTERS_ENUM } from "./constants";

export const getOccurrenceDay = occurrence => {
  const today = moment().startOf("day");
  const thisWeek = moment().startOf("week");
  const thisMonth = moment().startOf("month");

  if (moment(occurrence.created_at).isAfter(today)) {
    return "commonTextInstances.today";
  }
  if (moment(occurrence.created_at).isAfter(thisWeek)) {
    return "commonTextInstances.thisWeek";
  }
  if (moment(occurrence.created_at).isAfter(thisMonth)) {
    return "commonTextInstances.thisMonth";
  }
  return moment(occurrence.created_at).format("MMM");
};

// Private function to get Rank
const getRank = ({ page, index, count, isAscending }) => {
  console.log("getRank", page, index, count, isAscending);
  if (isAscending) {
    return (page - 1) * 20 + index + 1;
  } else {
    return count - (page - 1) * 20 - index;
  }
};

export const appendRankInWorkflowItem = (
  { results: workflows = [], next, count, ...rest },
  filterParams
) => {
  if (!Array.isArray(workflows)) {
    console.warn(
      `appendRankInWorkflowItem: Expected an array recieved ${typeof workflows}`
    );
    return workflows;
  }

  const page = filterParams[FILTERS_ENUM.PAGE_FILTER.key] || 1;
  const sortingOrder = filterParams[FILTERS_ENUM.ORDERING_FILTER.key];
  console.log("appendRankInWorkflowItem", page, sortingOrder);
  const workflowWithRank = workflows.map((workflow, index) => ({
    ...workflow,
    rank: sortingOrder
      ? getRank({
          page,
          index,
          count,
          isAscending: !sortingOrder.startsWith("-")
        })
      : null
  }));
  return {
    next,
    count,
    results: workflowWithRank,
    ...rest
  };
};
