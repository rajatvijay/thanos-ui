import React, { Component } from "react";
import { authHeader } from "../../../_helpers";
import {
  Icon,
  Form,
  Input,
  Radio,
  InputNumber,
  DatePicker,
  Select as AntSelect,
  Divider as AntDivider,
  Button,
  Cascader,
  notification
} from "antd";
import _ from "lodash";
import moment from "moment";
import ReactTelInput from "react-telephone-input";
import "react-telephone-input/lib/withStyles";
import flags from "../../../../images/flags2.png";
import Dropzone from "react-dropzone";
import { workflowStepActions } from "../../../actions";
import { commonFunctions } from "./commons";
import { FormattedMessage } from "react-intl";
import validator from "validator";
import { ESign } from "./esign.js";
import {
  apiBaseURL,
  siteOrigin,
  supportedFieldFormats
} from "../../../../config";
import { validateUploadFile } from "../../../utils/files";
import { getIntlBody } from "../../../_helpers/intl-helpers";
import FormattedTextInput from "../../../../modules/common/components/FormattedTextInput";

const FormItem = Form.Item;
const RadioGroup = Radio.Group;
const { Option } = AntSelect;
const { TextArea } = Input;

//Common utility fucntions bundled in one file commons.js//
const {
  getLabel,
  getExtra,
  onFieldChange,
  onFieldChangeArray,
  stringToArray,
  field_error,
  feedValue,
  getLink,
  getStyle,
  isDisabled,
  convertValueToString
} = commonFunctions;

const openNotificationWithIcon = data => {
  notification[data.type]({
    message: data.message,
    description: data.body,
    placement: "bottomLeft"
  });
};

//Field Type Text
export class Text extends Component {
  state = {
    inputText: this.props.decryptedData
      ? this.props.decryptedData.answer
      : this.props.field.answers[0]
      ? this.props.field.answers[0].answer
      : this.props.field.definition.defaultValue
  };

  get format() {
    // TODO:
    // The condition below must be removed as soon as we are getting
    // definition.extra.format === "duns"
    if (
      /d-u-n-s\snumber/i.test(_.get(this.props, "field.definition.body", null))
    )
      return supportedFieldFormats.duns;
    return supportedFieldFormats[
      _.get(this.props, "field.definition.extra.format", null)
    ];
  }

  componentDidUpdate(prevProps) {
    const inputText = this.props.decryptedData
      ? this.props.decryptedData.answer
      : this.props.field.answers[0]
      ? this.props.field.answers[0].answer
      : this.props.field.definition.defaultValue;
    const prevInputText = prevProps.decryptedData
      ? prevProps.decryptedData.answer
      : prevProps.field.answers[0]
      ? prevProps.field.answers[0].answer
      : prevProps.field.definition.defaultValue;
    if (inputText !== prevInputText) {
      this.setState({ inputText });
    }
  }
  onChange = e => {
    const { value } = e.target;
    this.setState({ inputText: value });
    this.props.onFieldChange(e, this.props);
  };

  onBlur = e => this.props.onFieldChange(e, this.props);

  get inputProps() {
    const { props } = this;
    let rows = _.get(props, "field.definition.meta.height", 1);

    let fieldProps = {
      disabled: isDisabled(props),
      autosize: { minRows: rows },
      placeholder: props.field.placeholder,
      value: this.state.inputText,
      autoComplete: "new-password",
      onChange: this.onChange,
      onBlur: this.onBlur,
      style: getStyle(props)
    };

    if (this.format) fieldProps.format = this.format;

    return fieldProps;
  }

  render() {
    const { props } = this;

    let TextFieldComponent = this.format ? FormattedTextInput : TextArea;
    return (
      <FormItem
        label={getLabel(props, this)}
        className={
          "from-label " + (_.size(props.field.selected_flag) ? " has-flag" : "")
        }
        style={{ display: "block" }}
        key={props.field.id}
        message=""
        hasFeedback
        autoComplete="new-password"
        {...field_error(props)}
      >
        <TextFieldComponent {...this.inputProps} />
      </FormItem>
    );
  }
}

