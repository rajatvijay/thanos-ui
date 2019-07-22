const colors = require("colors/safe");

function EnvironmentError(message) {
  this.name = colors.bold.red("EnvironmentError");
  this.message = colors.red(message);
}

const apiOrigin = process.env.REACT_APP_API_ORIGIN;

if (!apiOrigin) {
  throw new EnvironmentError("REACT_APP_API_ORIGIN is required in environment");
} else if (apiOrigin && apiOrigin.endsWith("/")) {
  throw new EnvironmentError("REACT_APP_API_ORIGIN: Origin cannot end with /");
} else {
  console.info(colors.green("✔ Environment configuration is valid"));
}
