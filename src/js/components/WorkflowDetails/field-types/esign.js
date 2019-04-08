import React, { Component } from "react";
import { connect } from "react-redux";
import { Button, Form, Row, Col, Input, notification } from "antd";
import { commonFunctions } from "./commons";

const FormItem = Form.Item;
const { onFieldChange, field_error, getRequired, isDisabled } = commonFunctions;

const openNotificationWithIcon = data => {
  notification[data.type]({
    message: data.message,
    description: data.body,
    placement: "bottomLeft"
  });
};

class Doc extends Component {
  constructor() {
    super();
    this.state = {
      data: [],
      loading: false,
      fetching: false,
      username: "",
      useremail: ""
    };
  }

  componentDidMount = () => {
    const { user } = this.props.authentication;
    let defaultname = user.first_name
      ? user.first_name + (user.last_name ? " " + user.last_name : "")
      : null;
    let defaultemail = user.email ? user.email : null;
    this.setState({ username: defaultname, useremail: defaultemail });
  };

  onInputChange = e => {
    this.setState({
      data: { ...this.state.data, [e.target.name]: e.target.value }
    });
    this.handleChange(e);
  };

  handleChange(e) {
    const { name, value } = e.target;
    this.setState({ [name]: value });
  }

  submitUserDetails = () => {
    const { username, useremail } = this.state;
    let file_url = this.props.field.definition.attachment || "";
    let token = "Token e4da7a0f0711318b222aed195c3a040db068b79d";

    const requestOptions = {
      method: "POST",
      headers: {
        Authorization: token,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        krypton_transaction_id: "12121212121",
        pdf_url: file_url,
        email: useremail,
        name: username,
        tag: "Applicant’s signature/Thumbprint",
        esignature_type: "embedded"
      })
    };

    this.setState({ fetching: true });
    fetch("http://18.209.228.162:8000/api/v1/request_esign/", requestOptions)
      .then(response => {
        if (!response.ok) {
          console.log("response not ok" + response.statusText);
          this.setState({ error: response.statusText, fetching: false });
          openNotificationWithIcon({
            type: "error",
            message: response.statusText
          });
        }
        return response;
      })
      .then(response => response.json())
      .then(body => {
        if (body.view_url === "None") {
          openNotificationWithIcon({
            type: "error",
            message: "Invalid file"
          });
          this.setState({ fetching: false });
        } else {
          this.setState({ fetching: false }, function() {
            window.open(body.view_url);
          });
        }
      });
  };

  render = () => {
    const props = this.props;
    const { user } = props.authentication;
    const { username, useremail } = this.state;
    let single = true;
    let save = onFieldChange.bind(this, props);
    let that = this;

    let defaultname = user.first_name
      ? user.first_name + (user.last_name ? " " + user.last_name : "")
      : null;
    let defaultemail = user.email ? user.email : null;

    return (
      <Row gutter={24}>
        <Col span={10}>
          <FormItem
            //label={getLabel(props, that)}
            disabled={isDisabled(props)}
            className="from-label"
            style={{ display: "block" }}
            key={"doc-user-name"}
            message=""
            required={getRequired(props)}
            validateStatus={this.state.loading ? "validating" : null}
            hasFeedback
          >
            <Input
              disabled={isDisabled(props)}
              placeholder="Enter user name"
              name="username"
              defaultValue={defaultname}
              autoComplete="new-password"
              autocomplete="new-password"
              onChange={this.onInputChange}
            />
          </FormItem>
        </Col>

        <Col span={10}>
          <FormItem
            className="from-label"
            style={{ display: "block" }}
            key="doc-user-email"
            message=""
            required={getRequired(props)}
            hasFeedback
          >
            <Input
              disabled={isDisabled(props)}
              placeholder="Enter user email"
              name="useremail"
              defaultValue={defaultemail}
              autoComplete="new-password"
              autocomplete="new-password"
              onChange={this.onInputChange}
            />
          </FormItem>
        </Col>
        <Col span={4}>
          <FormItem
            className="from-label"
            style={{ display: "block" }}
            key="doc-submit"
            message=""
            required={getRequired(props)}
            validateStatus={this.state.loading ? "validating" : null}
            hasFeedback
            {...field_error(props)}
          >
            <Button
              disabled={isDisabled(props)}
              //icon="paper-clip"
              onClick={this.submitUserDetails}
              loading={this.state.fetching}
              className="ant-btn-primary"
            >
              Sign
            </Button>
          </FormItem>
        </Col>
      </Row>
    );
  };
}

function mapStateToProps(state) {
  const { authentication } = state;
  return {
    authentication
  };
}

const Doc2 = connect(mapStateToProps)(Doc);

export const ESign = props => {
  return <Doc2 {...props} />;
};
