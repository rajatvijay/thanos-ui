import React, { Component } from "react";
import { Icon, Form } from "antd";
import _ from "lodash";
import { authHeader } from "../../_helpers";
import { getFieldType } from "./field-types";
import { commonFunctions } from "./field-types/commons";
import { apiBaseURL } from "../../../config";

const FormItem = Form.Item;
const { getLabel, field_error } = commonFunctions;

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
    this.setState({
      encrypted: this.props.fieldParams.field.definition.is_encrypted
    });
  };

  decryptURL = () => {
    const answerObj = this.props.fieldParams.field.answers[0];
    if (answerObj) {
      return `responses/${answerObj.id}/decrypt/`;
    }
  };

  decryptData = () => {
    const requestOptions = {
      method: "GET",
      headers: authHeader.get(),
      credentials: "include"
    };

    this.setState({ fetching: true });
    const url = apiBaseURL + this.decryptURL();
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
    const props = this.props.fieldParams;

    const fieldParams = Object.assign({}, this.props.fieldParams);
    fieldParams["encrypted"] = this.state.encrypted;
    fieldParams["fetching"] = this.state.fetching;
    fieldParams["decryptData"] = this.decryptData;
    fieldParams["decryptError"] = this.state.error;
    fieldParams["decryptedData"] = this.state.decrypted;
    fieldParams["stepData"] = this.props.stepData;

    const dynamicUserPerm = this.props.fieldParams.dynamicUserPerms;
    let showButton = false;

    if (
      _.includes(
        this.props.fieldParams.permission,
        "Can decrypt fields in a step"
      ) ||
      (dynamicUserPerm &&
        _.size(dynamicUserPerm.third_party_vendor) &&
        _.includes(dynamicUserPerm.third_party_vendor, "decrypt_fields"))
    ) {
      showButton = true;
    }

    if (this.props.fieldParams.field.answers[0] && this.state.encrypted) {
      if (this.props.fieldParams.field.definition.field_type === "file") {
        if (showButton) {
          fieldParams["decryptURL"] = this.decryptURL();
        }
        return getFieldType(fieldParams);
      }

      // TODO: this needs to be refactored by moving `decrypt` API to a service
      // and masked UI to TextField
      return (
        <FormItem
          label={getLabel(props, this)}
          className={
            "from-label " +
            (_.size(props.field.selected_flag) ? " has-flag" : "")
          }
          style={{ display: "block" }}
          key={props.field.id}
          //hasFeedback
          autoComplete="new-password"
          {...field_error(props)}
        >
          <div className="masked-input mr-bottom">
            {this.state.error ? "Unable to decrypt " : "Masked"}
            {this.state.fetching ? <Icon type="loading" /> : null}
            {showButton ? (
              <span
                className="float-right text-anchor"
                onClick={this.decryptData}
              >
                Show
              </span>
            ) : null}
          </div>
        </FormItem>
      );
    } else {
      return getFieldType(fieldParams);
    }
  };
}

export default FieldItem;
