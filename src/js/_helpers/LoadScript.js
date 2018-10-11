import React from "react";

const LoadScript = props => {
  console.log("herer---");

  const script = document.createElement("script");
  script.src = props.url;
  script.async = true; //props.async;
  document.body.appendChild(script);
  console.log("loaded");
};

export default LoadScript;
