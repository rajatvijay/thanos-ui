export const veryfiyClient = csrf => {
  const currentCookie = document.cookie;
  const storedCookie = csrf;

  if (currentCookie === storedCookie) {
    return true;
  } else {
    return false;
  }
};
