import React from "react";
import { Button, Row, Col, Icon, Tag, Menu, Dropdown, Tooltip } from "antd";
import _ from "lodash";
import Moment from "react-moment";
import { URL_REGEX, ANCHOR_TAG_REGEX } from "../../../utils/contants";

export const commonFunctions = {
  getLabel,
  getExtra,
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
  isDisabled,
  getAnsweredBy,
  isDnBIntegrationDataLoading
};

//Utility func
function getLabel(props, that) {
  if (that) {
    let label = (
      <span className="label-with-action">
        <span className="float-right">
          {addCommentBtn(that, props)}
          {/*fieldFlagDropdown(that, props)*/}

          {_.size(props.field.alerts)
            ? _.map(props.field.alerts, function(item) {
                return (
                  <Tag key={item.alert.id} className="v-tag alert-metal ">
                    {item.alert.category.name}{" "}
                    <i
                      className="material-icons text-middle pd-left-sm"
                      style={{
                        fontSize: "12px",
                        color: item.alert.category.color_label
                      }}
                    >
                      fiber_manual_records
                    </i>
                  </Tag>
                );
              })
            : null}
        </span>

        {props.field.label_value
          ? props.field.label_value
          : props.field.definition.body}
      </span>
    );
    return label;
  } else {
    return props.field.label_value
      ? props.field.label_value
      : props.field.definition.body;
  }
}

function getExtra(props) {
  if (props.field.definition.extra.api_url) {
    let extrasFromAPI = props.currentStepFields.extrasFromAPI || {};
    return (
      extrasFromAPI[props.field.definition.tag] ||
      props.field.definition.extra.defaultValue
    );
  }
  return props.field.definition.extra;
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
    // TODO: Remove dangerouslySetInnerHTML
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
  let comment_btn_text = "Add comment/question";
  if (props.field.comment_count == 1) {
    comment_btn_text = "1 comment";
  } else if (props.field.comment_count > 1) {
    comment_btn_text = props.field.comment_count + " comments";
  }
  return (
    <div className="add_comment_btn" onClick={addComment.bind(e, props)}>
      <Tooltip
        placement="topRight"
        title={props.intl.formatMessage(
          { id: "stepBodyFormInstances.commentsButtonText" },
          { count: props.field.comment_count }
        )}
      >
        <span>
          {" "}
          {props.field.comment_count > 0 ? (
            <span
              className="display-inline-block text-secondary"
              style={{ position: "relative", top: "-4px" }}
            >
              {props.field.comment_count}
            </span>
          ) : null}{" "}
          <i
            className={
              "material-icons  t-18 " +
              (props.field.comment_count > 0 ? "text-secondary" : "text-metal")
            }
          >
            {props.field.comment_count > 0
              ? "chat_bubble"
              : "chat_bubble_outline"}
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
        <a className="ant-dropdown-link text-nounderline text-metal" href="#">
          <i className="material-icons text-middle t-18">outlined_flag</i>{" "}
          <Icon type="down" />
        </a>
      </Dropdown>
    </div>
  );
}

//create link from text
// TODO: Move this to utilities file
/**
 * Converts a simple string with url but no anchor tag
 * to a string with anchor tag
 * @param {string} text String to replace the URL from
 * @param {*} tag Human readable name for the URL
 */
function getLink(text) {
  // FOR BACKWARD COMPATIBILITY
  // If it has url but no anchor tag, make it an anchor tag
  if (URL_REGEX.test(text) && !ANCHOR_TAG_REGEX.test(text)) {
    return text.replace(URL_REGEX, function(url) {
      // For email URLS
      if (url.includes("@")) {
        return '<a href="mailto:' + url + '" target="_blank">' + url + "</a>";
      }

      // For all other URLs
      return `<a href="${
        url
      }" target="_blank" rel="noopener noreferrer">${url.includes("http") ? url : `http://${url}`}</a>`;
    });
  }

  return text;
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
    dnb_cmp_ent_vw: "Get Complaince Entity View",
    dnb_cmpcvf: "Get CMPCVF",
    dnb_familytree: "Get Family Tree",
    translation: "Translate",
    transliteration: "Transliterate",
    thomson_reuters_group: "Get TR group",
    thomson_reuters_case: "Create TR case",
    thomson_reuters_screen: "Screen TR case",
    thomson_reuters_screenresult: "Get TR Screening results",
    thomson_reuters_wcprofile: "Get TR World Check profile",
    thomson_reuters_screen_sync: "Get TR Screening results",
    thomson_reuters_casesystemid: "Get TR case system id",
    thomson_reuters_resolve_result: "Get TR resolve result",
    duplicate_check: "Get Duplicates",
    dnb_gbo: "Get GBO",
    greylist_check: "Get Greylist",
    dnb_initiate_investigation: "Initiate Investigation",
    dnb_investigation_status: "Get Investigation Status",
    ocr: "Get OCR data",
    docusign: "Sign with Docusign"
  };

  let button_name = type_button_map[props.field.definition.field_type];
  _.map(props.field.search_param_data, function(c) {
    if (c.button_text) {
      button_name = c.button_text;
      return false;
    }
  });

  return (
    <Row gutter={16} style={{ marginBottom: "30px" }}>
      {!props.field.definition.extra.hide_integration_button ? (
        <Col>
          <Button
            type="primary"
            className="btn-block float-left"
            onClick={props.onSearch}
            style={{ width: "auto", marginRight: "20px" }}
            disabled={isDisabled(props)}
          >
            {button_name}
          </Button>
        </Col>
      ) : null}
      {!props.field.definition.extra.hide_integration_text ? (
        <Col style={{ marginTop: "5px" }}>
          {_.map(props.field.search_param_data, function(item, index) {
            if (_.size(item.answer) && item.answer.answer)
              return (
                <div
                  key={index}
                  className="float-left"
                  style={{ marginRight: "15px" }}
                >
                  <span>{item.answer.field__definition__body}</span>:{" "}
                  <span>{item.answer.answer}</span>
                  {_.size(props.field.search_param_data) === index + 1
                    ? ""
                    : ","}
                </div>
              );
          })}
        </Col>
      ) : null}
    </Row>
  );
}

function isDisabled(props) {
  let editable =
    props.currentStepFields.currentStepFields.is_editable !== undefined
      ? props.currentStepFields.currentStepFields.is_editable
      : true;

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

function getAnsweredBy(props) {
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
    return;
  }
}

function isDnBIntegrationDataLoading(props) {
  return (
    props.currentStepFields.integration_data_loading ||
    (props.integration_json &&
      props.integration_json.status_message ==
        "Fetching data for this field...")
  );
}
