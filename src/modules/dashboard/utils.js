// TODO: Tree shake
import moment from "moment";

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

export const appendRankInWorkflowItem = ({
  results: workflows = [],
  next,
  count,
  ...rest
}) => {
  if (!Array.isArray(workflows)) {
    console.warn(
      `appendRankInWorkflowItem: Expected an array recieved ${typeof workflows}`
    );
    return workflows;
  }

  const nextURL = new URL(next);
  const page = nextURL.searchParams.get("page") - 1 || 0; // Using 1 as the default page
  const sortingOrder = nextURL.searchParams.get("ordering");
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
