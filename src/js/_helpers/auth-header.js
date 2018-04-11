// export function authHeader() {
//   // return authorization header with jwt token
//   let user = JSON.parse(localStorage.getItem("user"));

//   if (user && user.token) {
//     return { Authorization: "Bearer " + user.token };
//   } else {
//     return {};
//   }
// }

//Get client name for form headers.
let domain = window.location.hostname;
domain = domain.split(".");
let client = domain[0];

export const authHeader2 = () => {
  let header = {
    "Content-Type": "application/json",
    "X-DTS-SCHEMA": "vetted"
    //"X-DTS-SCHEMA": client !== ("www" || "localhost") ? client : "vetted",
  };
  return header;
};
