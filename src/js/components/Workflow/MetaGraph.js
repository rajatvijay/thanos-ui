import React, { Component } from "react";
import { Icon } from "antd";
import { authHeader, baseUrl } from "../../_helpers";
import _ from "lodash";

///////////////////
///META GRAPH////
///////////////////

class MetaGraph extends Component {
  constructor() {
    super();
    this.state = {
      loading: false,
      data: null,
      error: null
    };
  }

  componentDidMount = () => {
    this.getFilterData();
  };

  getFilterData = () => {
    let that = this;

    this.setState({ loading: true });
    const requestOptions = {
      method: "GET",
      headers: authHeader.get(),
      credentials: "include"
    };

    fetch(baseUrl + "dashboard/embed-url/", requestOptions)
      .then(function(response) {
        if (!response.ok) {
          this.setState({
            error: response.statusText,
            loading: false
          });
          throw Error(response.statusText);
        }
        return response;
      })
      .then(response => response.json())
      .then(data => {
        if (_.isEmpty(data)) {
          this.setState({
            error: data,
            loading: false
          });
        } else {
          this.setState({ data: data, loading: false });
        }
      })
      .catch(function(error) {
        console.log(error);
        that.setState({
          error: error,
          loading: false
        });
      });
  };

  renderGraph = () => {
    if (this.state.loading) {
      return (
        <div className="text-center">
          <Icon type="loading" loading />
        </div>
      );
    } else if (this.state.error || !this.state.data) {
      return <div className="text-red text-center">Unable to load graph</div>;
    } else {
      return (
        <iframe
          src={this.state.data.data.iframe_url}
          frameborder="0"
          width="560"
          height="85%"
          allowtransparency
        />
      );
    }
  };

  render = () => {
    return <div style={{ height: "100vh" }}>{this.renderGraph()}</div>;
  };
}

export default MetaGraph;
