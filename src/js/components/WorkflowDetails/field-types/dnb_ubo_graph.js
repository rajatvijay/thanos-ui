import React, { Component } from "react";
import _ from "lodash";
import { commonFunctions } from "./commons";
import { dunsFieldActions } from "../../../actions";
import { Icon } from "antd";
import $ from "jquery";

window.$ = window.jquery = $;

const { getIntegrationSearchButton } = commonFunctions;

const graphStyle = [
  "https://d1mg2a4jjfsr4e.cloudfront.net/prod/css/ubo-graph.min.css",
  "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css"
];

//Field Type DUNS SEARCH
const getFields = props => {
  return getIntegrationSearchButton(props);
};

//duns field
class DnbUBOGraph extends Component {
  constructor() {
    super();
    this.state = {
      field: null,
      country: null
    };
  }

  loadResources = () => {
    const that = this;

    _.map(graphStyle, function(style, index) {
      const id = "style-" + index;
      that.loadstyle(style, id);
    });
  };

  //TODO: Modularise this function.
  loadstyle = (url, id) => {
    const elementExists = document.getElementById(id);
    if (!elementExists) {
      const link = document.createElement("LINK");
      link.href = url;
      link.id = id;
      link.rel = "stylesheet";
      document.body.appendChild(link);
    }
  };

  componentDidMount = () => {
    this.loadResources();
    if (this.props.field.integration_json) {
      const data = JSON.stringify(this.props.field.integration_json);
      const viz_instance_1 = window.renderGraph(
        "GraphContainer",
        "ubo-container",
        data,
        "English"
      );
    }
  };

  componentDidUpdate = (prevProps, prevState) => {
    const that = this;

    if (
      _.size(that.props.field.integration_json) ||
      prevProps.field.integration_json !== that.props.field.integration_json
    ) {
      const data = JSON.stringify(that.props.field.integration_json);
      const viz_instance_1 = window.renderGraph(
        "GraphContainer",
        "ubo-container",
        data,
        "English"
      );
    }
  };

  onSearch = () => {
    const payload = {
      workflow: this.props.workflowId,
      fieldId: this.props.field.id
    };

    this.props.dispatch(dunsFieldActions.dunsSaveField(payload));
  };

  getComment = (e, data) => {
    this.props.getIntegrationComments(data.MemberID, this.props.field.id);
  };

  renderGraph = field => {
    if (
      _.size(field.integration_json) &&
      field.integration_json.OrderProductResponse.OrderProductResponseDetail
    ) {
      return <div id="GraphContainer" />;
    } else {
      return (
        <div className="pd-ard t-16 mr-bottom-lg">
          No matching results
          <br />
          <br />
        </div>
      );
    }
  };

  render = () => {
    const { field } = this.props;

    const props = {
      field: field,
      onSearch: this.onSearch,
      currentStepFields: this.props.currentStepFields,
      is_locked: this.props.is_locked,
      completed: this.props.completed,
      permission: this.props.permission
    };

    let final_html = null;
    if (
      this.props.currentStepFields.integration_data_loading ||
      field.integration_json.status_message ===
        "Fetching data for this field..."
    ) {
      final_html = (
        <div>
          <div className="text-center mr-top-lg">
            <Icon type={"loading"} />
          </div>
        </div>
      );
    } else if (
      _.size(field.integration_json) &&
      !field.integration_json.selected_match
    ) {
      final_html = <div>{this.renderGraph(field)}</div>;
    }

    return (
      <div id="ubo-container">
        {getFields(props)}
        {final_html}
      </div>
    );
  };
}
export const UBOGraph = props => {
  return <DnbUBOGraph {...props} />;
};
