import React, { Component } from "react";
import {
  Form,
  Input,
  Button,
  Row,
  Col,
  Table,
  Icon,
  Divider,
  Select,
  Tabs,
  Tag,
  Menu,
  Dropdown,
  Tooltip
} from "antd";
import _ from "lodash";

export const commonFunctions = {
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
  getLink,
  getStyle,
  getIntegrationSearchButton,
  fieldFlagDropdown,
  isDisabled
};

//Utility func
function getLabel(props, that) {
  if (that) {
    let label = (
      <span className="label-with-action">
        <span className="float-right">
          {addCommentBtn(that, props)}
          {fieldFlagDropdown(that, props)}
        </span>

        {props.field.definition.body}
      </span>
    );
    return label;
  } else {
    return props.field.definition.body;
  }
}

function onFieldChange(props, value, value2) {
  props.onFieldChange(value, props, true);
}

function onFieldChangeArray(props, value) {
  let answer = arrayToString(value);
  onFieldChange(props, answer);
}

function arrayToString(arr) {
  let string = "";
  _.map(arr, function(i, index) {
    string = string + i;
    if (index !== arr.length - 1) string = string + "~";
  });

  return string;
}

function stringToArray(string) {
  let arr = [];
  if (string) {
    if (string.answer.isArray) {
      arr = string.answer[0].split("~");
    } else {
      if (string.answer == "") {
        arr = [];
      } else {
        arr = string.answer.split("~");
      }
    }
    return arr;
  } else {
    return arr;
  }
}

function field_error(props) {
  let error = props.error || {};
  if (error[props.field.id]) {
    return {
      help: error[props.field.id],
      validateStatus: "error"
    };
  }
  return {
    help: (
      <span
        dangerouslySetInnerHTML={{
          __html: getLink(props.field.definition.help_text)
        }}
      />
    ),
    validateStatus: props.field.answers.length !== 0 ? "success" : null
  };
}

function getRequired(props) {
  return props.field.is_required || props.field.definition.is_required;
}

function feedValue(props) {
  var opts = {};
  if (props.field.definition.disabled) {
    opts["value"] = _.size(props.field.answers)
      ? props.field.answers[0].answer
      : props.field.definition.defaultValue;
  }
  return opts;
}

function addComment(props) {
  props.addComment(props.field.id, "field");
}

function addCommentBtn(e, props) {
  let comment_btn_text = "Add Comments/Questions";
  if (props.field.comment_count == 1) {
    comment_btn_text = "1 comment";
  } else if (props.field.comment_count > 1) {
    comment_btn_text = props.field.comment_count + " comments";
  }
  return (
    <div className="add_comment_btn" onClick={addComment.bind(e, props)}>
      <Tooltip placement="topRight" title={comment_btn_text}>
        <span>
          {" "}
          {props.field.comment_count > 0 ? (
            <span className="pd-right-md">{props.field.comment_count}</span>
          ) : null}{" "}
          <i className="material-icons  t-18 text-secondary">
            chat_bubble_outline
          </i>
        </span>
      </Tooltip>
    </div>
  );
}

function selectFlag(props, flag) {
  let payload = {
    workflow: props.workflowId,
    field: props.field.id,
    flag: parseInt(flag.key)
  };
  console.log(payload);
  props.changeFlag(payload);
}

function fieldFlagDropdown(e, props) {
  let flag_dropdown = (
    <Menu onClick={selectFlag.bind(e, props)}>
      {_.map(props.field.comment_flag_options, function(cfo) {
        let text_color_css = cfo.extra.color ? { color: cfo.extra.color } : {};
        return (
          <Menu.Item key={cfo.value}>
            <i
              className="material-icons t-18 "
              style={{
                verticalAlign: "text-bottom",
                color: text_color_css.color
              }}
            >
              fiber_manual_record
            </i>{" "}
            {cfo.label}
          </Menu.Item>
        );
      })}
    </Menu>
  );
  return (
    <div
      style={{
        float: "right",
        marginLeft: "10px",
        marginTop: "1px",
        marginRight: "10px"
      }}
    >
      <Dropdown overlay={flag_dropdown}>
        <a
          className="ant-dropdown-link text-nounderline text-secondary"
          href="#"
        >
          <i className="material-icons text-middle t-18">outlined_flag</i>{" "}
          <Icon type="down" />
        </a>
      </Dropdown>
    </div>
  );
}

