import { notification } from "antd";
import { intl } from "./components/IntlCapture";

/**
 *
 * @param {"success"|"error"|"info"|"warn"|"warning"|"open"} type Defines the type of notification that you want to show
 * @param {string} message Translation path of title text
 * @param {object} messageData Additional data to substiture variables from the message
 * @param {string} description Translation path of body text
 * @param {object} descriptionData Additional data to substitute variables from the message
 * @param {any} key Any unique string or symbol
 * @param {"topLeft" | "topRight" | "bottomLeft" | "bottomRight"} placement placement of the notification on screen
 * @param {number} duration Duration for which the notification should stay
 */
const showNotification = ({
  type = "info",
  message = "",
  messageData = {},
  description,
  descriptionData = {},
  key,
  placement = "bottomLeft",
  duration = 4.5
}) => {
  if (!!intl === false) return;
  if (!!message === false) return;
  let extraProps = {};
  if (!!key) extraProps.key = key;
  if (!!description)
    extraProps.description = intl.formatMessage(
      {
        id: description
      },
      descriptionData
    );

  notification[type]({
    message: intl.formatMessage({ id: message }, messageData),
    placement,
    duration,
    ...extraProps
  });
};

export default showNotification;
