import { history } from "../_helpers";

export const goToPrevStep = () => {
  let customHistory = JSON.parse(localStorage.getItem("customHistory"));
  let histObj = customHistory.pop();
  let url = `${histObj.pathname}${histObj.search}&backing=true`;
  history.push(url);
};
