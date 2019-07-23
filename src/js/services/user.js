import { authHeader } from "../_helpers";
import { apiBaseURL, tenant } from "../../config";

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
    return await fetch(apiBaseURL + "users/logout/", requestOptions);
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
    return await fetch(apiBaseURL + "users/magic_link/", requestOptions);
  } catch (error) {
    throw error;
  }
};

function checkAuth() {
  const requestOptions = {
    method: "GET",
    headers: authHeader.get(),
    credentials: "include"
  };

  return fetch(apiBaseURL + "users/me/?format=json", requestOptions)
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

  return fetch(apiBaseURL + "users/", requestOptions).then(handleResponse);
}

function getById(id) {
  const requestOptions = {
    method: "GET",
    headers: authHeader.get(),
    credentials: "include"
  };

  return fetch(apiBaseURL + "users/" + id + "/", requestOptions).then(
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

  return fetch(apiBaseURL + "users/" + user.id, requestOptions).then(
    handleResponse
  );
}

// prefixed function name with underscore because delete is a reserved word in javascript
function _delete(id) {
  const requestOptions = {
    method: "DELETE",
    headers: authHeader.post()
  };

  return fetch(apiBaseURL + "users/" + id, requestOptions).then(handleResponse);
}

function handleResponse(response) {
  if (!response.ok) {
    return Promise.reject(response.statusText);
  }
  return response.json();
}
