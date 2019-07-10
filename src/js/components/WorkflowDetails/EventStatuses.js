export const event_status = {
  //backward compatiblility
  open: { label: "Open", class: "red" },
  closed: { label: "Closed", class: "green" },
  //new statuses
  in_progress: { label: "In Progress", class: "blue" },
  reviewed: { label: "Reviewed", class: "green" },
  not_reviewed: { label: "Not Reviewed", class: "grey" }
};

export const status_filters = [
  { text: "In Progress", value: "in_progress" },
  { text: "Reviewed", value: "reviewed" },
  { text: "Not Reviewed", value: "not_reviewed" }
];
