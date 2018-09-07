export const veryfiyClient = csrf => {
  let currentCookie = document.cookie;
  let storedCookie = csrf;
  let verified = false;

  if (currentCookie === storedCookie) {
    return true;
  } else {
    return false;
  }
};
