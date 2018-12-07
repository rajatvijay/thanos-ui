import React from "react";
import { Link } from "react-router-dom";
import { Form, Button, Input, Icon, Divider } from "antd";
import validator from "validator";
import _ from "lodash";
import { sendEmailAuthToken } from "../../actions/user";
import { connect } from "react-redux";

const FormItem = Form.Item;

class MagicLoginLinkForm extends React.Component {
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
    return (
      <div className="login-form-box">
        {!this.props.emailAuth.submitted ? (
          <div>
            <div className="text-center mr-bottom t-18 text-base">
              Enter your email to receive one-time sign in link
            </div>
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

              <FormItem>
                <Button
                  type="primary"
                  // htmlType="submit"
                  className="login-form-button"
                  onClick={this.onSubmit}
                >
                  Submit
                </Button>
              </FormItem>
            </Form>
            {!this.props.config.saml_url ? (
              <div>
                <Divider>or</Divider>
                <Link to="/login">
                  Login using email and password
                  <i className="material-icons t-14 text-middle pd-left-sm">
                    arrow_forward
                  </i>
                </Link>
              </div>
            ) : (
              <div>
                <Divider>or</Divider>
                <a href="/api/v1/saml/login/">
                  Login via your {this.props.config.name} username and password
                  <i className="material-icons t-14 text-middle pd-left-sm">
                    arrow_forward
                  </i>
                </a>
              </div>
            )}
          </div>
        ) : (
          <div className="magic--submitted text-center">
            <div className="icon">
              <i className="material-icons material-icons-24">check_circle</i>
            </div>
            <div>
              <h2 className="text-grey-dark">Email sent.</h2>
              <br />
              <p className="t-14">
                <span className="text-grey-dark">
                  An email will be sent to you if your email exists.<br />
                  Please check your inbox<br />
                  <br />
                </span>
              </p>
              <div className="t-12">NOTE: The link expires in 24 hours.</div>
              <Divider />
              <div>
                <a href="/" onClick={this.refresh}>
                  Go to login page
                </a>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }
}

function mapStateToProps(state) {
  const { config } = state;
  return {
    config
  };
}

export default connect(mapStateToProps)(MagicLoginLinkForm);
