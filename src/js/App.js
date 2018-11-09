import React from "react";

import Routes from "./routes";

import { loadReCaptcha } from "react-recaptcha-v3";

class App extends React.Component {
  componentDidMount() {
    loadReCaptcha("6LeIoHkUAAAAANZKP5vkvU-B2uEuJBhv13_6h9-8");
  }

  render = () => {
    return <Routes />;
  };
}

export default () => <App />;
