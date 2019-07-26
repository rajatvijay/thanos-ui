import React from "react";
import { Link, Redirect } from "react-router-dom";
import {
  Form,
  Button,
  Input,
  Icon,
  Divider,
  Row,
  Alert,
  Col,
  notification
} from "antd";
import validator from "validator";
import _ from "lodash";
import { loginOtp } from "../../actions";
import { connect } from "react-redux";
import { authHeader } from "../../_helpers";

import { FormattedMessage, injectIntl } from "react-intl";
import { apiBaseURL } from "../../../config";

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
    const data = this.state.data;
    const errors = this.validate(data, "otp"); //error valitation in form
    this.setState({ errors: errors });
    if (Object.keys(errors).length === 0) {
      //if no error is found then submit
      this.handleSubmit(e);
    }
  };

  //counter to prevent opt request spamming
  otpReset = () => {
    const that = this;
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
      message:
        this.props.intl.formatMessage({
          id: "commonTextInstances.oneTimePasswordSentText"
        }) +
        " " +
        this.state.data.email
    });
  };

  //opt request failure notification
  showMessageFaliure = () => {
    openNotificationWithIcon({
      type: "error",
      message:
        this.props.intl.formatMessage({
          id: "commonTextInstances.unableToSendOneTimePassword"
        }) +
        " " +
        this.state.data.email
    });
  };

  //client side data validation
  validate = (data, opt) => {
    const errors = {};
    if (data.email) {
      if (!validator.isEmail(data.email))
        errors.email = this.props.intl.formatMessage({
          id: "commonTextInstances.invalidEmail"
        });
    }
    if (!data.email)
      errors.email = this.props.intl.formatMessage({
        id: "commonTextInstances.emailCantBeEmpty"
      });

    if (opt === "otp") {
      if (!data.password)
        errors.password = this.props.intl.formatMessage({
          id: "commonTextInstances.OtpEmpty"
        });
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
    const data = this.state.data;
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
    const that = this;
    const payload = this.state.data.email;

    const requestOptions = {
      method: "POST",
      headers: authHeader.post(),
      credentials: "include",
      body: JSON.stringify({ email: payload })
    };

    fetch(apiBaseURL + "users/generate_otp/", requestOptions)
      .then(function(response) {
        if (!response.ok) {
          response.json().then(data => {
            that.setState(state => ({
              errors: { ...state.errors, OtpErr: data.detail },
              loading: false
            }));
          });
          throw Error(response.statusText);
        } else {
          that.setState({ optSent: true });
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
    const { config, showRightBlock } = this.props;

    if (
      config.configuration &&
      !_.includes(config.configuration.client_auth_backends, 3)
    ) {
      return <Redirect to={"/login/magic/"} />;
    }

    return (
      <div className="login-form-box magic-box">
        <Row gutter={32}>
          <Col span={showRightBlock ? 12 : 24} className="block-left text-left">
            <div className="login-top text-bold">Login using email only</div>

            <div>
              <Form
                layout="vertical"
                onSubmit={this.onSubmit}
                className="login-form"
                autoComplete="off"
              >
                <FormItem
                  validateStatus={errors.message ? "error" : ""}
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
                    validateStatus={errors.message ? "error" : ""}
                    hasFeedback
                    label={
                      <FormattedMessage id="commonTextInstances.enterOtp" />
                    }
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
                      placeholder={this.props.intl.formatMessage({
                        id: "commonTextInstances.oneTimePassword"
                      })}
                      value={data.password}
                      onChange={this.onInputChange}
                    />
                    <div className="opt-block text-left mr-top-sm t-12">
                      <span
                        onClick={this.onOptRequest}
                        className="text-secondary text-anchor"
                      >
                        <FormattedMessage id="commonTextInstances.resendOneTimePasswordText" />
                      </span>
                    </div>
                  </FormItem>
                ) : (
                  <div style={{ height: "120px" }} />
                )}

                <FormItem>
                  <Button
                    type="primary"
                    className="login-form-button btn-block"
                    onClick={
                      this.state.optSent ? this.onSubmit : this.onOptRequest
                    }
                    style={{
                      height: "40px",
                      verticalAlign: "middle",
                      lineHeight: "40px"
                    }}
                  >
                    {this.state.optSent ? (
                      <FormattedMessage id="commonTextInstances.submitButtonText" />
                    ) : (
                      <FormattedMessage id="commonTextInstances.requestOneTimePasswordText" />
                    )}
                  </Button>
                </FormItem>
                {this.props.error && this.props.error.OtpErr ? (
                  <Alert
                    message={this.props.error.OtpErr}
                    closable
                    type="error"
                    showIcon
                  />
                ) : null}
                {this.state.errors && this.state.errors.OtpErr ? (
                  <Alert
                    message={this.state.errors.OtpErr}
                    closable
                    type="error"
                    showIcon
                  />
                ) : null}
                {this.state.error}
              </Form>
            </div>
          </Col>

          {showRightBlock ? (
            <Col span={12} className="block-right text-left">
              <div>
                <div style={{ height: "260px" }}>
                  <div className="login-top text-bold">
                    Login using your {config.saml_url ? " company " : null}{" "}
                    username and password
                  </div>
                  <div className="logo">
                    <img
                      src={config.logo}
                      style={{ maxWidth: "120px" }}
                      alt=""
                    />
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
                      style={{
                        height: "40px",
                        verticalAlign: "middle",
                        lineHeight: "40px"
                      }}
                    >
                      <span className="text-white">
                        <FormattedMessage id="loginPageInstances.customSAMLloginText1" />{" "}
                        {config.name} account
                      </span>
                    </a>
                  ) : (
                    <Link
                      to={
                        this.props.nextUrl
                          ? "/login/basic" + this.props.nextUrl
                          : "/login/basic"
                      }
                      className="ant-btn login-form-button ant-btn-primary btn-block text-white"
                      style={{
                        height: "40px",
                        verticalAlign: "middle",
                        lineHeight: "40px"
                      }}
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
          ) : null}
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
  const { loggingIn, error } = state.authentication;
  const { config, languageSelector } = state;
  return {
    loggingIn,
    error,
    config,
    languageSelector
  };
}

export default connect(mapStateToProps)(injectIntl(OTPForm));
