import React from "react";
import { Link } from "react-router-dom";
import { Form, Button, Input, Icon, Divider } from "antd";
import validator from "validator";
import { sendEmailAuthToken } from "../../actions/user";

const FormItem = Form.Item;

class LoginLinkForm extends React.Component {
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

  handleChange(e) {
    const { name, value } = e.target;
    this.setState({ [name]: value });
  }

  handleSubmit(e) {
    e.preventDefault();
    this.setState({ submitted: true });
    const { email } = this.state;
    const { dispatch } = this.props;

    if (email) {
      dispatch(sendEmailAuthToken(email));
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

  render() {
    const { data, errors } = this.state;

    return (
      <div className="login-form-box">
        {!this.props.submitted ? (
          <div>
            <div className="text-center mr-bottom t-18 text-base">
              Enter your email address to Login
            </div>
            <Form
              layout="vertical"
              onSubmit={this.onSubmit}
              className="login-form"
            >
              <FormItem
                validateStatus={errors.email && "error"}
                hasFeedback
                help={errors.email}
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
            <Divider>or</Divider>
            <div>
              <Link to="/login">
                Login using email and password
                <i className="material-icons t-14 text-middle pd-left-sm">
                  arrow_forward
                </i>
              </Link>
            </div>
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
                  We have sent and email to <b>{this.state.data.email}</b>{" "}
                  <br />
                  Please check your inbox<br />
                  <br />
                </span>
              </p>
              <div className="t-12">NOTE: The link expires in 24 hours.</div>
              <Divider />
              <div>
                <Link to="/login/magic">Go to login page </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }
}

export default LoginLinkForm;
