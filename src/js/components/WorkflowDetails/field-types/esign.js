import React, { Component } from "react";
import { connect } from "react-redux";
import { Button, Form, Row, Col, Input } from "antd";
import { commonFunctions } from "./commons";
import { authHeader } from "../../../_helpers";
import { apiBaseURL } from "../../../../config";
import { injectIntl } from "react-intl";
import showNotification from "../../../../modules/common/notification";

const FormItem = Form.Item;
const { field_error, isDisabled } = commonFunctions;

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
    const defaultname = user.first_name
      ? user.first_name + (user.last_name ? " " + user.last_name : "")
      : null;
    const defaultemail = user.email ? user.email : null;
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
    const file_url = await this.generateFile();
    const token = "Token e4da7a0f0711318b222aed195c3a040db068b79d";

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

    const response = await fetch(
      "https://cyborg.slackcart.com/api/v1/request_esign/",
      requestOptions
    );
    if (!response.ok) {
      this.setState({ error: response.statusText, fetching: false });
      showNotification({
        type: "error",
        message: response.statusText
      });
    } else {
      const body = await response.json();
      this.setState({ fetching: false });
      if (body.view_url === "None") {
        showNotification({
          type: "error",
          message: "notificationInstances.invalidFile"
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
        showNotification({
          type: "error",
          message: err
        });
      });
  };

  render = () => {
    const props = this.props;
    const { user } = props.authentication;
    const {
      intl: { formatMessage }
    } = this.props;

    const defaultname = user.first_name
      ? user.first_name + (user.last_name ? " " + user.last_name : "")
      : null;
    const defaultemail = user.email ? user.email : null;

    return (
      <Row gutter={24}>
        <Col span={10}>
          <FormItem
            disabled={isDisabled(props)}
            className="from-label"
            style={{ display: "block" }}
            key={"doc-user-name"}
            message=""
            validateStatus={this.state.loading ? "validating" : ""}
            hasFeedback
          >
            <Input
              disabled={isDisabled(props)}
              placeholder={formatMessage({ id: "fields.enterUserName" })}
              name="username"
              defaultValue={defaultname}
              autoComplete="new-password"
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
              placeholder={formatMessage({ id: "fields.enterUserEmail" })}
              name="useremail"
              defaultValue={defaultemail}
              autoComplete="new-password"
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
            validateStatus={this.state.loading ? "validating" : ""}
            hasFeedback
            {...field_error(props)}
          >
            <Button
              disabled={isDisabled(props)}
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

const Doc2 = connect(mapStateToProps)(injectIntl(Doc));

export const ESign = props => {
  return <Doc2 {...props} />;
};
