import React, { Component } from "react";
import { Layout, Row } from "antd";
import { connect } from "react-redux";
import { injectIntl } from "react-intl";

const { Content } = Layout;

class ReportPage extends Component {
  render() {
    return (
      <Layout
        className="workflow-container inner-container"
        style={{ minHeight: "100vh" }}
      >
        <Layout>
          <Content style={{ margin: "4vh 4vw" }}>
            <Row className="clear">
              <div style={{ minHeight: "400px" }}>
                <iframe
                  title={"Reporting dashboard"}
                  style={{ width: "100%", minHeight: "80vh" }}
                  src={this.props.config.report_embed_url}
                />
              </div>
            </Row>
          </Content>
        </Layout>
      </Layout>
    );
  }
}

function mapStateToProps(state) {
  const { config } = state;

  return {
    config
  };
}

export default connect(mapStateToProps)(injectIntl(ReportPage));
