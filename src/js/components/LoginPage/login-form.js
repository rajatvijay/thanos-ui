import React from "react";
import { Link } from "react-router-dom";
import { Form, Button, Input, Icon, Divider, Alert } from "antd";
//import validator from "validator";
import _ from "lodash";
import { login } from "../../actions";
import { connect } from "react-redux";
import { baseUrl, authHeader } from "../../_helpers";
import SelectLanguage from "../SelectLanguage/";
import LoginSelectLanguage from "../SelectLanguage/LoginSelectLanguage";
import { FormattedMessage, injectIntl } from "react-intl";

const FormItem = Form.Item;

class LoginForm extends React.Component {
  constructor(props) {
    super(props);

    // reset login status

    this.state = {
      username: "",
      password: "",
      token: "",
      submitted: false,
      data: {},
      loading: false,
      errors: {},
      optResponse: null
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(e) {
    const { name, value } = e.target;
    this.setState({ [name]: value });
  }

  handleSubmit(e) {
    e.preventDefault();

    this.setState({ submitted: true });
    const { username, password } = this.state;
    const { dispatch, token } = this.props;
    console.log(token);
    if (username && password) {
      dispatch(login(username, password, token));
    }
  }

  /////////////////////////////////////////////////////
  /////////////////////////////////////////////////////
  /////////////////////////////////////////////////////

  onSubmit = e => {
    // e.preventDefault();

    let id = Math.floor(Math.random() * 10) + 1; //generate random id for test
    let data = this.state.data;
    data.user_id = id; //send id in payload
    const errors = this.validate(data); //error valitation in form
    this.setState({ errors: errors });
    if (Object.keys(errors).length === 0) {
      //if no error is found then submit
      //this.props.userLogin(data);
      //this.props.onSubmit(data);
    }

    this.handleSubmit(e);
  };

  onOptRequest = e => {
    let data = this.state.data;
    const errors = this.validate(data, "opt"); //error valitation in form

    this.setState({ errors: errors });
    if (Object.keys(errors).length === 0) {
      this.getOtp();
    } else {
      console.log(this.state.errors);
    }
  };

  //client side data validation
  validate = (data, opt) => {
    console.log(opt);
    const errors = {};
    //if (!validator.isEmail(data.email)) errors.email = "Invalid email";

    if (!data.username) errors.username = "email can't be empty";
    if (opt !== "opt") {
      if (!data.password) errors.password = "Password can't be empty";
    }
    return errors;
  };

  

  //capture form data in state
  onInputChange = e => {
    this.setState({
      data: { ...this.state.data, [e.target.name]: e.target.value }
    });

    this.handleChange(e);
  };

  render() {
    const { data, errors } = this.state;

    let supportedLaguanges = this.props.config.supported_languages;
    return (
      <div className="login-form-box">
        {/*_.isEmpty(supportedLaguanges) || ("")*/}
      
        <div className="block-left">
          <FormattedMessage id="loginPageInstances.selectPreferedLanguage" />
          <LoginSelectLanguage />
          <Divider />
          <Form
            layout="vertical"
            onSubmit={this.onSubmit}
            className="login-form"
            autoComplete="off"
          >
            <FormItem
              validateStatus={errors.username && "error"}
              hasFeedback
              help={errors.username}
            >
              <Input
                id="username"
                name="username"
                type="text"
                prefix={
                  <Icon type="user" style={{ color: "rgba(0,0,0,.25)" }} />
                }
                placeholder={this.props.intl.formatMessage({
                  id: "loginPageInstances.emailText"
                })}
                value={data.username}
                onChange={this.onInputChange}
              />
            </FormItem>

            <FormItem
              validateStatus={errors.password && "error"}
              help={errors.password}
            >
              <Input
                id="password"
                name="password"
                type="text"
                prefix={
                  <Icon type="lock" style={{ color: "rgba(0,0,0,.25)" }} />
                }
                placeholder={this.props.intl.formatMessage({
                  id: "loginPageInstances.passwordText"
                })}
                value={data.password}
                onChange={this.onInputChange}
              />
              <div className="opt-block text-left mr-top-sm">
                <span
                  onClick={this.onOptRequest}
                  className="text-secondary text-anchor"
                >
                  Click here to request one-time password
                </span>
              </div>
            </FormItem>

            <FormItem>
              <Button
                type="primary"
                htmlType="submit"
                className="login-form-button"
              >
                {" "}
                <FormattedMessage id="loginPageInstances.loginText" />
              </Button>
              {/*<Link to="/register"> Sign up</Link>*/}
            </FormItem>

            {this.props.error ? (
              <Alert message={this.props.error} type="error" showIcon />
            ) : null}

            <Divider>
              <FormattedMessage id="loginPageInstances.orText" />
            </Divider>
            <div className="t-16">
              <Link to="/login/magic">
                <FormattedMessage id="loginPageInstances.loginUsingEmailOnly" />
                <i className="material-icons t-14 text-middle pd-left-sm">
                  arrow_forward
                </i>
              </Link>
            </div>
          </Form>
        </div>
      </div>
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

export default connect(mapStateToProps)(injectIntl(LoginForm));
