import React, { Component } from "react";
import { connect } from "react-redux";
import { authHeader, baseUrl, handleResponse } from "../../../_helpers";
import {
  Spin,
  Icon,
  Form,
  Input,
  Radio,
  InputNumber,
  DatePicker,
  Select as AntSelect,
  Checkbox as AntCheckbox,
  Divider as AntDivider,
  Upload,
  message,
  Button
} from "antd";
import _ from "lodash";
import moment from "moment";
import ReactTelInput from "react-telephone-input";
import "react-telephone-input/lib/withStyles";
import flags from "../../../../images/flags.png";
import Dropzone from "react-dropzone";

const FormItem = Form.Item;
const RadioGroup = Radio.Group;
const Dragger = Upload.Dragger;
const Option = AntSelect.Option;

export const getLabel = props => {
  return props.field.definition.body;
};

function onFieldChange(props, value, value2) {
  props.onFieldChange(value, props, true);
}

//Field Type Text
export const Text = props => {
  return (
    <FormItem
      label={getLabel(props)}
      className="from-label"
      style={{ display: "block" }}
      key={props.field.id}
      message=""
      required={props.field.is_required}
      help={props.field.definition.help_text}
      hasFeedback
      validateStatus={props.field.answers.length !== 0 ? "success" : null}
    >
      <Input
        type="text"
        placeholder={props.field.placeholder}
        defaultValue={
          props.field.answers[0]
            ? props.field.answers[0].answer
            : props.field.definition.defaultValue
        }
        onChange={e => props.onFieldChange(e, props)}
      />
    </FormItem>
  );
};

//Field Type Boolean
export const Bool = props => {
  let defVal = props.field.answers[0]
    ? props.field.answers[0].answer
    : props.field.definition.defaultValue ? 1 : 2;

  return (
    <FormItem
      label={getLabel(props)}
      className="from-label"
      style={{ display: "block" }}
      key={props.field.id}
      required={props.field.is_required}
      help={props.field.definition.help_text}
      hasFeedback
      validateStatus={props.field.updated_at ? "success" : null}
    >
      <RadioGroup
        style={{ width: "100%" }}
        onChange={e => props.onFieldChange(e, props)}
        defaultValue={parseInt(defVal)}
      >
        <Radio value={1}>Yes</Radio>
        <Radio value={2}>No</Radio>
      </RadioGroup>
    </FormItem>
  );
};

//Field Type Number
export const Number = props => {
  return (
    <FormItem
      label={getLabel(props)}
      className="from-label"
      style={{ display: "block", width: "100%" }}
      key={props.field.id}
      message="dfsdf"
      hasFeedback
      required={props.field.is_required}
      help={props.field.definition.help_text}
      //validateStatus={"error"}
    >
      <InputNumber
        min={1}
        type="number"
        style={{ width: "100%" }}
        placeholder={props.field.placeholder}
        defaultValue={
          props.field.answers[0]
            ? props.field.answers[0].answer
            : props.field.definition.defaultValue
        }
        onChange={onFieldChange.bind(this, props)}
      />
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
      message=""
      required={props.field.is_required}
      help={props.field.definition.help_text}
      hasFeedback
      validateStatus={props.field.answers.length !== 0 ? "success" : null}
    >
      <DatePicker
        style={{ display: "block", width: "100%" }}
        placeholder={props.field.placeholder}
        onChange={onFieldChange.bind(this, props)}
        defaultValue={defaultDate ? moment(defaultAnswer2, "YYYY/MM/DD") : null}
        format={"MM-DD-YYYY"}
      />
    </FormItem>
  );
};

//Field Type Email
export const Email = props => {
  const { getFieldDecorator } = props.formProps;
  return (
    <FormItem
      label={getLabel(props)}
      className="from-label"
      style={{ display: "block" }}
      key={props.field.id}
      type="email"
      //help={"The input is not valid E-mail!"}
      required={props.field.is_required}
    >
      {getFieldDecorator("email", {
        initialValue: props.field.answers[0]
          ? props.field.answers[0].answer
          : props.field.definition.defaultValue,
        rules: [
          {
            type: "email",
            message: "The input is not valid E-mail!"
          },
          {
            required: props.field.is_required,
            message: "Please input your E-mail!"
          }
        ]
      })(
        <Input
          placeholder={props.field.placeholder}
          prefix={<Icon type="mail" style={{ color: "rgba(0,0,0,.25)" }} />}
          type="email"
          message="The input is not valid E-mail!"
          onChange={e => props.onFieldChange(e, props)}
        />
      )}
    </FormItem>
  );
};

//Field Type url
export const URL = props => {
  const { getFieldDecorator } = props.formProps;
  return (
    <FormItem
      label={getLabel(props)}
      className="from-label"
      style={{ display: "block" }}
      key={props.field.id}
      required={props.field.is_required}
      //help={props.field.help_text}
      //hasFeedback
      //validateStatus={props.field.answers.length !== 0 ? "success" : null}
    >
      {getFieldDecorator("url", {
        initialValue: props.field.answers[0]
          ? props.field.answers[0].answer
          : props.field.definition.defaultValue,
        rules: [
          {
            type: "url",
            message:
              'The input is not valid url! Valid format is "https://www.yourwebsite.com"'
          },
          {
            required: props.field.is_required,
            message: "Please input url!"
          }
        ]
      })(
        <Input
          placeholder={props.field.placeholder}
          prefix={<Icon type="global" style={{ color: "rgba(0,0,0,.25)" }} />}
          type="url"
          message="The input is not valid E-mail!"
          onChange={e => props.onFieldChange(e, props)}
        />
      )}
    </FormItem>
  );
};

