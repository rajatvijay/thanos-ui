import React, { Component } from "react";
import { connect } from "react-redux";
import { Button, Form, Row, Col, Input, notification } from "antd";
import { commonFunctions } from "./commons";
import { authHeader } from "../../../_helpers";
import { apiBaseURL } from "../../../../config";

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

  generateFile = async () => {
    const requestOptions = {
      method: "POST",
      headers: authHeader.post(),
      credentials: "include",
      body: JSON.stringify({ workflow: this.props.workflowId })
    };

    this.setState({ fetching: true });

    const _response = await fetch(
      apiBaseURL +
        "fields/" +
        this.props.field.definition.id +
        "/download_attachment/?format=json",
      requestOptions
    );
    const response = await _response.json();
    this.setState({ fetching: false });
    return response.object_url;
  };

  _submitUserDetails = async () => {
    const { username, useremail } = this.state;
    let file_url = await this.generateFile();
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

    let response = await fetch(
      "https://cyborg.slackcart.com/api/v1/request_esign/",
      requestOptions
    );
    if (!response.ok) {
      this.setState({ error: response.statusText, fetching: false });
      openNotificationWithIcon({
        type: "error",
        message: response.statusText
      });
    } else {
      let body = await response.json();
      this.setState({ fetching: false });
      if (body.view_url === "None") {
        openNotificationWithIcon({
          type: "error",
          message: "Invalid file"
        });
      } else {
        return body.view_url;
      }
    }
  };

  submitUserDetails = () => {
    this._submitUserDetails()
      .then(response => {
        window.open(response);
      })
      .catch(err => {
        openNotificationWithIcon({
          type: "error",
          message: err
        });
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
