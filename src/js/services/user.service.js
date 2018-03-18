import { authHeader } from "../_helpers";

export const userService = {
  login,
  logout,
  register,
  getAll,
  getById,
  update,
  delete: _delete
};

let domain = window.location.hostname;
domain = domain.split(".");
let client = domain[0];

function login(username, password) {
  const requestOptions = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-DTS-SCHEMA": client !== ("www" || "localhost") ? client : "vetted"
    },
    body: JSON.stringify({ username, password })
  };

  console.log("requestOptions- header");
  console.log(requestOptions);

  return (
    fetch("/users/authenticate", requestOptions)
      //return fetch("http://thevetted.co/api/v1/users/login/", requestOptions)
      .then(response => {
        if (!response.ok) {
          return Promise.reject(response.statusText);
        }

        return response.json();
      })
      .then(user => {
        // login successful if there's a jwt token in the response
        if (user && user.token) {
          // store user details and jwt token in local storage to keep user logged in between page refreshes
          localStorage.setItem("user", JSON.stringify(user));
        }

        return user;
      })
  );
}

function logout() {
  // remove user from local storage to log user out
  localStorage.removeItem("user");
}

function getAll() {
  const requestOptions = {
    method: "GET",
    //headers: authHeader()
    headers: {
      "Content-Type": "application/json",
      "X-DTS-SCHEMA": client !== ("www" || "localhost") ? client : "vetted"
    }
  };

  return fetch("http://thevetted.co/api/v1/users/", requestOptions).then(
    handleResponse
  );
  //return fetch("/users", requestOptions).then(handleResponse);
}

function getById(id) {
  const requestOptions = {
    method: "GET",
    headers: authHeader()
  };

  return fetch("/users/" + id, requestOptions).then(handleResponse);
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
    headers: { ...authHeader(), "Content-Type": "application/json" },
    body: JSON.stringify(user)
  };

  return fetch("/users/" + user.id, requestOptions).then(handleResponse);
}

// prefixed function name with underscore because delete is a reserved word in javascript
function _delete(id) {
  const requestOptions = {
    method: "DELETE",
    headers: authHeader()
  };

  return fetch("/users/" + id, requestOptions).then(handleResponse);
}

function handleResponse(response) {
  if (!response.ok) {
    return Promise.reject(response.statusText);
  }

  return response.json();
}
