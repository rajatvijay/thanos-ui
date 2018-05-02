import { authHeader, baseUrl, handleResponse } from "../_helpers";
import { getValueFromCookie } from "../utils/request";

export const workflowFiltersService = {
  // getFilters,
  setFilters,
  // removeFilters,

  // getKindData,
  getStatusData
};

function getStatusData() {
  const requestOptions = {
    method: "GET",
    headers: authHeader.get(),
    credentials: "include"
  };
  let url = baseUrl + "workflow-status/";

  return fetch(url, requestOptions).then(handleResponse);
}

function setFilters(payload) {
  // const requestOptions = {
  //   method: "POST",
  //   headers: { ...authHeader.post(), "Content-Type": "application/json" },
  //   credentials: "include",
  //   body: JSON.stringify(payload)
  // };
  // return fetch(baseUrl + "responses/", requestOptions).then(handleResponse);
}

// //update fields onchange
// function updateField(payload) {
//   const requestOptions = {
//     method: "PATCH",
//     headers: { ...authHeader.post(), "Content-Type": "application/json" },
//     credentials: "include",
//     body: JSON.stringify({ answer: payload.answer })
//   };

//   return fetch(
//     baseUrl + "responses/" + payload.answerId + "/",
//     requestOptions
//   ).then(handleResponse);
// }

// //Save step data on submit
// function submitStep(payload) {
//   console.log(payload);

//   const requestOptions = {
//     method: "POST",
//     headers: { ...authHeader.post(), "Content-Type": "application/json" },
//     credentials: "include"
//     //body: JSON.stringify({ data: payload })
//   };

//   const url =
//     baseUrl +
//     "workflows/" +
//     payload.workflow +
//     "/stepgroups/" +
//     payload.step_group +
//     "/steps/" +
//     payload.id +
//     "/submit/";

//   return fetch(url, requestOptions).then(handleResponse);
// }

// function approveStep(payload) {
//   console.log(payload);

//   const requestOptions = {
//     method: "POST",
//     headers: { ...authHeader.post(), "Content-Type": "application/json" },
//     credentials: "include"
//     //body: JSON.stringify({ data: payload })
//   };

//   const url =
//     baseUrl +
//     "workflows/" +
//     payload.workflow +
//     "/stepgroups/" +
//     payload.step_group +
//     "/steps/" +
//     payload.id +
//     "/approve/";

//   return fetch(url, requestOptions).then(handleResponse);
// }

// function handleResponse(response) {
//   console.log('response')
//   console.log(response)
//   if (!response.ok) {
//     return Promise.reject(response.statusText);
//   }
//   return response.json();
// }
