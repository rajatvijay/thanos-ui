import React, { Component } from "react";
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
  getStyle
};

//Utility func
function getLabel(props) {
  return props.field.definition.body;
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
  let comment_btn_text = "Add comment";
  if (props.field.comment_count == 1) {
    comment_btn_text = "1 comment";
  } else if (props.field.comment_count > 1) {
    comment_btn_text = props.field.comment_count + " comments";
  }
  return (
    <div className="add_comment_btn" onClick={addComment.bind(e, props)}>
      <span>{comment_btn_text}</span>
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
  if (props.field.selected_flag[props.field.id]) {
    css = props.field.selected_flag[props.field.id]["flag_detail"]["extra"];
  }
  return css;
}
