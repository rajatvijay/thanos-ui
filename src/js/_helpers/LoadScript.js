const LoadScript = props => {
  console.log("herer---");

  const script = document.createElement("script");
  script.src = props.url;
  script.async = true;
  document.body.appendChild(script);
  console.log("loaded");
};

export default LoadScript;