//Field Type Boolean
export const Bool = props => {
  const defVal = props.field.answers[0]
    ? props.field.answers[0].answer
    : props.field.definition.defaultValue !== ""
    ? props.field.definition.defaultValue
    : null;

  const that = this;
  return (
    <FormItem
      label={getLabel(props, that)}
      className="from-label"
      style={{ display: "block" }}
      key={props.field.id}
      hasFeedback
      {...field_error(props)}
    >
      <RadioGroup
        style={{ width: "100%" }}
        onChange={e => props.onFieldChange(e, props)}
        defaultValue={defVal ? defVal : null}
      >
        <Radio value={"True"} disabled={isDisabled(props)}>
          <FormattedMessage id="commonTextInstances.yes" />
        </Radio>
        <Radio disabled={isDisabled(props)} value={"False"}>
          <FormattedMessage id="commonTextInstances.no" />
        </Radio>
      </RadioGroup>
    </FormItem>
  );
};

//Field Type Number
export const Number = props => {
  const that = this;
  return (
    <FormItem
      label={getLabel(props, that)}
      className="from-label"
      style={{ display: "block" }}
      key={props.field.id}
      hasFeedback
      {...field_error(props)}
    >
      <InputNumber
        disabled={isDisabled(props)}
        min={0}
        type="number"
        style={{ width: "100%" }}
        placeholder={props.field.placeholder}
        defaultValue={
          props.field.answers[0]
            ? props.field.answers[0].answer
            : props.field.definition.defaultValue
        }
        {...feedValue(props)}
        autoComplete="new-password"
        onChange={onFieldChange.bind(this, props)}
        onBlur={e => props.onFieldChange(e, props)}
      />
    </FormItem>
  );
};

//Field Type Date
export const Date = props => {
  const defaultAnswer = props.field.answers[0]
    ? props.field.answers[0].answer
    : props.field.definition.defaultValue;

  const defaultDate = moment.utc(defaultAnswer, "YYYY-MM-DD").isValid();
  let defaultAnswer2 = moment.utc().format("YYYY/MM/DD");
  if (defaultDate) {
    defaultAnswer2 = moment.utc(defaultAnswer).format("YYYY/MM/DD");
  }
  const that = this;
  return (
    <FormItem
      label={getLabel(props, that)}
      className="from-label"
      style={{ display: "block" }}
      key={props.field.id}
      hasFeedback
      {...field_error(props)}
    >
      <DatePicker
        disabled={isDisabled(props)}
        style={{ width: "100%" }}
        placeholder={props.field.placeholder}
        onChange={onFieldChange.bind(this, props)}
        value={defaultDate ? moment.utc(defaultAnswer2, "YYYY/MM/DD") : null}
        format={"MM-DD-YYYY"}
      />
    </FormItem>
  );
};

//Field Type Email

class Email2 extends React.Component {
  constructor() {
    super();
    this.state = {
      isValidEamil: ""
    };
  }

  onChangeValidate = e => {
    const valid = validator.isEmail(e.target.value);
    this.setState({ isValidEamil: valid });
    if (valid) {
      this.props.onFieldChange(e, this.props);
    }
  };

  fielderror = () => {
    const ferr = field_error(this.props);

    if (this.state.isValidEamil === false) {
      return {
        help: <FormattedMessage id="errorMessageInstances.invalidEmail" />,
        validateStatus: "error"
      };
    } else {
      return ferr;
    }
  };

  render = () => {
    const props = this.props;
    const that = this;
    return (
      <FormItem
        label={getLabel(props, that)}
        className="from-label"
        style={{ display: "block" }}
        key={props.field.id}
        type="email"
        hasFeedback
        autoComplete="new-password"
        help={this.state.isValidEamil === false ? "invalid email" : null}
        validateStatus={this.state.isValidEamil === false ? "error" : ""}
        {...this.fielderror()}
      >
        <Input
          disabled={isDisabled(props)}
          placeholder={props.field.placeholder}
          prefix={<Icon type="mail" style={{ color: "rgba(0,0,0,.25)" }} />}
          type="email"
          defaultValue={
            props.field.answers[0]
              ? props.field.answers[0].answer
              : props.field.definition.defaultValue
          }
          autoComplete="new-password"
          onChange={e => this.onChangeValidate(e)}
          onBlur={e => this.onChangeValidate(e)}
          title={"E-Mail"}
          {...feedValue(props)}
        />
      </FormItem>
    );
  };
}

export const Email = props => {
  return <Email2 {...props} />;
};

//Field Type url
class URL2 extends React.Component {
  constructor() {
    super();
    this.state = {
      isValidUrl: null
    };
  }

  onChangeValidate = e => {
    const valid = validator.isURL(e.target.value);
    this.setState({ isValidUrl: valid });
    if (valid) {
      this.props.onFieldChange(e, this.props);
    }
  };

