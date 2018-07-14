import React, { Component } from "react";
import { authHeader, baseUrl } from "../../../_helpers";
import {
  Icon,
  Form,
  Input,
  Radio,
  InputNumber,
  DatePicker,
  Select as AntSelect,
  Checkbox as AntCheckbox,
  Divider as AntDivider,
  Button,
  Cascader,
  Row,
  Col
} from "antd";
import _ from "lodash";
import moment from "moment";
import ReactTelInput from "react-telephone-input";
import "react-telephone-input/lib/withStyles";
import flags from "../../../../images/flags.png";
import Dropzone from "react-dropzone";
import validator from "validator";
import { commonFunctions } from "./commons";

const FormItem = Form.Item;
const RadioGroup = Radio.Group;
const Option = AntSelect.Option;

//Common utility fucntions bundled in one file commons.js//
const {
  getLabel,
  onFieldChange,
  onFieldChangeArray,
  arrayToString,
  stringToArray,
  field_error,
  getRequired,
  feedValue,
  addComment,
  addCommentBtn,
  getLink
} = commonFunctions;

//Field Type Text
export const Text = props => {
  return (
    <FormItem
      label={getLabel(props)}
      className="from-label"
      style={{ display: "block" }}
      key={props.field.id}
      message=""
      required={getRequired(props)}
      //help={props.field.definition.help_text}
      hasFeedback
      autoComplete="new-password"
      //validateStatus={props.field.answers.length !== 0 ? "success" : null}
      {...field_error(props)}
    >
      <Input
        disabled={
          props.completed || props.is_locked || props.field.definition.disabled
        }
        type="text"
        placeholder={props.field.placeholder}
        defaultValue={
          props.field.answers[0]
            ? props.field.answers[0].answer
            : props.field.definition.defaultValue
        }
        {...feedValue(props)}
        autoComplete="new-password"
        autoComplete="new-password"
        onChange={e => props.onFieldChange(e, props)}
        //onBlur={e => props.onFieldChange(e, props)}
      />

      {addCommentBtn(this, props)}
    </FormItem>
  );
};

//Field Type Boolean
export const Bool = props => {
  let defVal = props.field.answers[0]
    ? props.field.answers[0].answer
    : props.field.definition.defaultValue !== ""
      ? props.field.definition.defaultValue
      : null;

  return (
    <FormItem
      label={getLabel(props)}
      className="from-label"
      style={{ display: "block" }}
      key={props.field.id}
      required={getRequired(props)}
      hasFeedback
      {...field_error(props)}
    >
      <RadioGroup
        style={{ width: "100%" }}
        onChange={e => props.onFieldChange(e, props)}
        defaultValue={defVal ? parseInt(defVal, 10) : null}
      >
        <Radio
          disabled={
            props.completed ||
            props.is_locked ||
            props.field.definition.disabled
          }
          value={1}
        >
          Yes
        </Radio>
        <Radio
          disabled={
            props.completed ||
            props.is_locked ||
            props.field.definition.disabled
          }
          value={2}
        >
          No
        </Radio>
      </RadioGroup>
      {addCommentBtn(this, props)}
    </FormItem>
  );
};

//Field Type Number
export const Number = props => {
  return (
    <FormItem
      label={getLabel(props)}
      className="from-label"
      style={{ display: "block" }}
      key={props.field.id}
      required={getRequired(props)}
      hasFeedback
      {...field_error(props)}
    >
      <InputNumber
        disabled={
          props.completed || props.is_locked || props.field.definition.disabled
        }
        min={1}
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
        autoComplete="new-password"
        onChange={onFieldChange.bind(this, props)}
      />
      {addCommentBtn(this, props)}
    </FormItem>
  );
};

