import React from "react";
import { connect } from "react-redux";
import { Select } from "antd";
import { languageActions } from "../../actions";

const Option = Select.Option;

class LoginSelectLanguage extends React.Component {
  handleLanguageChangeLogin = value => {
    this.props.dispatch(languageActions.setLanguage(value));
  };
  render() {
    let preferredLanguage = this.props.user
      ? this.props.user.prefered_language
      : this.props.languageSelector.language ||
        (navigator.languages && navigator.languages[0]) ||
        navigator.language ||
        navigator.userLanguage ||
        "English";
    return (
      <span>
        <Select
          defaultValue={preferredLanguage}
          style={{
            width: 110,
            paddingTop: "20px"
          }}
          onChange={this.handleLanguageChangeLogin}
        >
          <Option value="en">English</Option>
          <Option value="es">Espanyol</Option>
        </Select>
      </span>
    );
  }
}

function mapStateToProps(state) {
  const { config, languageSelector, authentication } = state;
  const { user } = authentication;
  return {
    config,
    user,
    languageSelector
  };
}

export default connect(mapStateToProps)(LoginSelectLanguage);
