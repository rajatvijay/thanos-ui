import { notification } from "antd";

const openNotificationWithIcon = data => {
  notification[data.type]({
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
  localStorage.clear();
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
