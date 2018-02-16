import React from "react";
import { Form, Button, Input, Icon } from "antd";
import validator from "validator";

const FormItem = Form.Item;

class LoginForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: {},
      loading: false,
      errors: {}
    };
  }

  onSubmit = e => {
    e.preventDefault();

    let id = Math.floor(Math.random() * 10) + 1; //generate random id for test
    let data = this.state.data;
    data.user_id = id; //send id in payload
    const errors = this.validate(data); //error valitation in form
    this.setState({ errors: errors });
    if (Object.keys(errors).length === 0) {
      //if no error is found then submit
      this.props.userLogin(data);
    }
  };

  //client side data validation
  validate = data => {
    const errors = {};
    if (!validator.isEmail(data.email)) errors.email = "Invalid email";
    if (!data.password) errors.password = "Password can't be empty";
    return errors;
  };

  //capture form data in state
  onInputChange = e => {
    this.setState({
      data: { ...this.state.data, [e.target.name]: e.target.value }
    });
  };

  render() {
    const { data, errors } = this.state;
    return (
      <div className="login-form-box">
        <Form layout="vertical" onSubmit={this.onSubmit} className="login-form">
          <FormItem
            validateStatus={errors.email && "error"}
            hasFeedback
            help={errors.email}
          >
            <Input
              id="email"
              name="email"
              type="text"
              prefix={<Icon type="user" style={{ color: "rgba(0,0,0,.25)" }} />}
              placeholder="Username or email"
              value={data.email}
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
              Login
            </Button>
          </FormItem>
        </Form>
      </div>
    );
  }
}

export default LoginForm;
