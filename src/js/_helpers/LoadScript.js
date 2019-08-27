const LoadScript = props => {
  const script = document.createElement("script");
  script.src = props.url;
  script.async = true;
  document.body.appendChild(script);
};

export default LoadScript;
