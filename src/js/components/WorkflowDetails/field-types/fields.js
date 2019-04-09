import React, { Component } from "react";
import { authHeader, baseUrl, baseUrl2 } from "../../../_helpers";
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
  Col,
  Tooltip
} from "antd";
import _ from "lodash";
import Moment from "react-moment";
import moment from "moment";
import ReactTelInput from "react-telephone-input";
import "react-telephone-input/lib/withStyles";
import flags from "../../../../images/flags2.png";
import Dropzone from "react-dropzone";
import { workflowStepActions } from "../../../actions";
import { commonFunctions } from "./commons";
import validator from "validator";
import { ESign } from "./esign.js";

const FormItem = Form.Item;
const RadioGroup = Radio.Group;
const Option = AntSelect.Option;
const { TextArea } = Input;

//Common utility fucntions bundled in one file commons.js//
const {
  getLabel,
  getExtra,
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

const GetAnsweredBy = props => {
  if (props.field.answers[0] && props.field.answers[0].submitted_by) {
    let answer = props.field.answers[0];
    let ans = (
      <span>
        Answered by{" "}
        {answer.submitted_by.first_name +
          " " +
          answer.submitted_by.last_name +
          " "}
        ( {answer.submitted_by.email}) on{" "}
        <Moment format="MM/DD/YYYY">{answer.updated_at}</Moment>
      </span>
    );
    return (
      <Tooltip placement="topLeft" title={ans}>
        <span className="floater">&nbsp;</span>
      </Tooltip>
    );
  } else {
    return <span />;
  }
};

//Field Type Text
export const Text = props => {
  let css = {};
  if (props.field.selected_flag[props.field.id]) {
    css = props.field.selected_flag[props.field.id]["flag_detail"]["extra"];
  }

  let that = this;

  let rows =
    props.field.definition.meta && props.field.definition.meta.height
      ? props.field.definition.meta.height
      : 1;

  return (
    <FormItem
      label={getLabel(props, that)}
      className={
        "from-label " + (_.size(props.field.selected_flag) ? " has-flag" : "")
      }
      style={{ display: "block" }}
      key={props.field.id}
      message=""
      required={getRequired(props)}
      hasFeedback
      autoComplete="new-password"
      {...field_error(props)}
    >
      <TextArea
        disabled={isDisabled(props)}
        autosize={{ minRows: rows }}
        placeholder={props.field.placeholder}
        defaultValue={
          props.decryptedData
            ? props.decryptedData.answer
            : props.field.answers[0]
              ? props.field.answers[0].answer
              : props.field.definition.defaultValue
        }
        {...feedValue(props)}
        autoComplete="new-password"
        autoComplete="new-password"
        onChange={e => props.onFieldChange(e, props)}
        onBlur={e => props.onFieldChange(e, props)}
        style={getStyle(props)}
      />
      <GetAnsweredBy {...props} />
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

  let that = this;
  return (
    <FormItem
      label={getLabel(props, that)}
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
        defaultValue={defVal ? defVal : null}
      >
        <Radio value={"True"} disabled={isDisabled(props)}>
          Yes
        </Radio>
        <Radio disabled={isDisabled(props)} value={"False"}>
          No
        </Radio>
      </RadioGroup>
      <GetAnsweredBy {...props} />
    </FormItem>
  );
};

//Field Type Number
export const Number = props => {
  let that = this;
  return (
    <FormItem
      label={getLabel(props, that)}
      className="from-label"
      style={{ display: "block" }}
      key={props.field.id}
      required={getRequired(props)}
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
        autoComplete="new-password"
        onChange={onFieldChange.bind(this, props)}
        onBlur={e => props.onFieldChange(e, props)}
      />
      <GetAnsweredBy {...props} />
    </FormItem>
  );
};

//Field Type Date
export const Date = props => {
  let defaultAnswer = props.field.answers[0]
    ? props.field.answers[0].answer
    : props.field.definition.defaultValue;

  let defaultDate = moment.utc(defaultAnswer, "YYYY-MM-DD").isValid();
  let defaultAnswer2 = moment.utc().format("YYYY/MM/DD");
  if (defaultDate) {
    defaultAnswer2 = moment.utc(defaultAnswer).format("YYYY/MM/DD");
  }
  let that = this;
  return (
    <FormItem
      label={getLabel(props, that)}
      className="from-label"
      style={{ display: "block" }}
      key={props.field.id}
      required={getRequired(props)}
      hasFeedback
      {...field_error(props)}
    >
      <DatePicker
        disabled={isDisabled(props)}
        style={{ width: "100%" }}
        placeholder={props.field.placeholder}
        onChange={onFieldChange.bind(this, props)}
        defaultValue={
          defaultDate ? moment.utc(defaultAnswer2, "YYYY/MM/DD") : null
        }
        format={"MM-DD-YYYY"}
      />
      <GetAnsweredBy {...props} />
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
    let that = this;
    return (
      <FormItem
        label={getLabel(props, that)}
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
          message="The input is not valid email"
          onChange={e => this.onChangeValidate(e)}
          onBlur={e => this.onChangeValidate(e)}
          {...feedValue(props)}
        />
        <GetAnsweredBy {...props} />
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
    let that = this;
    return (
      <FormItem
        label={getLabel(props, that)}
        className="from-label"
        style={{ display: "block" }}
        key={props.field.id}
        required={getRequired(props)}
        hasFeedback
        {...this.fielderror(props)}
      >
        {!props.completed ? (
          <Input
            disabled={isDisabled(props)}
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
            onBlur={e => this.onChangeValidate(e)}
            {...feedValue(props)}
          />
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
                >
                  {props.field.answers[0]
                    ? props.field.answers[0].answer
                    : props.field.definition.defaultValue}
                </a>
              </div>
            </span>
          </span>
        )}
        <GetAnsweredBy {...props} />
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
  let that = this;
  return (
    <FormItem
      label={getLabel(props, that)}
      className="from-label"
      style={{ display: "block" }}
      key={props.field.id}
      required={getRequired(props)}
      hasFeedback
      {...field_error(props)}
    >
      <CheckboxGroup
        disabled={isDisabled(props)}
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
      <GetAnsweredBy {...props} />
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
  let that = this;
  return (
    <FormItem
      label={getLabel(props, that)}
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
        style={getStyle(props)}
        disabled={isDisabled(props)}
        value={
          props.field.answers[0]
            ? single
              ? props.field.answers[0].answer
              : stringToArray(props.field.answers[0])
            : stringToArray(props.field.definition.defaultValue)
        }
        onChange={save}
        showSearch={true}
        filterOption={(input: any, option: any) =>
          option.props.children
            .toString()
            .toLowerCase()
            .indexOf(input.toLowerCase()) >= 0
        }
        //filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
      >
        {_.map(getExtra(props), function(item, index) {
          return (
            <Option key={index} value={item.value}>
              {item.label}
            </Option>
          );
        })}
      </AntSelect>
      <GetAnsweredBy {...props} />
    </FormItem>
  );
};

//Field Type Phone Number
export const Phone = props => {
  let that = this;
  return (
    <FormItem
      label={getLabel(props, that)}
      className="from-label"
      style={{ display: "block" }}
      key={props.field.id}
      message=""
      required={getRequired(props)}
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
        //style={{ width: "100%" }}
        defaultCountry="us"
        flagsImagePath={flags}
        onChange={onFieldChange.bind(this, props)}
        onBlur={e => props.onFieldChange(e, props)}
        //onBlur={handleInputBlur}
      />
      <GetAnsweredBy {...props} />
    </FormItem>
  );
};

//Field Type Paragraph
export const Paragraph = props => {
  const { extra } = props.field.definition;
  const customParaStyle = {
    fontSize: extra.font_size || "",
    textDecoration: extra.underline ? "underline" : "",
    color: extra.font_color || ""
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
        <img src={props.field.definition.extra.logo} className="para-logo" />
      ) : null}
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
  let that = this;
  return (
    <FormItem
      label={getLabel(props, that)}
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
    this.setState({
      filesList: e,
      loading: true
      //rejectedFilesList: rejectedFiles
    });
    let value = e[0];
    this.props.onFieldChange(value, this.props, "file");
  };

  removeFile = () => {
    this.setState({ loading: true });
    let payload = {
      workflow: this.props.workflowId,
      field: this.props.field.definition.id,
      responseId: this.props.field.answers[0].id
    };

    this.props.dispatch(workflowStepActions.removeAttachment(payload));
    console.log("file removed");
  };

  showDecryptURL = () => {
    this.setState({
      encrypted: false
    });
  };

  render = () => {
    let that = this;
    const { field } = this.props;
    let url = this.state.decryptURL
      ? baseUrl2 + this.state.decryptURL
      : field.answers[0] && field.answers[0].attachment;

    return (
      <FormItem
        label={getLabel(this.props, that)}
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

        {this.state.encrypted ? (
          <div className="masked-input mr-bottom">
            {"Masked"}
            {this.props.decryptURL ? (
              <span
                className="float-right text-anchor"
                onClick={this.showDecryptURL}
              >
                Show
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

            {/*_.map(this.state.rejectedFilesList, function(file, index) {
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
          })*/}
          </div>
        )}
        <GetAnsweredBy {...this.props} />
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
    let that = this;
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
          required={getRequired(this.props)}
          hasFeedback
          {...field_error(this.props)}
        >
          {hasAttachment ? (
            <Button
              //disabled={this.props.completed}
              icon="paper-clip"
              href={hasAttachment}
              target="_blank"
              className="ant-btn-primary"
            >
              Download file
            </Button>
          ) : (
            <Button
              //disabled={this.props.completed}
              icon="paper-clip"
              onClick={this.generateFile}
              loading={this.state.fetching}
              className="ant-btn-primary"
            >
              Download file
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
  let that = this;
  return (
    <FormItem
      label={getLabel(props, that)}
      className="from-label"
      style={{ display: "block" }}
      key={props.field.id}
      required={getRequired(props)}
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
      <GetAnsweredBy {...props} />
    </FormItem>
  );
};

//Field Type Select
export const RadioField = props => {
  let save = onFieldChange.bind(this, props);

  let that = this;
  return (
    <FormItem
      label={getLabel(props, that)}
      className="from-label"
      style={{ display: "block" }}
      key={props.field.id}
      message=""
      required={getRequired(props)}
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
            <Radio key={index} value={item.value}>
              {item.label}
            </Radio>
          );
        })}
      </RadioGroup>
      <GetAnsweredBy {...props} />
    </FormItem>
  );
};

export const IFrameField = props => {
  return (
    <iframe
      width="300"
      height="600"
      frameBorder="0"
      src={props.field.definition.extra.iframe_url}
    />
  );
};
