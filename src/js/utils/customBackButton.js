import { history } from "../_helpers";
import Godaam from "./storage";

export const goToPrevStep = () => {
  const customHistory = JSON.parse(Godaam.customHistory);
  const histObj = customHistory.pop();

  const url = `${histObj.pathname}${histObj.search}`;

  history.push(url);
};
