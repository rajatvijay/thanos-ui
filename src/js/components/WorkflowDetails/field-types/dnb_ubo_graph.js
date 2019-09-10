import React, { Component } from "react";
import _ from "lodash";
import { commonFunctions } from "./commons";
import { dunsFieldActions } from "../../../actions";
import { Icon, Alert } from "antd";
import $ from "jquery";
import { FormattedMessage } from "react-intl";
import IntegrationLoadingWrapper from "../utils/IntegrationLoadingWrapper";

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
      window.renderGraph("GraphContainer", "ubo-container", data, "English");
    }
  };

  componentDidUpdate = (prevProps, prevState) => {
    const that = this;

    if (
      _.size(that.props.field.integration_json) ||
      prevProps.field.integration_json !== that.props.field.integration_json
    ) {
      const data = JSON.stringify(that.props.field.integration_json);
      window.renderGraph("GraphContainer", "ubo-container", data, "English");
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
          <FormattedMessage id="commonTextInstances.noMatchFound" />
          <br />
          <br />
        </div>
      );
    }
  };

  render = () => {
    const { field, currentStepFields } = this.props;

    const props = {
      field: field,
      onSearch: this.onSearch,
      currentStepFields: this.props.currentStepFields,
      is_locked: this.props.is_locked,
      completed: this.props.completed,
      permission: this.props.permission
    };

    const finalHTML = (
      <IntegrationLoadingWrapper
        currentStepFields={currentStepFields}
        field={field}
        step={field.step}
        check={"default"}
      >
        <div>{this.renderGraph(field)}</div>
      </IntegrationLoadingWrapper>
    );

    return (
      <div>
        {getFields(props)} {finalHTML}
      </div>
    );
  };
}
export const UBOGraph = props => {
  return <DnbUBOGraph {...props} />;
};
