import React from "react";
import { Button, Row, Col, Icon, Tag, Menu, Dropdown, Tooltip } from "antd";
import _ from "lodash";
import Moment from "react-moment";
import { URL_REGEX, ANCHOR_TAG_REGEX } from "../../../utils/contants";
import Anchor from "../../common/Anchor";
import IntlTooltip from "../../common/IntlTooltip";
import { getIntlBody } from "../../../_helpers/intl-helpers";

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
  isDnBIntegrationDataLoading,
  stringifyObjectValue
};

//Utility func
function getLabel(props, that) {
  const helpText = props.field.definition.help_text ? (
    <span className="pd-left-sm">
      <Tooltip title={props.field.definition.help_text}>
        <Icon
          type="info-circle"
          style={{ fontSize: "12px", color: "rgba(0,0,0,0.3)" }}
        />
      </Tooltip>
    </span>
  ) : null;

  const answeredBy =
    props.field.answers.length !== 0 ? <GetAnsweredBy {...props} /> : null;

  const required = getRequired(props) ? (
    <IntlTooltip title={"tooltips.answerIsRequiredText"}>
      <i
        title="Answer required"
        className="material-icons t-13 text-middle text-light pd-right-sm"
      >
        panorama_fish_eye
      </i>
    </IntlTooltip>
  ) : null;

  const commentClasses =
    props.field.comment_count > 0 ? "comment-icon has-comment" : "comment-icon";

  const comment = (
    <span className="float-right">
      <span className={commentClasses}>{addCommentBtn(that, props)}</span>
      {props.field.alerts
        ? props.field.alerts.map(function(item) {
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
  );

  if (that) {
    const label = (
      <span className="label-with-action">
        {comment}

        {props.field.answers.length !== 0 ? answeredBy : required}

        {props.field.label_value ? (
          <span>
            {props.field.label_value} {helpText}
          </span>
        ) : (
          <span>
            {getIntlBody(props.field.definition)} {helpText}
          </span>
        )}
      </span>
    );
    return label;
  } else {
    return props.field.label_value ? (
      <span className="label-with-action">
        {comment}
        {props.field.answers.length !== 0 ? answeredBy : required}
        {props.field.label_value} {helpText}
      </span>
    ) : (
      <span className="label-with-action">
        {comment}
        {props.field.answers.length !== 0 ? answeredBy : required}
        {getIntlBody(props.field.definition)} {helpText}
      </span>
    );
  }
}

function getExtra(props) {
  if (props.field.definition.extra.api_url) {
    const extrasFromAPI = props.currentStepFields.extrasFromAPI || {};
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
  const answer = arrayToString(value);
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
      if (string.answer === "") {
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
  const error = props.error || {};

  if (error[props.field.id]) {
    return {
      help: error[props.field.id],
      validateStatus: "error"
    };
  }
}

function getRequired(props) {
  return props.field.is_required || props.field.definition.is_required;
}

function feedValue(props) {
  const opts = {};
  if (props.field.definition.disabled) {
    opts["value"] = _.size(props.field.answers)
      ? props.field.answers[0].answer
      : props.field.definition.defaultValue;
  }
  return opts;
}

function addComment(props) {
  props.addComment(props.field.id, "field", props.isEmbedded);
}

function addCommentBtn(e, props) {
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
            <span>
              <span
                className="display-inline-block text-secondary"
                style={{ position: "relative", top: "-4px" }}
              >
                {props.field.comment_count}
              </span>{" "}
              <i className="material-icons  t-18 text-secondary">chat_bubble</i>
            </span>
          ) : (
            <i className="material-icons  t-18 text-secondary">
              chat_bubble_outline
            </i>
          )}
        </span>
      </Tooltip>
    </div>
  );
}

function selectFlag(props, flag) {
  const payload = {
    workflow: props.workflowId,
    field: props.field.id,
    flag: parseInt(flag.key)
  };
  props.changeFlag(payload);
}

function fieldFlagDropdown(e, props) {
  const flag_dropdown = (
    <Menu onClick={selectFlag.bind(e, props)}>
      {_.map(props.field.comment_flag_options, function(cfo) {
        const text_color_css = cfo.extra.color
          ? { color: cfo.extra.color }
          : {};
        return (
          <Menu.Item key={`${cfo.value}`}>
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
        <Anchor
          href="#"
          className="ant-dropdown-link text-nounderline text-metal"
        >
          <i className="material-icons text-middle t-18">outlined_flag</i>{" "}
          <Icon type="down" />
        </Anchor>
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
        return (
          '<a href="mailto:' +
          url +
          '" target="_blank" rel="noopener noreferrer">' +
          url +
          "</a>"
        );
      }

      // For all other URLs
      return `<a href="${url}" target="_blank" rel="noopener noreferrer" >${url.includes("http") ? url : `http://${url}`}</a>`;
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

  const type_button_map = {
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
    docusign: "Sign with Docusign",
    csi: "Get CSI data",
    boeing_screening_status: "Update Screening Status",
    boeing_adjudication_status: "Update Adjudication Status",
    krypton_ai_push: "Push AI data",
    adobe_sign: "Sign with AdobeSign"
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
                  key={`${index}`}
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
  const editable =
    props.currentStepFields.currentStepFields.is_editable !== undefined
      ? props.currentStepFields.currentStepFields.is_editable
      : true;

  const disabled =
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
    const answer = props.field.answers[0];
    const ans = (
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
        <i className="material-icons t-13 text-middle text-green pd-right-sm">
          check_circle
        </i>
      </Tooltip>
    );
  } else {
    return;
  }
}

const GetAnsweredBy = props => {
  if (props.field.answers[0] && props.field.answers[0].submitted_by) {
    const answer = props.field.answers[0];
    const ans = (
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
        <i className="material-icons t-13  text-green pd-right-sm">
          check_circle
        </i>
      </Tooltip>
    );
  } else {
    return <span />;
  }
};

function isDnBIntegrationDataLoading(props) {
  return (
    props.currentStepFields.integration_data_loading ||
    (props.integration_json &&
      props.integration_json.status_message ===
        "Fetching data for this field...")
  );
}

function stringifyObjectValue(arry) {
  let hasNumber = false;
  const fristObj = arry[0];

  //check if object has number type value
  Object.keys(fristObj).forEach(key => {
    if (typeof fristObj[key] === "number") {
      hasNumber = true;
    }
  });

  if (hasNumber) {
    //convert number type to string
    arry.forEach(obj => {
      Object.keys(obj).forEach(key => {
        if (typeof obj[key] === "number") {
          obj[key] = "" + obj[key];
        }
      });
    });
  }

  return arry;
}
