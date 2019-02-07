import React, { Component } from "react";
import { connect } from "react-redux";
import { Layout, Icon, Tooltip, Divider, Form } from "antd";
import _ from "lodash";
import { baseUrl, authHeader, history } from "../../_helpers";
import { getFieldType } from "./field-types";
import { commonFunctions } from "./field-types/commons";

const FormItem = Form.Item;
const {
  getLabel,
  onFieldChange,
  onFieldChangeArray,
  arrayToString,
  stringToArray,
  field_error,
  getRequired,
  feedValue,
  getLink,
  getStyle,
  isDisabled
  //getAnsweredBy
} = commonFunctions;

class FieldItem extends Component {
  constructor(props) {
    super(props);
    this.state = {
      fetching: false,
      decrypted: null,
      encrypted: false,
      error: null
    };
  }

  componentDidMount = () => {
    //let e =_.sample([true, false]);
    this.setState({
      encrypted: this.props.fieldParams.field.definition.is_encrypted
    });
  };

  decryptData = () => {
    const requestOptions = {
      method: "POST",
      headers: authHeader.post(),
      credentials: "include",
      body: JSON.stringify({})
    };

    this.setState({ fetching: true });

    let url = `${baseUrl}responses/${this.props.fieldParams.field.id}/decrypt/`;

    fetch(url, requestOptions)
      .then(response => {
        if (!response.ok) {
          this.setState({ error: response.statusText, fetching: false });
        }
        return response;
      })
      .then(response => response.json())
      .then(data => {
        this.setState({ decrypted: data, fetching: false, encrypted: false });
      });
  };

  render = () => {
    let encrypted = _.sample([true, false]);
    const props = this.props.fieldParams;

    let fieldParams = Object.assign({}, this.props.fieldParams);
    fieldParams["encrypted"] = this.state.encrypted;
    fieldParams["fetching"] = this.state.fetching;
    fieldParams["decryptData"] = this.decryptData;
    fieldParams["decryptError"] = this.state.error;
    fieldParams["decryptedData"] = this.state.decrypted;

    if (this.props.fieldParams.field.answers[0] && this.state.encrypted) {
      return (
        <FormItem
          label={getLabel(props, this)}
          className={
            "from-label " +
            (_.size(props.field.selected_flag) ? " has-flag" : "")
          }
          style={{ display: "block" }}
          key={props.field.id}
          required={getRequired(props)}
          hasFeedback
          autoComplete="new-password"
          {...field_error(props)}
        >
          <div className="masked-input mr-bottom">
            {this.state.error ? "Unable to decrypt " : "encrypted data "}
            {this.state.fetching ? <Icon type="loading" /> : null}
            <span
              className="float-right text-anchor"
              onClick={this.decryptData}
            >
              show data
            </span>
          </div>
        </FormItem>
      );
    } else {
      return getFieldType(fieldParams);
    }
  };
}

export default FieldItem;
