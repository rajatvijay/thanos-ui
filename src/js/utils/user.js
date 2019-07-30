import { notification } from "antd";
import Godaam from "./storage";

const openNotificationWithIcon = data => {
  notification[data.type]({
    key: "logoutNotification", // Ensure only single instance of notification exists
    message: data.message,
    description: data.body,
    placement: "bottomLeft"
  });
};

const removeCookies = () => {
  const expireCookie = key => {
    document.cookie = key + " =; expires = Thu, 01 Jan 1970 00:00:00 UTC";
  };

  const cookies = document.cookie;
  const splitCookies = cookies.split(";");
  for (let i = 0; i < splitCookies.length; i++) {
    const key = splitCookies[i].split("=");
    expireCookie(key[0]);
  }
};

const postLogoutAction = ({ addNextURL = false } = {}) => {
  Godaam.clear();
  removeCookies();
  openNotificationWithIcon({
    type: "warning",
    message: "You've been logged out, redirecting to login page.."
  });
  const newURL = addNextURL
    ? `/login/?next=${new URL(window.location.href).pathname}`
    : `/login/`;
  setTimeout(() => {
    window.location.href = newURL;
  }, 1000);
};

export const userUtilities = {
  postLogoutAction
};