  fielderror = () => {
    const ferr = field_error(this.props);

    if (this.state.isValidUrl === false) {
      return {
        help: <FormattedMessage id="errorMessageInstances.invalidURL" />,
        validateStatus: "error"
      };
    } else {
      return ferr;
    }
  };

  render = () => {
    const props = this.props;
    const that = this;
    const disableStyle = {
      pointerEvents: "none",
      cursor: "default"
    };
    const nonDisableStyle = {
      cursor: "pointer"
    };
    return (
      <FormItem
        label={getLabel(props, that)}
        className="from-label"
        style={{ display: "block" }}
        key={props.field.id}
        hasFeedback
        {...this.fielderror(props)}
      >
        {!props.completed ? (
          <a
            href={
              props.field.answers[0]
                ? props.field.answers[0].answer
                : props.field.definition.defaultValue
            }
            style={isDisabled(props) ? nonDisableStyle : disableStyle}
            target="_blank"
          >
            <Input
              disabled={isDisabled(props)}
              placeholder={props.field.placeholder}
              prefix={
                <Icon type="global" style={{ color: "rgba(0,0,0,.25)" }} />
              }
              type="url"
              autoComplete="new-password"
              onChange={e => this.onChangeValidate(e)}
              defaultValue={
                props.field.answers[0]
                  ? props.field.answers[0].answer
                  : props.field.definition.defaultValue
              }
              onBlur={e => this.onChangeValidate(e)}
              {...feedValue(props)}
            />
          </a>
        ) : (
          <span>
            <span className="ant-input-affix-wrapper">
              <span className="ant-input-prefix">
                <i
                  className="anticon anticon-global"
                  style={{ color: "rgba(0, 0, 0, 0.25)" }}
                />
              </span>
              <div className="ant-input ant-input-disabled url-field">
                <a
                  href={
                    props.field.answers[0]
                      ? props.field.answers[0].answer
                      : props.field.definition.defaultValue
                  }
                  target="_blank"
                >
                  {props.field.answers[0]
                    ? props.field.answers[0].answer
                    : props.field.definition.defaultValue}
                </a>
              </div>
            </span>
          </span>
        )}
      </FormItem>
    );
  };
}

export const URL = props => {
  return <URL2 {...props} />;
};

//Field Type Select
export const Select = props => {
  const single =
    props.field.definition.field_type === "single_select" ? true : false;
  let save = onFieldChange.bind(this, props);

  if (!single) {
    save = onFieldChangeArray.bind(this, props);
  }
  const that = this;

  const options = convertValueToString(getExtra(props)) || [];

  let answer = props.field.answers[0]
    ? single
      ? props.field.answers[0].answer
      : stringToArray(props.field.answers[0])
    : stringToArray(props.field.definition.defaultValue);

  return (
    <FormItem
      label={getLabel(props, that)}
      className="from-label"
      style={{ display: "block" }}
      key={props.field.id}
      message=""
      hasFeedback
      {...field_error(props)}
    >
      <AntSelect
        allowClear
        mode={single ? "default" : "multiple"}
        style={getStyle(props)}
        disabled={isDisabled(props)}
        value={answer}
        onChange={save}
        showSearch={true}
        filterOption={(input, option) =>
          option.props.children
            .toString()
            .toLowerCase()
            .indexOf(input.toLowerCase()) >= 0
        }
      >
        {options.length &&
          options.map(function(item, index) {
            return (
              <Option key={`${item.value}`} value={item.value}>
                {item.label}
              </Option>
            );
          })}
      </AntSelect>
    </FormItem>
  );
};

//Field Type Phone Number
export const Phone = props => {
  const that = this;
  return (
    <FormItem
      label={getLabel(props, that)}
      className="from-label"
      style={{ display: "block" }}
      key={props.field.id}
      message=""
      hasFeedback
      {...field_error(props)}
    >
      <ReactTelInput
        disabled={isDisabled(props)}
        value={
          props.field.answers[0]
            ? props.field.answers[0].answer
            : props.field.definition.defaultValue
        }
        className={isDisabled(props) ? "tel-input disabled" : "tel-input"}
        defaultCountry="us"
        flagsImagePath={flags}
        onChange={onFieldChange.bind(this, props)}
        onBlur={e => props.onFieldChange(e, props)}
      />
    </FormItem>
  );
};

