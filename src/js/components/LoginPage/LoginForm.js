import React from "react";
import { Link } from "react-router-dom";
import {
  Form,
  Button,
  Input,
  Icon,
  Divider,
  Alert,
  Row,
  Col,
  message
} from "antd";
import { connect } from "react-redux";
//import validator from "validator";
import _ from "lodash";
import { login } from "../../actions";
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
      errors: {}
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

    if (
      typeof window === "undefined" &&
      typeof window.grecaptcha === "undefined"
    ) {
      message.error("Google captcha error, please reload!");
      return;
    }

    this.setState({ submitted: true });
    try {
      window.grecaptcha
        .execute("6LeIoHkUAAAAANZKP5vkvU-B2uEuJBhv13_6h9-8", {
          action: "login"
        })
        .then(token => {
          const { username, password } = this.state;
          const { dispatch } = this.props;
          if (username && password) {
            dispatch(login(username, password, token));
          }
        });
    } catch (err) {
      console.log(err);
    }
  }

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

  //client side data validation
  validate = data => {
    const errors = {};
    //if (!validator.isEmail(data.email)) errors.email = "Invalid email";
    if (!data.username) errors.username = "email can't be empty";
    if (!data.password) errors.password = "Password can't be empty";
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
      <div className="login-form-box magic-box">
        <Row gutter={32}>
          <Col span={24} className={"block-left text-left "}>
            <div className="login-top text-bold">Login</div>

            <div>
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
                  label={
                    <FormattedMessage id="loginPageInstances.oneTimeLink" />
                  }
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
                  label="Password"
                >
                  <Input
                    id="password"
                    name="password"
                    type="password"
                    prefix={
                      <Icon type="lock" style={{ color: "rgba(0,0,0,.25)" }} />
                    }
                    placeholder={this.props.intl.formatMessage({
                      id: "loginPageInstances.passwordText"
                    })}
                    value={data.password}
                    onChange={this.onInputChange}
                  />
                </FormItem>

                <FormItem>
                  <Button
                    type="primary"
                    htmlType="submit"
                    className="login-form-button btn-block"
                    style={{
                      height: "40px",
                      verticalAlign: "middle",
                      lineHeight: "40px"
                    }}
                  >
                    {" "}
                    <FormattedMessage id="loginPageInstances.loginText" />
                  </Button>
                  {/*<Link to="/register"> Sign up</Link>*/}
                </FormItem>

                {this.props.error && this.props.error.NormalErr ? (
                  <Alert
                    closable
                    message={this.props.error.NormalErr}
                    type="error"
                    showIcon
                  />
                ) : null}
              </Form>
            </div>
          </Col>
        </Row>

        <div>
          <Divider style={{ marginTop: 0 }}>
            <FormattedMessage id="loginPageInstances.orText" />
          </Divider>
          <div className="t-16">
            <Link to="/login">
              <FormattedMessage id="loginPageInstances.loginUsingEmailOnly" />
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

export default connect(mapStateToProps)(injectIntl(LoginForm));