//Field Type Checkbox
export const Checkbox = props => {
  return (
    <FormItem
      label={getLabel(props)}
      className="from-label"
      style={{ display: "block" }}
      key={props.field.id}
      message=""
      required={props.field.is_required}
      help={props.field.definition.help_text}
      hasFeedback
      validateStatus={props.field.answers.length !== 0 ? "success" : null}
    >
      <AntCheckbox
        onChange={e => props.onFieldChange(e, props)}
        defaultValue={
          props.field.answers[0]
            ? props.field.answers[0].answer
            : props.field.definition.defaultValue
        }
      >
        {getLabel(props)}
      </AntCheckbox>
    </FormItem>
  );
};

//Field Type Select
export const Select = props => {
  return (
    <FormItem
      label={getLabel(props)}
      className="from-label"
      style={{ display: "block" }}
      key={props.field.id}
      message=""
      required={props.field.is_required}
      help={props.field.definition.help_text}
      hasFeedback
      validateStatus={props.field.answers.length !== 0 ? "success" : null}
    >
      <AntSelect
        defaultValue="lucy"
        onChange={e => props.onFieldChange(e, props)}
      >
        <Option value="jack">Jack</Option>
        <Option value="lucy">Lucy</Option>
        <Option value="disabled">Disabled</Option>
        <Option value="Yiminghe">yiminghe</Option>
      </AntSelect>
    </FormItem>
  );
};

//Field Type File Attachment
export const Attachment = props => {
  return (
    <FormItem
      label={getLabel(props)}
      className="from-label"
      style={{ display: "block" }}
      key={props.field.id}
      message="dfsdf"
      required={props.field.is_required}
      help={props.field.definition.help_text}
      //validateStatus={props.field.completed_at ? "success" : null}
    >
      <div className="attachment-link-wrapper">
        <Button href={props.field.attachment} icon="paper-clip">
          {" "}
          Important_File_Name.pdf{props.field.attachment}
        </Button>
        {/*<a className="link antd-info" href={"#"} style={{display:'block'}}><Icon type="download"/> file name.docx{props.field.attachment}</a>*/}
      </div>
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
      required={props.field.is_required}
      help={props.field.definition.help_text}
      hasFeedback
      validateStatus={props.field.answers.length !== 0 ? "success" : null}
    >
      <ReactTelInput
        value={
          props.field.answers[0]
            ? props.field.answers[0].answer
            : props.field.definition.defaultValue
        }
        className="tel-input"
        style={{ width: "100%" }}
        defaultCountry="us"
        flagsImagePath={flags}
        onChange={onFieldChange.bind(this, props)}
        //onBlur={handleInputBlur}
      />
    </FormItem>
  );
};

//Field Type Paragraph
export const Paragraph = props => {
  return (
    <h2 key={props.field.id} className="step-form-paragraph">
      <span>{getLabel(props)}</span>
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
      required={props.field.is_required}
      help={props.field.help_text}
      hasFeedback
      validateStatus={props.field.answers.length !== 0 ? "success" : null}
    >
      <Input
        defaultValue={
          props.field.answers[0]
            ? props.field.answers[0].answer
            : props.field.definition.defaultValue
        }
        onChange={e => props.onFieldChange(e, props)}
      />
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
  constructor() {
    super();
    this.state = {
      filesList: null,
      rejectedFilesList: null,
      loading: false
    };
  }

  //on File drag n drop change
  onDrop = (acceptedFiles, rejectedFiles) => {
    this.getBase64(acceptedFiles);
    this.setState({
      filesList: acceptedFiles,
      rejectedFilesList: rejectedFiles
    });
  };

  //covert to file base 64.
  getBase64 = files => {
    let arr = [];

    _.map(files, function(file) {
      var reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = function() {
        arr.push(reader.result);
        console.log(reader.result);
      };
      reader.onerror = function(error) {
        console.log("Error: ", error);
      };
    });

    this.props.onFieldChange(arr[0], this.props, "file");
  };

  render = () => {
    return (
      <FormItem
        label={getLabel(this.props)}
        className="from-label"
        style={{ display: "block" }}
        key={this.props.field.id}
        message="dfsdf"
        required={this.props.field.is_required}
        help={this.props.field.definition.help_text}
        validateStatus={this.props.field.updated_at ? "success" : null}
      >
        <Dropzone
          //accept="image/jpeg, image/png"
          //ref={"dropzoneRef"}
          // onDragEnter={this.onDragEnter.bind(this)}
          // onDragLeave={this.onDragLeave.bind(this)}
          className="file-upload-field"
          activeClassName=" file-upload-field-active"
          rejectClassName="file-upload-field-reject"
          onDrop={this.onDrop}
          multiple={false}
          disabled={this.state.loading}
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
          {_.map(this.state.filesList, function(file, index) {
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
          })}

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
      </FormItem>
    );
  };
}

//const

export const File = props => {
  return <FileUpload {...props} />;
};
