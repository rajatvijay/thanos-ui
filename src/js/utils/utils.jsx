import React from "react";
import _ from "lodash";

const Utils = () => {};

Utils.prototype.isArrayEqual = function(array1, array2) {
  return (
    JSON.stringify(array1.slice().sort()) ===
    JSON.stringify(array2.slice().sort())
  );
};

Utils.prototype.startsWith = function(string, suffix) {
  return string.indexOf(suffix) === 0;
};

Utils.prototype.endsWith = function(string, suffix) {
  return string.indexOf(suffix, string.length - suffix.length) !== -1;
};

Utils.prototype.getQueryStringFromURL = function(url) {
  return url.split("?")[1] || url.split("?")[0];
};

Utils.prototype.queryStringToObject = function(qs) {
  if (qs[0] === "?") {
    qs = qs.slice(1);
  }
  const obj = {};
  _.each(qs.split("&"), function(param) {
    if (param !== "") {
      param = param.split("=");
      const name = param[0];
      const value = param[1];
      const old_value = obj[name];
      if (old_value === undefined) {
        obj[name] = value;
      } else {
        if (_.isArray(old_value)) {
          old_value.push(value);
          obj[name] = old_value;
        } else {
          const new_value = [old_value, value];
          obj[name] = new_value;
        }
      }
    }
  });
  return obj;
};

Utils.prototype.objectToQueryString = function(obj) {
  let qs = "";
  _.each(obj, function(value, key) {
    if (_.isArray(value)) {
      _.each(value, function(val) {
        qs += "&" + key + "=" + val;
      });
    } else {
      qs += "&" + key + "=" + value;
    }
  });
  qs = qs.slice(1);
  qs = "?" + qs;
  return qs;
};

Utils.prototype.getParamValueFromQueryString = function(url, name) {
  const that = this;
  if (!url) {
    return null;
  }
  const search = url.split("?")[1] || url.split("?")[0];
  if (search) {
    const param = _.find(search.split("&"), function(param) {
      return that.startsWith(param, name + "=");
    });
    if (param) {
      return param.split("=")[1];
    }
  }
  return null;
};

Utils.prototype.InfiniteValueGenerator = function(values) {
  if (!_.isArray(values) || values.length === 0) {
    throw Error("Argument 1 must be a non-empty array");
  }
  this._values = values;
  this._index = 0;
  this.next = function() {
    let value = this._values[this._index++];
    if (value === undefined) {
      this._index = 0;
      value = this.next();
    }
    return value;
  };
  this.reset = function() {
    this._index = 0;
  };
  return this;
};

Utils.prototype.RandomValueGenerator = function(values) {
  if (!_.isArray(values) || values.length === 0) {
    throw Error("Argument 1 must be a non-empty array");
  }
  this._values = values;
  this._previousValue = null;
  this.length = this._values.length - 1;

  this.next = function() {
    const value = this._values[_.random(0, this.length)];
    if (value === this._previousValue) {
      return this.next();
    } else {
      this._previousValue = value;
      return value;
    }
  };
  return this;
};

Utils.prototype.isValidUrl = function(str) {
  const pattern = new RegExp(
    "^(https?:\\/\\/)?" + // protocol
    "((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|" + // domain name
    "((\\d{1,3}\\.){3}\\d{1,3}))" + // OR ip (v4) address
    "(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*" + // port and path
    "(\\?[;&a-z\\d%_.~+=-]*)?" + // query string
      "(\\#[-a-z\\d_]*)?$",
    "i"
  ); // fragment locator
  if (!pattern.test(str)) {
    return false;
  } else {
    return true;
  }
};

Utils.prototype.invertColor = function(hexTripletColor) {
  let color = hexTripletColor;
  color = color.substring(1); // remove #
  color = parseInt(color, 16); // convert to integer
  color = 0xffffff ^ color; // invert three bytes
  color = color.toString(16); // convert to hex
  color = ("000000" + color).slice(-6); // pad with leading zeros
  color = "#" + color; // prepend #
  return color;
};

Utils.prototype.lightOrDarkColor = function(color) {
  const r = parseInt(color.slice(1, 3), 16);
  const g = parseInt(color.slice(3, 5), 16);
  const b = parseInt(color.slice(5, 7), 16);
  const brightness = (r * 299 + g * 587 + b * 114) / 1000;
  if (brightness < 180) {
    return "#FFFFFF";
  } else {
    return "#00000";
  }
};

Utils.prototype.toRGBA = function(color, _alpha) {
  const alpha = _alpha || 255;
  const r = parseInt(color.slice(1, 3), 16);
  const g = parseInt(color.slice(3, 5), 16);
  const b = parseInt(color.slice(5, 7), 16);
  return "rgba(" + r + "," + g + "," + b + "," + alpha + ")";
};

Utils.prototype.toHex = function(color) {
  const rgba = _.map(color.slice(5, -1).split(","), function(val) {
    return Number(val);
  });
  const r = rgba[0],
    g = rgba[1],
    b = rgba[2],
    a = rgba[3];
  if (r > 255 || g > 255 || b > 255 || a > 255)
    throw Error("Invalid color component");
  return (
    (256 + r).toString(16).substr(1) +
    (((1 << 24) + (g << 16)) | (b << 8) | a).toString(16).substr(1)
  );
};

Utils.prototype.truncatedJoin = function(list, n, delimiter) {
  const items = _.take(list, n);
  let value = items.join(delimiter);
  const more = list.length - items.length;
  if (more > 0) {
    value += " & " + more + " more";
  }
  return value;
};

Utils.prototype.filenameFromURL = function(url) {
  const a = document.createElement("a");
  a.href = url;
  return decodeURIComponent(_.last(a.pathname.split("/")));
};

Utils.prototype.getGrade = function(score, inverse, size) {
  const grade = this.getGradeChar(score, inverse).toUpperCase();

  const gradeColor = {
    A: "success",
    B: "success",
    C: "warning",
    D: "danger",
    E: "danger"
  };

  return (
    <span>
      <span
        className={"grade-badge " + gradeColor[grade] + " grade-badge-" + size}
      >
        {grade}
      </span>
      <br />
    </span>
  );
};

Utils.prototype.getGradeChar = function(_score, inverse) {
  const score = Math.abs(_score);
  let grade = "e";

  if (score >= 80) {
    grade = "a";
  } else if (score >= 60) {
    grade = "b";
  } else if (score >= 40) {
    grade = "c";
  } else if (score >= 20) {
    grade = "d";
  }

  return grade;
};

Utils.prototype.getGradeCharCard = function(_score, inverse) {
  const score = inverse === true ? _score : 10 - _score;
  let grade = "e";
  if (score <= 2) {
    grade = "a";
  } else if (score <= 4) {
    grade = "b";
  } else if (score <= 6) {
    grade = "c";
  } else if (score <= 8) {
    grade = "d";
  }

  return grade;
};

/*
 * Method to find field object from steps list
 */
Utils.prototype.findFieldById = function(steps, field_id) {
  let field;
  for (let i = 0; i < steps.length; i++) {
    field = _.findWhere(steps[i].fields, { id: field_id });
    if (field) {
      break;
    }
  }
  return field;
};

export default new Utils();
