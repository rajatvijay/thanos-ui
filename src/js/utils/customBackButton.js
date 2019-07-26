import { history } from "../_helpers";

export const goToPrevStep = () => {
  const customHistory = JSON.parse(localStorage.getItem("customHistory"));
  const histObj = customHistory.pop();

  const url = `${histObj.pathname}${histObj.search}`;

  history.push(url);
};
