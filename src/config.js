function getTenant() {
  const url = new URL(window.location.href);
  return url.hostname.split(".")[0];
}

const DEFAULT_TENANT = process.env.REACT_APP_DEFAULT_TENANT || "walmart";
const apiOrigin = process.env.REACT_APP_API_ORIGIN;

// Building via scripts keeps the environment as production which can be confusing
// hence the choice of this variable name to be more verbose
const isBuildEnv = process.env.NODE_ENV === "production";

export const tenant = isBuildEnv ? getTenant() : DEFAULT_TENANT;
export const siteOrigin = `${document.location.origin}`;
export const apiBaseURL = `${apiOrigin}/api/v1/`;

export const auditLogBaseURL = process.env.REACT_APP_AUDIT_LOG_BASE_URL;

export const supportedFieldFormats = {
  duns: "##-###-####"
};