//Field Type Paragraph
export const Paragraph = props => {
  const { extra } = props.field.definition;
  const customParaStyle = {
    fontSize: extra.font_size || "",
    textDecoration: extra.underline ? "underline" : "",
    color: extra.font_color || "",
    paddingBottom: 4
  };

  return (
    <h2
      key={props.field.id}
      className={
        "step-form-paragraph" +
        (extra.font_weight === "normal" ? "text-normal" : "")
      }
      style={customParaStyle}
    >
      {props.field.definition.extra.icon ? (
        <i
          className="material-icons"
          style={{ color: props.field.definition.extra.iconColor }}
        >
          {props.field.definition.extra.icon}{" "}
        </i>
      ) : null}

      {props.field.definition.extra.logo ? (
        <img
          src={props.field.definition.extra.logo}
          className="para-logo"
          alt=""
        />
      ) : null}
      <span
        dangerouslySetInnerHTML={{
          __html: getLink(getIntlBody(props.field.definition))
        }}
      />
    </h2>
  );
};

//Field Type List option select
export const List = props => {
  const that = this;
  return (
    <FormItem
      label={getLabel(props, that)}
      className="from-label"
      style={{ display: "block" }}
      key={props.field.id}
      message=""
      {...field_error(props)}
      hasFeedback
      validateStatus={props.field.answers.length !== 0 ? "success" : ""}
    >
      list
    </FormItem>
  );
};

//Field Type Break
export const Break = props => {
  return <div key={props.field.id} className="clea-fix step-form-break" />;
};

//Field Type Divider
export const Divider = props => {
  return (
    <div key={props.field.id} className="clea-fix mr-top mr-bottom">
      <AntDivider />
    </div>
  );
};

//Field Type File Upload
class FileUpload extends Component {
  constructor(props) {
    super(props);
    this.state = {
      filesList: null,
      rejectedFilesList: null,
      encrypted: props.encrypted,
      decryptURL: props.decryptURL,
      loading: false
    };
  }

  componentDidMount = () => {};

  componentWillReceiveProps = nextProps => {
    //reload workflow list if the filters change.
    if (this.props !== nextProps) {
      this.setState({
        loading: false,
        encrypted: nextProps.encrypted,
        decryptURL: nextProps.decryptURL
      });
    }
  };

  onUpload = e => {
    const file = e[0];
    const { valid: isFileValid, error } = validateUploadFile({ file });
    if (isFileValid) {
      this.setState({
        filesList: e,
        loading: true
      });
      // TODO Back-end error is still not shown - need to show it
      this.props.onFieldChange(file, this.props, "file");
    } else {
      openNotificationWithIcon({
        type: "error",
        message: error
      });
    }
  };

  removeFile = () => {
    this.setState({ loading: true });
    const payload = {
      workflow: this.props.workflowId,
      field: this.props.field.id,
      responseId: this.props.field.answers[0].id
    };

    this.props.dispatch(workflowStepActions.removeAttachment(payload));
  };

  showDecryptURL = () => {
    this.setState({
      encrypted: false
    });
  };

  render = () => {
    const that = this;
    const { field } = this.props;
    const url = this.state.decryptURL
      ? `${siteOrigin}/api/v1/${this.state.decryptURL}`
      : field.answers[0] && field.answers[0].attachment;

    return (
      <FormItem
        label={getLabel(this.props, that)}
        className="from-label"
        style={{ display: "block" }}
        key={field.id}
        {...field_error(this.props)}
      >
        <Dropzone
          className={
            isDisabled(this.props)
              ? "file-upload-field disabled"
              : "file-upload-field"
          }
          activeClassName=" file-upload-field-active"
          rejectClassName="file-upload-field-reject"
          onDrop={this.onUpload}
          multiple={false}
          disabled={this.state.loading || isDisabled(this.props)}
        >
          <div className="drop-area-text">
            {!this.state.loading ? (
              <div>
                <p className="upload-drag-icon">
                  <i className="material-icons" style={{ fontSize: "40px" }}>
                    file_upload
                  </i>
                </p>
                <p className="ant-upload-text">
                  <FormattedMessage id="fields.dragFile" />
                </p>
              </div>
            ) : (
              <div>
                <p className="upload-drag-icon">
                  <Icon type="loading" spin style={{ fontSize: "40px" }} />
                </p>
                <p className="ant-upload-text">
                  <Icon type="loading" />
                </p>
              </div>
            )}
          </div>
        </Dropzone>

        {this.state.encrypted ? (
          <div className="masked-input mr-bottom">
            <FormattedMessage id="fields.masked" />
            {this.props.decryptURL ? (
              <span
                className="float-right text-anchor"
                onClick={this.showDecryptURL}
              >
                <FormattedMessage id="fields.show" />
              </span>
            ) : null}
          </div>
        ) : (
          <div className="ant-upload-list ant-upload-list-text">
            {url ? (
              <div
                className="ant-upload-list-item ant-upload-list-item-done"
                key={"file-1"}
              >
                <div className="ant-upload-list-item-info">
                  <span style={{ display: "flex" }}>
                    <Icon type="paper-clip" />
                    <a
                      href={url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="ant-upload-list-item-name"
                    >
                      {field.answers[0].attachment.substring(
                        field.answers[0].attachment.lastIndexOf("/") + 1,
                        field.answers[0].attachment.lastIndexOf("?")
                      )}
                    </a>
                    {this.props.completed ? (
                      <i
                        title="Remove file"
                        className="anticon anticon-cross disabled"
                      />
                    ) : (
                      <Icon type="close-circle" onClick={this.removeFile} />
                    )}
                  </span>
                </div>
              </div>
            ) : null}
          </div>
        )}
      </FormItem>
    );
  };
}

//const

export const File = props => {
  return <FileUpload {...props} />;
};

//Field Type File Attachment
class AttachmentDownload extends Component {
  state = { fetching: false };