//Field Type Date
export const Date = props => {
  let defaultAnswer = props.field.answers[0]
    ? props.field.answers[0].answer
    : props.field.definition.defaultValue;

  let defaultDate = moment(defaultAnswer, "YYYY-MM-DD").isValid();
  let defaultAnswer2 = moment().format("YYYY/MM/DD");
  if (defaultDate) {
    defaultAnswer2 = moment(defaultAnswer).format("YYYY/MM/DD");
  }

  return (
    <FormItem
      label={getLabel(props)}
      className="from-label"
      style={{ display: "block" }}
      key={props.field.id}
      required={getRequired(props)}
      hasFeedback
      {...field_error(props)}
    >
      <DatePicker
        disabled={
          props.completed || props.is_locked || props.field.definition.disabled
        }
        style={{ width: "100%" }}
        placeholder={props.field.placeholder}
        onChange={onFieldChange.bind(this, props)}
        defaultValue={defaultDate ? moment(defaultAnswer2, "YYYY/MM/DD") : null}
        format={"MM-DD-YYYY"}
      />
      {addCommentBtn(this, props)}
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
    let valid = validator.isEmail(e.target.value);
    this.setState({ isValidEamil: valid });
    if (valid) {
      this.props.onFieldChange(e, this.props);
    }
  };

  fielderror = () => {
    let ferr = field_error(this.props);

    if (this.state.isValidEamil === false) {
      return {
        help: "Invalid email",
        validateStatus: "error"
      };
    } else {
      return ferr;
    }
  };

  render = () => {
    const props = this.props;
    return (
      <FormItem
        label={getLabel(props)}
        className="from-label"
        style={{ display: "block" }}
        key={props.field.id}
        type="email"
        required={getRequired(props)}
        hasFeedback
        autoComplete="new-password"
        help={this.state.isValidEamil === false ? "invalid email" : null}
        validateStatus={this.state.isValidEamil === false && "error"}
        {...this.fielderror()}
      >
        <Input
          disabled={
            props.completed ||
            props.is_locked ||
            props.field.definition.disabled
          }
          placeholder={props.field.placeholder}
          prefix={<Icon type="mail" style={{ color: "rgba(0,0,0,.25)" }} />}
          type="email"
          defaultValue={
            props.field.answers[0]
              ? props.field.answers[0].answer
              : props.field.definition.defaultValue
          }
          autoComplete="new-password"
          message="The input is not valid email"
          onChange={e => this.onChangeValidate(e)}
          {...feedValue(props)}
        />

        {addCommentBtn(this, props)}
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
    let valid = validator.isURL(e.target.value);
    this.setState({ isValidUrl: valid });
    if (valid) {
      this.props.onFieldChange(e, this.props);
    }
  };

  fielderror = () => {
    let ferr = field_error(this.props);

    if (this.state.isValidUrl === false) {
      return {
        help: "Invalid url",
        validateStatus: "error"
      };
    } else {
      return ferr;
    }
  };

  render = () => {
    const props = this.props;
    return (
      <FormItem
        label={getLabel(props)}
        className="from-label"
        style={{ display: "block" }}
        key={props.field.id}
        required={getRequired(props)}
        hasFeedback
        {...this.fielderror(props)}
      >
        <Input
          disabled={
            props.completed ||
            props.is_locked ||
            props.field.definition.disabled
          }
          placeholder={props.field.placeholder}
          prefix={<Icon type="global" style={{ color: "rgba(0,0,0,.25)" }} />}
          type="url"
          autoComplete="new-password"
          message="The input is not valid email"
          onChange={e => this.onChangeValidate(e)}
          defaultValue={
            props.field.answers[0]
              ? props.field.answers[0].answer
              : props.field.definition.defaultValue
          }
          {...feedValue(props)}
        />

        {addCommentBtn(this, props)}
      </FormItem>
    );
  };
}

export const URL = props => {
  return <URL2 {...props} />;
};

//Field Type Checkbox
const CheckboxGroup = AntCheckbox.Group;
export const Checkbox = props => {
  let defVal = [{ label: "Yes", value: "true" }];

  return (
    <FormItem
      label={getLabel(props)}
      className="from-label"
      style={{ display: "block" }}
      key={props.field.id}
      required={getRequired(props)}
      hasFeedback
      {...field_error(props)}
    >
      <CheckboxGroup
        disabled={
          props.completed || props.is_locked || props.field.definition.disabled
        }
        style={{ width: "100%" }}
        options={
          !_.isEmpty(props.field.definition.extra)
            ? props.field.definition.extra
            : defVal
        }
        onChange={onFieldChangeArray.bind(this, props)}
        defaultValue={
          props.field.answers[0]
            ? stringToArray(props.field.answers[0])
            : props.field.definition.defaultValue
        }
        {...feedValue(props)}
      />
      {addCommentBtn(this, props)}
    </FormItem>
  );
};

//Field Type Select
export const Select = props => {
  let single =
    props.field.definition.field_type === "single_select" ? true : false;
  let save = onFieldChange.bind(this, props);

  if (!single) {
    save = onFieldChangeArray.bind(this, props);
  }

  return (
    <FormItem
      label={getLabel(props)}
      className="from-label"
      style={{ display: "block" }}
      key={props.field.id}
      message=""
      required={getRequired(props)}
      hasFeedback
      {...field_error(props)}
    >
      <AntSelect
        allowClear
        mode={single ? "default" : "multiple"}
        disabled={
          props.completed || props.is_locked || props.field.definition.disabled
        }
        defaultValue={
          props.field.answers[0]
            ? single
              ? props.field.answers[0].answer
              : stringToArray(props.field.answers[0])
            : props.field.definition.defaultValue
        }
        onChange={save}
        showSearch={true}
      >
        {_.map(props.field.definition.extra, function(item, index) {
          return (
            <Option key={index} value={item.value}>
              {item.label}
            </Option>
          );
        })}
      </AntSelect>
      {addCommentBtn(this, props)}
    </FormItem>
  );
};

//Field Type Phone Number
export const Phone = props => {
  return (
    <FormItem
      label={getLabel(props)}
      className="from-label"
      style={{ display: "block" }}
      key={props.field.id}
      message=""
      required={getRequired(props)}
      hasFeedback
      {...field_error(props)}
    >
      <ReactTelInput
        disabled={
          props.completed || props.is_locked || props.field.definition.disabled
        }
        value={
          props.field.answers[0]
            ? props.field.answers[0].answer
            : props.field.definition.defaultValue
        }
        className={props.completed ? "tel-input disabled" : "tel-input"}
        //style={{ width: "100%" }}
        defaultCountry="us"
        flagsImagePath={flags}
        onChange={onFieldChange.bind(this, props)}
        //onBlur={handleInputBlur}
      />
      {addCommentBtn(this, props)}
    </FormItem>
  );
};

//Field Type Paragraph
export const Paragraph = props => {
  return (
    <h2 key={props.field.id} className="step-form-paragraph">
      <span
        dangerouslySetInnerHTML={{
          __html: getLink(props.field.definition.body)
        }}
      />
    </h2>
  );
};

//Field Type List option select
export const List = props => {
  return (
    <FormItem
      label={getLabel(props)}
      className="from-label"
      style={{ display: "block" }}
      key={props.field.id}
      message=""
      required={getRequired(props)}
      {...field_error(props)}
      hasFeedback
      validateStatus={props.field.answers.length !== 0 ? "success" : null}
    >
      list
      {addCommentBtn(this, props)}
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
      loading: false
    };
  }

  componentWillReceiveProps = nextProps => {
    //reload workflow list if the filters change.
    if (this.props !== nextProps) {
      this.setState({ loading: false });
    }
  };

  onUpload = e => {
    this.setState({
      filesList: e,
      loading: true
      //rejectedFilesList: rejectedFiles
    });
    let value = e[0];
    this.props.onFieldChange(value, this.props, "file");
  };

  render = () => {
    const { field } = this.props;

    return (
      <FormItem
        label={getLabel(this.props)}
        className="from-label"
        style={{ display: "block" }}
        key={field.id}
        required={getRequired(this.props)}
        {...field_error(this.props)}
      >
        <Dropzone
          //accept="image/jpeg, image/png"
          //ref={"dropzoneRef"}
          // onDragEnter={this.onDragEnter.bind(this)}
          // onDragLeave={this.onDragLeave.bind(this)}
          className={
            this.props.completed
              ? "file-upload-field disabled"
              : "file-upload-field"
          }
          activeClassName=" file-upload-field-active"
          rejectClassName="file-upload-field-reject"
          onDrop={this.onUpload}
          multiple={false}
          disabled={this.state.loading || this.props.completed}
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
                  Click or drag file to this area to upload
                </p>
              </div>
            ) : (
              <div>
                <p className="upload-drag-icon">
                  <Icon type="loading" spin style={{ fontSize: "40px" }} />
                </p>
                <p className="ant-upload-text">uploading...</p>
              </div>
            )}
          </div>
        </Dropzone>

        <div className="ant-upload-list ant-upload-list-text">
          {this.state.filesList ? (
            _.map(this.state.filesList, function(file, index) {
              return (
                <div
                  className="ant-upload-list-item ant-upload-list-item-done"
                  key={"file-" + index}
                >
                  <div className="ant-upload-list-item-info">
                    <span>
                      <i className="anticon anticon-paper-clip" />
                      <a
                        href=""
                        target="_blank"
                        rel="noopener noreferrer"
                        className="ant-upload-list-item-name"
                        title={file.name}
                      >
                        {file.name}
                      </a>
                    </span>
                  </div>
                  <i title="Remove file" className="anticon anticon-cross" />
                </div>
              );
            })
          ) : (
            <div
              className="ant-upload-list-item ant-upload-list-item-done"
              key={"file-1"}
            >
              <div className="ant-upload-list-item-info">
                {field.answers[0] ? (
                  <span>
                    <i className="anticon anticon-paper-clip" />
                    <a
                      href={field.answers[0].attachment}
                      target="_blank"
                      className="ant-upload-list-item-name"
                    >
                      {field.answers[0].attachment.substring(
                        field.answers[0].attachment.lastIndexOf("/") + 1,
                        field.answers[0].attachment.lastIndexOf("?")
                      )}
                    </a>
                  </span>
                ) : null}
              </div>
              <i title="Remove file" className="anticon anticon-cross" />
            </div>
          )}

          {_.map(this.state.rejectedFilesList, function(file, index) {
            return (
              <div
                className="ant-upload-list-item ant-upload-list-item-error"
                key={"file-" + index}
              >
                <div className="ant-upload-list-item-info">
                  <span>
                    <i className="anticon anticon-paper-clip" />
                    <a
                      href=""
                      target="_blank"
                      rel="noopener noreferrer"
                      className="ant-upload-list-item-name"
                      title={file.name}
                    >
                      {file.name}
                    </a>
                  </span>
                </div>
                <i title="Remove file" className="anticon anticon-cross" />
              </div>
            );
          })}
        </div>
        {addCommentBtn(this, this.props)}
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
      baseUrl +
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
    return (
      <div>
        <FormItem
          label={getLabel(this.props)}
          className="from-label attachment-field"
          style={{ display: "block" }}
          key={this.props.field.id}
          required={getRequired(this.props)}
          hasFeedback
          {...field_error(this.props)}
        >
          <Button
            //disabled={this.props.completed}
            icon="paper-clip"
            onClick={this.generateFile}
            loading={this.state.fetching}
          >
            Download file
          </Button>
        </FormItem>
        {addCommentBtn(this, this.props)}
      </div>
    );
  };
}

export const Attachment = props => {
  return <AttachmentDownload {...props} />;
};

//Field Type Cascader
export const CascaderField = props => {
  return (
    <FormItem
      label={getLabel(props)}
      className="from-label"
      style={{ display: "block" }}
      key={props.field.id}
      required={getRequired(props)}
      hasFeedback
      {...field_error(props)}
    >
      <Cascader
        disabled={
          props.completed || props.is_locked || props.field.definition.disabled
        }
        defaultValue={
          props.field.answers[0]
            ? stringToArray(props.field.answers[0])
            : props.field.definition.defaultValue
        }
        onChange={onFieldChangeArray.bind(this, props)}
        options={props.field.definition.extra}
      />
      {addCommentBtn(this, props)}
    </FormItem>
  );
};
