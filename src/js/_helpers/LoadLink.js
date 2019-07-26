const LoadLink = props => {
  const link = document.createElement("link");
  link.href = props.url;
  link.rel = "stylesheet";
  document.body.appendChild(link);
};

export default LoadLink;