//create link from text
function getLink(text) {
  var urlRegex = /(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.()~#?&//=]*)/gi;

  return text.replace(urlRegex, function(url) {
    if (_.includes(url, "@")) {
      return '<a href="mailto:' + url + '" target="_blank">' + url + "</a>";
    } else {
      if (!_.includes(url, "http")) {
        url = "http://" + url;
      }
      return '<a href="' + url + '" target="_blank">' + url + "</a>";
    }
  });
}

function getStyle(props, extra) {
  let css = {};
  if (
    _.size(props.field.selected_flag) &&
    props.field.selected_flag[props.field.id]
  ) {
    css = props.field.selected_flag[props.field.id]["flag_detail"]["extra"];
  }
  return css;
}

function getIntegrationSearchButton(props) {
  // need to figure out how to change the name on search button

  let type_button_map = {
    dnb_company_profile: "Get Company profile",
    dnb_risk_score: "Get Risk scores",
    dnb_data_reader: "Get Data",
    salesforce: "Post Salesforce data",
    dnb_directors: "DnB Directors",
    iban_search: "Validate IBAN",
    eu_vat_check: "Validate VAT",
    us_tin_check: "Validate TIN",
    charity_check: "Get Charity Information",
    whois_search: "Get WhoIS data",
    clearbit_search: "Get Clearbit data",
    csv_search: "Search CSV",
    ln_search: "Search LexisNexis",
    dnb_livingstone: "Screen for Sanctions & Watchlists",
    dnb_ubo: "Get UBOs",
    dnb_directors: "Get List of Directors",
    dnb_duns_search: "Search D-U-N-S",
    dnb_duns_search_direct_plus: "Search D-U-N-S Direct+",
    google_search: "Google Search",
    dnb_rdc: "Get DNB Screening",
    dnb_financials: "Get Financial Statements",
    dnb_litigation: "Get Bankcryptcy Statements",
    translation: "Translate",
    transliteration: "Transliterate"
  };

  let button_name = type_button_map[props.field.definition.field_type];
  _.map(props.field.search_param_data, function(c) {
    if (c.button_text) {
      button_name = c.button_text;
      return false;
    }
  });

  return (
    <Row gutter={16} style={{ marginBottom: "50px" }}>
      <Col>
        <Button
          type="primary"
          className="btn-block float-left"
          onClick={props.onSearch}
          style={{ width: "auto", marginRight: "20px" }}
        >
          {button_name}
        </Button>
      </Col>

      <Col style={{ marginTop: "5px" }}>
        {_.map(props.field.search_param_data, function(item) {
          if (_.size(item.answer) && item.answer.answer)
            return (
              <div className="float-left" style={{ marginRight: "15px" }}>
                <span>{item.answer.field__definition__body}</span>:{" "}
                <span>{item.answer.answer}</span>,
              </div>
            );
        })}
      </Col>
    </Row>
  );
}

function isDisabled(props) {
  //let editable = props.currentStepFields.currentStepFields.is_editable;
  let editable = true;

  let disabled =
    props.completed ||
    props.is_locked ||
    props.field.definition.disabled ||
    !_.includes(props.permission, "Can add response") ||
    !_.includes(props.permission, "Can change response") ||
    !_.includes(props.permission, "Can delete response")
      ? true
      : false;

  if (!editable) {
    return true;
  } else {
    return disabled;
  }
}
