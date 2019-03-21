import React from "react";
import { Link } from "react-router-dom";
import { Form, Button, Input, Icon, Divider, Row, Col } from "antd";
import validator from "validator";
import _ from "lodash";
import { sendEmailAuthToken } from "../../actions/user";
import { connect } from "react-redux";
import LoginSelectLanguage from "../SelectLanguage/LoginSelectLanguage";

import { FormattedMessage, injectIntl } from "react-intl";

const FormItem = Form.Item;

class MagicForm extends React.Component {
  constructor(props) {
    super(props);

    // reset login status
    this.state = {
      email: "",
      submitted: false,
      data: {},
      loading: false,
      errors: {}
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  componentDidMount = () => {};

  componentDidUpdate(prevProps) {
    if (this.props.config.name !== prevProps.config.name) {
      document.title = _.upperFirst(this.props.config.name) || "Vetted";
    }
  }

  componentWillReceiveProps(nextProps) {
    document.title = _.upperFirst(this.props.config.name) || "Vetted";
  }

  handleChange(e) {
    const { name, value } = e.target;
    this.setState({ [name]: value });
  }

  handleSubmit(e) {
    e.preventDefault();
    this.setState({ submitted: true });
    const { email } = this.state;
    const { dispatch, nextUrl } = this.props;

    if (email) {
      dispatch(sendEmailAuthToken(email, nextUrl));
    }
  }

  /////////////////////////////////////////////////////
  /////////////////////////////////////////////////////
  /////////////////////////////////////////////////////

  onSubmit = e => {
    // e.preventDefault();

    let data = this.state.data;
    const errors = this.validate(data); //error valitation in form
    this.setState({ errors: errors });
    if (Object.keys(errors).length === 0) {
      //if no error is found then submit
      //this.props.userLogin(data);
      //this.props.onSubmit(data);
      this.handleSubmit(e);
    }
  };

  //client side data validation
  validate = data => {
    const errors = {};
    if (data.email) {
      if (!validator.isEmail(data.email)) errors.email = "Invalid email";
    }
    if (!data.email) errors.email = "email can't be empty";
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

  render() {
    const { data, errors } = this.state;
    let supportedLaguanges = this.props.config.supported_languages;
    return (
      <div className="login-form-box magic-box">
        <Row gutter={32}>
          <Col span={24} className={"block-left text-left "}>
            {!this.props.emailAuth.submitted ? (
              <div>
                <div className="login-top text-bold">Magic Link</div>
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
                      help={errors.message}
                      label={
                        <FormattedMessage id="loginPageInstances.oneTimeLink" />
                      }
                    >
                      <Input
                        id="email"
                        name="email"
                        type="text"
                        prefix={
                          <Icon
                            type="mail"
                            style={{ color: "rgba(0,0,0,.25)" }}
                          />
                        }
                        placeholder="example@example.com"
                        value={data.email}
                        onChange={this.onInputChange}
                      />
                    </FormItem>

                    <FormItem>
                      <Button
                        type="primary"
                        // htmlType="submit"
                        className="login-form-button btn-block"
                        onClick={this.onSubmit}
                      >
                        <FormattedMessage id="commonTextInstances.submitButtonText" />
                      </Button>
                    </FormItem>
                  </Form>
                </div>
              </div>
            ) : (
              <div className="magic--submitted text-center">
                <div className="icon">
                  <i className="material-icons material-icons-24">
                    check_circle
                  </i>
                </div>
                <div>
                  <h2 className="text-grey-dark">
                    <FormattedMessage id="commonTextInstances.emailSent" />
                  </h2>
                  <br />
                  <p className="t-14">
                    <span className="text-grey-dark">
                      <FormattedMessage id="loginPageInstances.loginErrorMessage" />
                      <br />
                      <br />
                    </span>
                  </p>
                  <div className="t-12">
                    <FormattedMessage id="errorMessageInstances.magicLinkExpirationWindow" />
                  </div>
                </div>
              </div>
            )}
          </Col>
        </Row>

        <div>
          <Divider>
            <FormattedMessage id="loginPageInstances.orText" />
          </Divider>
          <div className="t-16">
            {/*
            THIS WILL CHECK WHETHER OR NOT OTP LOGIN IS ENABLED FOR CLIENT AND 
            POINT THE LINK TO SUITED PAGE. 
            I.E: LOGIN EMAIL PASS IF OTP IS NOT ENABLED AND TO OTP/BASE LOGIN PAGE IF ITS ENABLED
            */}
            <Link
              to={
                this.props.config.configuration &&
                !_.includes(
                  this.props.config.configuration.client_auth_backends,
                  3
                )
                  ? "/login/basic/"
                  : "/"
              }
            >
              <FormattedMessage id="loginPageInstances.goToLoginPage" />
              <i className="material-icons t-14 text-middle pd-left-sm">
                arrow_forward
              </i>
            </Link>
          </div>
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

export default connect(mapStateToProps)(injectIntl(MagicForm));
