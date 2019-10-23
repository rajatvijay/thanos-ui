import { intl } from "./components/IntlCapture";
import { message } from "antd";

/**
 * This is a wrapper around `message` of ANTD, which enabled it to
 * show with translated text.
 *
 * @param {"warning"| "warn"| "success"| "loading"| "info"| "error"} type Defines the type of message that you want to show.
 * @param {React.ReactNode | string} content Defines the content that would show in the message
 */
export const showMessage = (type, content, ...otherProps) => {
  if (!message[type] || ["config", "destroy", "open"].includes(type))
    return console.warn(`Unsupported type: ${type}`);
  message[type](
    typeof content === "string" && !!intl
      ? intl.formatMessage({
          id: content
        })
      : content,
    ...otherProps
  );
};
