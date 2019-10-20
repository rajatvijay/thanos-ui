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
