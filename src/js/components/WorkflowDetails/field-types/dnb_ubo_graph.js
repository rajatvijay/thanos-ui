import React, { Component } from "react";
import _ from "lodash";
import { commonFunctions } from "./commons";
import { dunsFieldActions } from "../../../actions";
import { Icon } from "antd";

const { getIntegrationSearchButton } = commonFunctions;

// const graphScript= [
//   "https://dhw1poj78tnn8.cloudfront.net/stg/js/ubo-graph.min.js",
//   "https://d1mg2a4jjfsr4e.cloudfront.net/prod/js/ogma.min.js",
//   "https://d1mg2a4jjfsr4e.cloudfront.net/prod/js/dagre.min.js",
//   "https://d1mg2a4jjfsr4e.cloudfront.net/prod/js/jquery.min.js",
// ]

const graphStyle = [
  "https://d1mg2a4jjfsr4e.cloudfront.net/prod/css/ubo-graph.min.css",
  //"https://d1mg2a4jjfsr4e.cloudfront.net/prod/fonts/font-awesome/css/font-awesome.min.css",
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
      //scriptLoadedCount: 0,
    };
  }

  loadResources = () => {
    var that = this;
    //var cb = this.hasScriptLoad;
    // _.map(graphScript,function(script,index){
    //   let id= "script-"+index;
    //   that.loadscript(script,id, cb);
    // })

    _.map(graphStyle, function(style, index) {
      let id = "style-" + index;
      that.loadstyle(style, id);
    });
  };

  //TODO: Modularise this function.
  // loadscript = (url, id, cb )=> {
  //   var elementExists = document.getElementById(id);
  //   if(!elementExists){
  //     const script = document.createElement("script");
  //     script.src = url;
  //     script.id = id;
  //     script.onload = function(){
  //       cb();
  //     }
  //     script.async = true ; //props.async;
  //     document.body.appendChild(script);
  //   }else {
  //     console.log('callback')
  //     cb();
  //   }
  // };

  //TODO: Modularise this function.
  loadstyle = (url, id) => {
    var elementExists = document.getElementById(id);
    if (!elementExists) {
      const link = document.createElement("LINK");
      link.href = url;
      link.id = id;
      link.rel = "stylesheet";
      document.body.appendChild(link);
    }
  };

  // hasScriptLoad = ()=>{
  //   let count = this.state.scriptLoadedCount + 1;
  //   this.setState({scriptLoadedCount:count})

  // };

  componentDidMount = () => {
    this.loadResources();
    if (this.props.field.integration_json) {
      let data = JSON.stringify(this.props.field.integration_json);
      let viz_instance_1 = window.renderGraph(
        "GraphContainer",
        "ubo-container",
        data,
        "English"
      );
    }
  };

  componentDidUpdate = (prevProps, prevState) => {
    let that = this;

    if (
      _.size(that.props.field.integration_json) ||
      prevProps.field.integration_json !== that.props.field.integration_json
    ) {
      let data = JSON.stringify(that.props.field.integration_json);
      let viz_instance_1 = window.renderGraph(
        "GraphContainer",
        "ubo-container",
        data,
        "English"
      );
    }
  };

  onSearch = () => {
    let payload = {
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
          No matching results<br />
          <br />
        </div>
      );
    }
  };

  render = () => {
    let { field } = this.props;

    const props = {
      field: field,
      onSearch: this.onSearch
    };

    let final_html = null;
    if (this.props.currentStepFields.integration_data_loading) {
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
