import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import NumberFormat from "react-number-format";
import TextArea from "antd/lib/input/TextArea";

/**
 * This Component is a wrapper around NumberFormat.
 * The purpose is to extend the functionality of a text input
 * component to allow formatted text input, such as D-U-N-S Number.
 *
 * In case of a unsupported format the component will show error,
 * rather than falling back to TextArea component. This ensures that
 * any configuration problems can be detected.
 */
export default class FormattedTextInput extends PureComponent {
  static propTypes = {
    /**  useFormattedValue If true, onChange will return formatted value */
    useFormattedValue: PropTypes.bool,
    /** format One of SupportedFormats */
    format: PropTypes.string
  };
  // to store values so that we can push tham later
  // on events such as onBlur
  value = null;
  formattedValue = null;

  componentWillUnmount() {
    // cleanup
    this.value = undefined;
    this.formattedValue = undefined;
  }

  /**
   * Pushes current value to specified action, like onChange or onBlur,
   * with structure similar to what we get in DOM Events.
   *
   * @param {Function} action To be called with appropriate value.
   */
  pushChange = action => {
    if (!action) return;
    const { useFormattedValue } = this.props;
    const value = useFormattedValue ? this.formattedValue : this.value;
    action({ target: { value } });
  };

  /**
   * Saves value in class property to be used later in
   * handleBlur, where we don't get the values in event.
   *
   * @param {string} formattedValue Formatted value
   * @param {value} value Raw value
   */
  handleChange = ({ formattedValue, value }) => {
    this.formattedValue = formattedValue;
    this.value = value;

    this.pushChange(this.props.onChange);
  };

  /**
   * Forward to pushChange with action as onBlur (from props), so that
   * the appropriate values are sent back to that action.
   */
  handleBlur = e => {
    this.pushChange(this.props.onBlur);
  };

  render() {
    const {
      format,
      onChange,
      onBlur,
      useFormattedValue,
      ...otherProps
    } = this.props;

    // If we don't have a format, just render the error message (good for debugging)
    if (!format) return <span>Unspecified format</span>;
    if (!/#/.test(format)) return <span>Unsupported format {format}</span>;

    // But, if we do have a format, render the NumberFormat
    return (
      <NumberFormat
        customInput={TextArea}
        format={format}
        {...otherProps}
        onBlur={this.handleBlur}
        onValueChange={this.handleChange}
      />
    );
  }
}