  componentDidMount = () => {};

  generateFile = () => {
    const requestOptions = {
      method: "POST",
      headers: authHeader.post(),
      credentials: "include",
      body: JSON.stringify({ workflow: this.props.workflowId })
    };

    this.setState({ fetching: true });

    fetch(
      apiBaseURL +
        "fields/" +
        this.props.field.definition.id +
        "/download_attachment/?format=json",
      requestOptions
    )
      .then(response => response.json())
      .then(body => {
        this.setState({ fetching: false }, function() {
          window.open(body.object_url);
        });
      });
  };

  render = () => {
    const that = this;
    let hasAttachment = null;
    if (this.props.field.answers[0] && this.props.field.answers[0].attachment) {
      hasAttachment = this.props.field.answers[0].attachment;
    }
    return (
      <div>
        <FormItem
          label={getLabel(this.props, that)}
          className="from-label attachment-field"
          style={{ display: "block" }}
          key={this.props.field.id}
          hasFeedback
          {...field_error(this.props)}
        >
          {hasAttachment ? (
            <Button
              icon="paper-clip"
              href={hasAttachment}
              target="_blank"
              rel="noopener noreferrer"
              className="ant-btn-primary"
            >
              <FormattedMessage id="fields.downloadFile" />
            </Button>
          ) : (
            <Button
              icon="paper-clip"
              onClick={this.generateFile}
              loading={this.state.fetching}
              className="ant-btn-primary"
            >
              <FormattedMessage id="fields.downloadFile" />
            </Button>
          )}
        </FormItem>
        {this.props.field.definition.extra.esign_enabled ? (
          <ESign {...this.props} />
        ) : null}
      </div>
    );
  };
}

export const Attachment = props => {
  return <AttachmentDownload {...props} />;
};

//Field Type Cascader
export const CascaderField = props => {
  const that = this;
  return (
    <FormItem
      label={getLabel(props, that)}
      className="from-label"
      style={{ display: "block" }}
      key={props.field.id}
      hasFeedback
      {...field_error(props)}
    >
      <Cascader
        disabled={isDisabled(props)}
        defaultValue={
          props.field.answers[0]
            ? stringToArray(props.field.answers[0])
            : props.field.definition.defaultValue
        }
        onChange={onFieldChangeArray.bind(this, props)}
        options={props.field.definition.extra}
      />
    </FormItem>
  );
};

//Field Type Select
export const RadioField = props => {
  const that = this;
  return (
    <FormItem
      label={getLabel(props, that)}
      className="from-label"
      style={{ display: "block" }}
      key={props.field.id}
      message=""
      hasFeedback
      {...field_error(props)}
    >
      <RadioGroup
        disabled={isDisabled(props)}
        value={
          props.field.answers[0]
            ? props.field.answers[0].answer
            : props.field.definition.defaultValue
        }
        onChange={e => props.onFieldChange(e, props)}
        style={getStyle(props)}
      >
        {_.map(getExtra(props), function(item, index) {
          return (
            <Radio key={`${index}`} value={item.value}>
              {item.label}
            </Radio>
          );
        })}
      </RadioGroup>
    </FormItem>
  );
};

export const IFrameField = props => {
  return (
    <iframe
      title={"Linked field"}
      style={{ minHeight: 400, width: "100%" }}
      frameBorder="0"
      src={props.field.definition.extra.iframe_url}
    />
  );
};
