import { authHeader, baseUrl, baseUrl2 } from "../_helpers";
import { tenant } from "../../config";

export const userService = {
  login,
  loginOtp,
  tokenLogin,
  register,
  getAll,
  getById,
  update,
  delete: _delete,
  checkAuth
};

function login(username, password, token) {
  const requestOptions = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-DTS-SCHEMA": tenant !== "test" ? tenant : "vetted"
    },
    credentials: "include",
    body: JSON.stringify({ email: username, password: password, token: token })
  };
  return fetch(baseUrl + "users/login/", requestOptions)
    .then(response => {
      if (!response.ok) {
        return response.json().then(error => {
          return Promise.reject(error);
        });
      }
      return response.json();
    })
    .then(user => {
      // login successful if there's a jwt token in the response
      if (user) {
        let userData = user;
        userData.tenant = tenant;
        userData.csrf = document.cookie;
        // store user details and jwt token in local storage to keep user logged in between page refreshes
        localStorage.setItem("user", JSON.stringify(userData));
      }

      return user;
    });
}

function loginOtp(username, password) {
  const requestOptions = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-DTS-SCHEMA": tenant !== "test" ? tenant : "vetted"
    },
    credentials: "include",
    body: JSON.stringify({ email: username, token: password })
  };

  return fetch(baseUrl + "users/submit_otp/", requestOptions)
    .then(response => {
      if (!response.ok) {
        return response.json().then(error => {
          return Promise.reject(error);
        });
      }
      return response.json();
    })
    .then(user => {
      // login successful if there's a jwt token in the response
      if (user) {
        let userData = user;
        userData.tenant = tenant;
        userData.csrf = document.cookie;
        // store user details and jwt token in local storage to keep user logged in between page refreshes
        localStorage.setItem("user", JSON.stringify(userData));
      }

      return user;
    });
}

function tokenLogin(token, next) {
  console.log("tokend login service");

  const requestOptions = {
    method: "GET",
    headers: authHeader.get(),
    credentials: "same-origin",
    credentials: "include"
  };

  return fetch(
    baseUrl + "users/process_token?token=" + token + "&next=" + next,
    requestOptions
  )
    .then(response => {
      if (!response.ok) {
        return Promise.reject(response.statusText);
      }
      return response.json();
    })
    .then(user => {
      // login successful if there's a jwt token in the response
      if (user) {
        let userData = user;
        userData.tenant = tenant;
        userData.csrf = document.cookie;
        // store user details and jwt token in local storage to keep user logged in between page refreshes
        localStorage.setItem("user", JSON.stringify(userData));
      }

      return user;
    });
}

export const logout = async () => {
  localStorage.removeItem("user");
  const requestOptions = {
    method: "GET",
    headers: authHeader.get(),
    credentials: "include"
    //body: JSON.stringify({})
  };
  try {
    const response = await fetch(baseUrl + "users/logout/", requestOptions);
    return response;
  } catch (error) {
    throw error;
  }
};

export const sendEmailAuthToken = async (email, next) => {
  const requestOptions = {
    method: "POST",
    headers: authHeader.post(),
    credentials: "include",
    body: JSON.stringify({ email, next })
  };
  try {
    const response = await fetch(baseUrl + "users/magic_link/", requestOptions);
    return response;
  } catch (error) {
    throw error;
  }
};

function checkAuth() {
  const requestOptions = {
    method: "GET",
    headers: authHeader.get(),
    credentials: "same-origin",
    credentials: "include"
  };

  return fetch(baseUrl + "users/me/?format=json", requestOptions)
    .then(response => {
      if (!response.ok) {
        return Promise.reject(response.statusText);
      }
      return response.json();
    })
    .then(user => {
      // login successful if there's a jwt token in the response

      if (user) {
        let userData = user;
        userData.tenant = tenant;
        userData.csrf = document.cookie;
        // store user details and jwt token in local storage to keep user logged in between page refreshes
        localStorage.setItem("user", JSON.stringify(userData));
      }
      return user;
    });
}

function getAll() {
  const requestOptions = {
    method: "GET",
    headers: authHeader.get()
  };

  return fetch(baseUrl + "users/", requestOptions).then(handleResponse);
}

function getById(id) {
  const requestOptions = {
    method: "GET",
    headers: authHeader.get(),
    credentials: "include"
  };

  return fetch(baseUrl + "users/" + id + "/", requestOptions).then(
    handleResponse
  );
}

function register(user) {
  const requestOptions = {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(user)
  };

  return fetch("/users/register", requestOptions).then(handleResponse);
}

function update(user) {
  const requestOptions = {
    method: "PUT",
    headers: { ...authHeader.post(), "Content-Type": "application/json" },
    body: JSON.stringify(user)
  };

  return fetch(baseUrl + "users/" + user.id, requestOptions).then(
    handleResponse
  );
}

// prefixed function name with underscore because delete is a reserved word in javascript
function _delete(id) {
  const requestOptions = {
    method: "DELETE",
    headers: authHeader.post()
  };

  return fetch(baseUrl + "users/" + id, requestOptions).then(handleResponse);
}

function handleResponse(response) {
  if (!response.ok) {
    return Promise.reject(response.statusText);
  }
  return response.json();
}
