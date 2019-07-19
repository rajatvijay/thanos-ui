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

  decryptURL = () => {
    let answerObj = this.props.fieldParams.field.answers[0];
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
    let url = baseUrl + this.decryptURL();
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
    fieldParams["stepData"] = this.props.stepData;

    let dynamicUserPerm = this.props.fieldParams.dynamicUserPerms;
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
      if (this.props.fieldParams.field.definition.field_type == "file") {
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
    } else if (this.props.fieldParams.field.regex_value) {
      return <FieldRegexValidator {...this.props} />;
    } else {
      return getFieldType(fieldParams);
    }
  };
}

class FieldRegexValidator extends Component {
  constructor() {
    super();
    this.state = {
      isValidAnswer: true
    };
  }

  onFieldChangeValidate = (e, payload, cal) => {
    const { regex_value } = this.props.fieldParams.field;
    const re = new RegExp(regex_value);
    let ans = null;

    if (payload.field.regex_value) {
      if (cal) {
        ans = e || e === 0 ? e : "";
      } else if (e.target) {
        ans = e.target.value;
      }

      this.setState({ isValidAnswer: re.test(ans) }, function() {
        if (this.state.isValidAnswer) {
          this.props.fieldParams.onFieldChange(e, payload, cal);
        }
      });
    } else {
      this.props.fieldParams.onFieldChange(e, payload, cal);
    }
  };

  render() {
    let defError = "";
    let fieldParams = Object.assign({}, this.props.fieldParams);
    const error = fieldParams.error;

    fieldParams["onFieldChange"] = this.onFieldChangeValidate;

    if (error === undefined || !Array.isArray(error)) {
      defError = error;
      fieldParams.error = [];
    } else if (error && error.detail) {
      defError = error.detail;
    }

    if (defError && typeof defError === "string") {
      defError = fieldParams.field.regex_error + ". " + defError;
    } else {
      defError = fieldParams.field.regex_error;
    }

    fieldParams.error[fieldParams.field.id] =
      (!this.state.isValidAnswer && defError) || "";

    return getFieldType(fieldParams);
  }
}

export default FieldItem;
