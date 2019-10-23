import Godaam from "./storage";
import showNotification from "../../modules/common/notification";

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

const postLogoutAction = ({ addNextURL = false, redirectURL = "" } = {}) => {
  Godaam.clear();
  removeCookies();
  if (redirectURL) {
    // In case of SSO, we get a redirect URL, that needs to be hit to ensure
    // user is logged out from the IdP as well.
    showNotification({
      type: "warning",
      message: "notificationInstances.loggedOutSSO"
    });
    window.location.href = redirectURL;
  } else {
    showNotification({
      type: "warning",
      message: "notificationInstances.loggedOut"
    });
    const newURL = addNextURL
      ? `/login/?next=${new URL(window.location.href).pathname}`
      : `/login/`;
    setTimeout(() => {
      window.location.href = newURL;
    }, 1000);
  }
};

export const userUtilities = {
  postLogoutAction
};
