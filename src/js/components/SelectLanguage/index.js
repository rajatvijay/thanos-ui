import React from "react";
import { connect } from "react-redux";
import { Select } from "antd";
import { languageActions } from "../../actions";

const Option = Select.Option;

class SelectLanguage extends React.Component {
  handleLanguageChange = value => {
    this.props.dispatch(languageActions.updateUserLanguage(value));
    window.location.reload();
  };
  render() {
    let preferredLanguage = this.props.config.prefered_language || "English";
    return (
      <span>
        <Select
          defaultValue={preferredLanguage}
          style={{
            width: 110,
            paddingTop: "20px",
            float: this.props.navbar ? "right" : "",
            lineHeight: this.props.navbar ? "62px" : ""
          }}
          onChange={this.handleLanguageChange}
        >
          <Option value="en-US">English</Option>
          <Option value="es">Espanyol</Option>
        </Select>
      </span>
    );
  }
}

function mapStateToProps(state) {
  const { config, languageSelector } = state;
  return {
    config,
    languageSelector
  };
}

export default connect(mapStateToProps)(SelectLanguage);
