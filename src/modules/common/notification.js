import { PureComponent } from "react";
import { notification } from "antd";
import { injectIntl } from "react-intl";

let intl;

/** React component to capture the context.  */
class _IntlCapture extends PureComponent {
  render() {
    // render will only work when the props are changed, usually when the
    // language will be changed.
    intl = this.props.intl;
    return null;
  }
}

export const IntlCapture = injectIntl(_IntlCapture);

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
