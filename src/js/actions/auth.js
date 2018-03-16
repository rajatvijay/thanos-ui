import {USER_LOGGED_IN} from "../constants/login";
//import api from "./api";

export const userLoggendIn = user=> ({
  type: USER_LOGGED_IN,
  user
}) 

export const userLogin = (credentials) => console.log(credentials);

// export const userLogin = (credentials) => () => 
//   api.users.login(credentials).then(user => dispatch(userLoggendIn(user)));