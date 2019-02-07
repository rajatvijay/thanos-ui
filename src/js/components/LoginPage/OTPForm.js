import React from "react";
import { Link } from "react-router-dom";
import {
  Form,
  Button,
  Input,
  Icon,
  Divider,
  Row,
  Col,
  notification
} from "antd";
import validator from "validator";
import _ from "lodash";
import { loginOtp } from "../../actions";
import { connect } from "react-redux";
import { baseUrl, authHeader } from "../../_helpers";
import LoginSelectLanguage from "../SelectLanguage/LoginSelectLanguage";

import { FormattedMessage, injectIntl } from "react-intl";

const FormItem = Form.Item;

const openNotificationWithIcon = data => {
  notification[data.type]({
    message: data.message,
    description: data.body,
    placement: "bottomLeft"
  });
};

class OTPForm extends React.Component {
  constructor(props) {
    super(props);

    // reset login status
    this.state = {
      email: "",
      submitted: false,
      data: {},
      loading: false,
      errors: {},
      optSent: false,
      counter: 0,
      showPassword: false
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  componentDidUpdate = prevProps => {
    if (this.props.config.name !== prevProps.config.name) {
      document.title = _.upperFirst(this.props.config.name) || "Vetted";
    }
  };

  toggleShowPassword = () => {
    this.setState({ showPassword: !this.state.showPassword });
  };

  componentWillReceiveProps = nextProps => {
    document.title = _.upperFirst(this.props.config.name) || "Vetted";
  };

  handleChange = e => {
    const { name, value } = e.target;
    this.setState({ [name]: value });
  };

  handleSubmit = e => {
    e.preventDefault();
    this.setState({ submitted: true });
    const { email, password } = this.state;
    const { dispatch } = this.props;

    if (email && password) {
      dispatch(loginOtp(email, password));
    }
  };

  onSubmit = e => {
    // e.preventDefault();

    let data = this.state.data;
    const errors = this.validate(data, "otp"); //error valitation in form
    this.setState({ errors: errors });
    if (Object.keys(errors).length === 0) {
      //if no error is found then submit
      //this.props.userLogin(data);
      //this.props.onSubmit(data);
      this.handleSubmit(e);
    }
  };

  //counter to prevent opt request spamming
  otpReset = () => {
    let that = this;
    let timer = 30;

    setInterval(function() {
      if (--timer < 0) {
        that.setState({ optSent: false });
      } else {
        that.setState({ counter: timer });
      }
    }, 1000);
  };

  //opt request success notification
  showMessageSuccess = () => {
    openNotificationWithIcon({
      type: "success",
      message: "OTP sent to " + this.state.data.email
    });
  };

  //opt request failure notification
  showMessageFaliure = () => {
    openNotificationWithIcon({
      type: "error",
      message: "Unable to send OTP to " + this.state.data.email
    });
  };

  //client side data validation
  validate = (data, opt) => {
    const errors = {};
    if (data.email) {
      if (!validator.isEmail(data.email)) errors.email = "Invalid email";
    }
    if (!data.email) errors.email = "email can't be empty";

    if (opt === "otp") {
      if (!data.password) errors.password = "OTP can't be empty";
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

  refresh = () => {
    window.location.reload();
  };

  //otp request preflight check
  onOptRequest = e => {
    let data = this.state.data;
    const errors = this.validate(data); //error valitation in form

    this.setState({ errors: errors });
    if (Object.keys(errors).length === 0) {
      this.generateOtp();
    } else {
      console.log(this.state.errors);
    }
  };

  //actual otp request
  generateOtp = () => {
    let that = this;
    let payload = this.state.data.email;

    const requestOptions = {
      method: "POST",
      headers: authHeader.post(),
      credentials: "include",
      body: JSON.stringify({ email: payload })
    };

    fetch(baseUrl + "users/generate_otp/", requestOptions)
      .then(function(response) {
        if (!response.ok) {
          that.setState({
            error: response.statusText,
            loading: false
          });
          that.showMessageFaliure();
          throw Error(response.statusText);
        } else {
          that.setState({ optSent: true });
          //that.otpReset();
          that.showMessageSuccess();
        }
        return response;
      })
      .catch(function(error) {
        console.log(error);
      });
  };

  //returns article depending on first letter of passed param
  getVowel = word => {
    if (word && _.includes("aeiou", word.charAt(0))) {
      return "an";
    } else {
      return "a";
    }
  };

  render() {
    const { data, errors } = this.state;
    const { config } = this.props;

    const suffix = (
      <Icon
        type={this.state.showPassword ? "eye" : "eye-invisible"}
        onClick={this.toggleShowPassword}
      />
    );

    return (
      <div className="login-form-box magic-box">
        <Row gutter={32}>
          <Col span={12} className="block-left text-left">
            <div className="login-top text-bold">Login using email only</div>

            <div>
              <Form
                layout="vertical"
                onSubmit={this.onSubmit}
                className="login-form"
                autoComplete="off"
              >
                <FormItem
                  validateStatus={errors.message && "error"}
                  hasFeedback
                  label={
                    <FormattedMessage id="loginPageInstances.oneTimeLink" />
                  }
                  help={errors.message}
                >
                  <Input
                    id="email"
                    name="email"
                    type="text"
                    prefix={
                      <Icon type="mail" style={{ color: "rgba(0,0,0,.25)" }} />
                    }
                    placeholder="example@example.com"
                    value={data.email}
                    onChange={this.onInputChange}
                  />
                </FormItem>

                {this.state.optSent ? (
                  <FormItem
                    validateStatus={errors.message && "error"}
                    hasFeedback
                    label="Enter the one time password to verify your account"
                    help={errors.message}
                  >
                    <Input
                      id="password"
                      name="password"
                      type={this.state.showPassword ? "text" : "password"}
                      prefix={
                        <Icon
                          type="lock"
                          style={{ color: "rgba(0,0,0,.25)" }}
                        />
                      }
                      suffix={
                        <i
                          className="material-icons t-12 text-anchor"
                          onClick={this.toggleShowPassword}
                        >
                          {" "}
                          {!this.state.showPassword
                            ? "visibility"
                            : "visibility_off"}{" "}
                        </i>
                      }
                      placeholder="One-time password"
                      value={data.password}
                      onChange={this.onInputChange}
                    />
                    <div className="opt-block text-left mr-top-sm t-12">
                      <span
                        onClick={this.onOptRequest}
                        className="text-secondary text-anchor"
                      >
                        Click here to resend one-time password
                      </span>
                    </div>
                  </FormItem>
                ) : (
                  <div style={{ height: "120px" }} />
                )}

                <FormItem>
                  <Button
                    type="primary"
                    // htmlType="submit"
                    className="login-form-button btn-block"
                    onClick={
                      this.state.optSent ? this.onSubmit : this.onOptRequest
                    }
                  >
                    {this.state.optSent ? (
                      <FormattedMessage id="commonTextInstances.submitButtonText" />
                    ) : (
                      "Request One-time password"
                    )}
                  </Button>
                </FormItem>
              </Form>
            </div>
          </Col>

          <Col span={12} className="block-right text-left">
            <div>
              <div style={{ height: "260px" }}>
                <div className="login-top text-bold">
                  Login using your {config.saml_url ? " company " : null}{" "}
                  username and password
                </div>
                <div className="logo">
                  <img src={config.logo} style={{ maxWidth: "120px" }} />
                </div>
                <div className="text-light t-16">
                  Login using your {config.name} username and password
                </div>
              </div>

              <div>
                {config.saml_url ? (
                  <a
                    className="ant-btn login-form-button ant-btn-primary btn-block text-white"
                    href={this.props.config.saml_url}
                  >
                    <span className="text-white">
                      <FormattedMessage id="loginPageInstances.customSAMLloginText1" />{" "}
                      {config.name} account
                    </span>
                    {/*<FormattedMessage id="loginPageInstances.customSAMLloginText2" />*/}
                  </a>
                ) : (
                  <Link
                    to="/login/basic"
                    className="ant-btn login-form-button ant-btn-primary btn-block text-white"
                  >
                    <FormattedMessage id="loginPageInstances.loginEmailPassword" />
                    <i className="material-icons t-14 text-middle pd-left-sm">
                      arrow_forward
                    </i>
                  </Link>
                )}
              </div>
            </div>
          </Col>
        </Row>

        {config.saml_url ? (
          <div>
            <Divider>
              <FormattedMessage id="loginPageInstances.orText" />
            </Divider>
            <Link to="/login/basic">
              <FormattedMessage id="loginPageInstances.loginEmailPassword" />
              <i className="material-icons t-14 text-middle pd-left-sm">
                arrow_forward
              </i>
            </Link>
          </div>
        ) : null}
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

export default connect(mapStateToProps)(injectIntl(OTPForm));
