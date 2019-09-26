import React, { Component, createRef } from "react";
import _ from "lodash";
import { commonFunctions } from "./commons";
import { dunsFieldActions } from "../../../actions";
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
    this.graphContainerRef = createRef();
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
      this.loadGraph();
    }
  };

  componentDidUpdate(prevProps, prevState) {
    if (
      _.size(this.props.field.integration_json) ||
      prevProps.field.integration_json !== this.props.field.integration_json
    ) {
      this.loadGraph();
    }
  }

  loadGraph = () => {
    if (!this.graphContainerRef.current) return;
    const data = JSON.stringify(this.props.field.integration_json);

    let didEnforceStyle = false;
    const style = this.graphContainerRef.current.getBoundingClientRect();
    if (style.width < 900) {
      this.graphContainerRef.current.style.minWidth = "900px";
      didEnforceStyle = true;
    }
    window.renderGraph("GraphContainer", "ubo-container", data, "English");
    if (didEnforceStyle) {
      this.graphContainerRef.current.style.minWidth = "auto";
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
      _.has(
        field,
        "integration_json.OrderProductResponse.OrderProductResponseDetail"
      )
    ) {
      return <div id="GraphContainer" ref={this.graphContainerRef} />;
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
      <div id="ubo-container">
        {getFields(props)} {finalHTML}
      </div>
    );
  };
}
export const UBOGraph = props => {
  return <DnbUBOGraph {...props} />;
};
