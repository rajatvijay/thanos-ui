import { PureComponent } from "react";
import { injectIntl } from "react-intl";

export let intl;

/** React component to capture the context.  */
class _IntlCapture extends PureComponent {
  render() {
    // render will only work when the props are changed, usually when the
    // language will be changed.
    intl = this.props.intl;
    return null;
  }
}

export default injectIntl(_IntlCapture);
