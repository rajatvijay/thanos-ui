import { authHeader, baseUrl, baseUrl2 } from "../_helpers";

export const userService = {
  login,
  register,
  getAll,
  getById,
  update,
  delete: _delete
};

//Get client name for form headers.
let domain = window.location.hostname;
domain = domain.split(".");
let client = domain[0];

function login(username, password) {
  const requestOptions = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-DTS-SCHEMA": client !== "test" ? client : "vetted"
    },
    credentials: "include",
    body: JSON.stringify({ email: username, password: password })
  };

  return fetch(baseUrl + "users/login/", requestOptions)
    .then(response => {
      if (!response.ok) {
        return Promise.reject(response.statusText);
      }
      return response.json();
    })
    .then(user => {
      // login successful if there's a jwt token in the response
      if (user) {
        // store user details and jwt token in local storage to keep user logged in between page refreshes
        localStorage.setItem("user", JSON.stringify(user));
      }

      return user;
    });
}

export const logout = async () => {
  localStorage.removeItem("user");
  const requestOptions = {
    method: "POST",
    headers: authHeader.post(),
    credentials: "include",
    body: JSON.stringify({})
  };
  try {
    const response = await fetch(baseUrl + "users/logout/", requestOptions);
    return response;
  } catch (error) {
    throw error;
  }
};

export const sendEmailAuthToken = async email => {
  const requestOptions = {
    method: "POST",
    headers: authHeader.post(),
    credentials: "include",
    body: JSON.stringify({ email })
  };
  try {
    const response = await fetch(
      baseUrl2 + "users/magic_link/",
      requestOptions
    );
    return response;
  } catch (error) {
    throw error;
  }
};

// function logout() {
//   // remove user from local storage to log user out

//   const response =  await fetch("", requestOptions)
//       .then(response => {
//         if (!response.ok) {
//           return Promise.reject(response.statusText);
//         }

//         return response.json();
//       })
//       .then(user => {
//         // login successful if there's a jwt token in the response
//         if (user) {
//           // store user details and jwt token in local storage to keep user logged in between page refreshes
//           localStorage.setItem("user", JSON.stringify(user));
//         }

//         return user;
//       })
//   );
// }

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
