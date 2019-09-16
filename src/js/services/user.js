import { authHeader } from "../_helpers";
import { apiBaseURL, tenant } from "../../config";
import { APIFetch } from "../utils/request";
import Godaam from "../utils/storage";

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
  return fetch(apiBaseURL + "users/login/", requestOptions)
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
        const userData = user;
        userData.tenant = tenant;
        userData.csrf = document.cookie;
        // store user details and jwt token in local storage to keep user logged in between page refreshes
        Godaam.user = JSON.stringify(userData);
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

  return fetch(apiBaseURL + "users/submit_otp/", requestOptions)
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
        const userData = user;
        userData.tenant = tenant;
        userData.csrf = document.cookie;
        // store user details and jwt token in local storage to keep user logged in between page refreshes
        Godaam.user = JSON.stringify(userData);
      }

      return user;
    });
}

function tokenLogin(token, next) {
  const requestOptions = {
    method: "GET",
    headers: authHeader.get(),
    credentials: "include"
  };

  return fetch(
    apiBaseURL + "users/process_token?token=" + token + "&next=" + next,
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
        const userData = user;
        userData.tenant = tenant;
        userData.csrf = document.cookie;
        // store user details and jwt token in local storage to keep user logged in between page refreshes
        Godaam.user = JSON.stringify(userData);
      }

      return user;
    });
}

export const logout = async () => {
  const requestOptions = {
    method: "GET",
    headers: {
      "X-Requested-With": "XMLHttpRequest",
      ...authHeader.get()
    },
    credentials: "include"
  };
  return await APIFetch("users/logout/", requestOptions).then(handleResponse);
};

export const sendEmailAuthToken = async (email, next) => {
  const requestOptions = {
    method: "POST",
    headers: authHeader.post(),
    credentials: "include",
    body: JSON.stringify({ email, next })
  };
  return await fetch(apiBaseURL + "users/magic_link/", requestOptions);
};

function checkAuth() {
  const requestOptions = {
    method: "GET",
    headers: authHeader.get(),
    credentials: "include"
  };

  return APIFetch("users/me/?format=json", requestOptions)
    .then(response => {
      if (!response.ok) {
        return Promise.reject(response.statusText);
      }
      return response.json();
    })
    .then(user => {
      if (user) {
        const userData = user;
        userData.tenant = tenant;
        userData.csrf = document.cookie;
        Godaam.user = JSON.stringify(userData);
      }
      return user;
    });
}

function getAll() {
  const requestOptions = {
    method: "GET",
    headers: authHeader.get()
  };

  return APIFetch(`users/`, requestOptions).then(handleResponse);
}

function getById(id) {
  const requestOptions = {
    method: "GET",
    headers: authHeader.get(),
    credentials: "include"
  };

  return APIFetch(`users/${id}/`, requestOptions).then(handleResponse);
}

function register(user) {
  const requestOptions = {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(user)
  };

  return APIFetch("users/register/", requestOptions).then(handleResponse);
}

function update(user) {
  const requestOptions = {
    method: "PUT",
    headers: { ...authHeader.post(), "Content-Type": "application/json" },
    body: JSON.stringify(user)
  };

  return APIFetch(`users/${user.id}/`, requestOptions).then(handleResponse);
}

// prefixed function name with underscore because delete is a reserved word in javascript
function _delete(id) {
  const requestOptions = {
    method: "DELETE",
    headers: authHeader.post()
  };

  return APIFetch(`users/${id}`, requestOptions).then(handleResponse);
}

function handleResponse(response) {
  if (!response.ok) {
    return Promise.reject(response.statusText);
  }
  return response.json();
}
