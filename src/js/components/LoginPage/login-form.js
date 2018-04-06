import React from "react";
import { Link } from "react-router-dom";
import { Form, Button, Input, Icon, Divider } from "antd";
//import validator from "validator";
import { login } from "../../actions";

const FormItem = Form.Item;

class LoginForm extends React.Component {
  constructor(props) {
    super(props);

    // reset login status

    this.state = {
      username: "",
      password: "",
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
    const { username, password } = this.state;
    const { dispatch } = this.props;
    if (username && password) {
      dispatch(login(username, password));
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

  //client side data validation
  validate = data => {
    const errors = {};
    //if (!validator.isEmail(data.email)) errors.email = "Invalid email";
    if (!data.username) errors.username = "username can't be empty";
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

    return (
      <div className="login-form-box">
        <Form layout="vertical" onSubmit={this.onSubmit} className="login-form">
          <FormItem
            validateStatus={errors.username && "error"}
            hasFeedback
            help={errors.username}
          >
            <Input
              id="username"
              name="username"
              type="text"
              prefix={<Icon type="user" style={{ color: "rgba(0,0,0,.25)" }} />}
              placeholder="Username or email"
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
              type="password"
              prefix={<Icon type="lock" style={{ color: "rgba(0,0,0,.25)" }} />}
              placeholder="password"
              value={data.password}
              onChange={this.onInputChange}
            />
          </FormItem>

          <FormItem>
            <Button
              type="primary"
              htmlType="submit"
              className="login-form-button"
            >
              {" "}
              Login
            </Button>
            {/*<Link to="/register"> Sign up</Link>*/}
          </FormItem>
          <Divider />
          <div>
            <Link to="/login/magic">Forgot password?</Link>
          </div>
        </Form>
      </div>
    );
  }
}

export default LoginForm;
