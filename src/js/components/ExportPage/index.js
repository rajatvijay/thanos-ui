import React, { Component } from "react";
import { Button, Card, Layout, List, Row, Col } from "antd";
import _ from "lodash";
import { connect } from "react-redux";
import { authHeader } from "../../_helpers";

const { Sider, Content } = Layout;

class ExportList extends Component {
  constructor(props) {
    super();

    console.log(this.props);
    //this.state = { sidebar: false, userId: null };
  }

  render() {
    return (
      <Layout className="users-container inner-container">
        <Layout>
          <Content style={{ margin: "24px 16px 0", overflow: "initial" }}>
            <Row type="flex" justify="center">
              <Col span={18}>
                <h4 className="text-metal mr-bottom">Export workflow data</h4>

                <Card>
                  <List
                    className="demo-loadmore-list"
                    loading={this.props.workflowKind.loading}
                    itemLayout="horizontal"
                    //loadMore={loadMore}
                    dataSource={this.props.workflowKind.workflowKind}
                    renderItem={item => (
                      <List.Item
                        actions={[
                          <Button
                            icon="downlaod"
                            type="primary"
                            target="_blank"
                            href={
                              "http://slackcart.com/api/v1/workflow/defs/" +
                              item.id +
                              "/data-export/"
                            }
                          >
                            Export
                          </Button>
                        ]}
                      >
                        <List.Item.Meta
                          //avatar={<Avatar src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png" />}
                          title={
                            <h4 className="text-grey-dark">{item.name}</h4>
                          }
                          //description="Ant Design, a design language for background applications, is refined by Ant UED Team"
                        />
                      </List.Item>
                    )}
                  />
                </Card>
              </Col>
            </Row>
          </Content>
        </Layout>
      </Layout>
    );
  }
}

function mapPropsToState(state) {
  const { workflowKind } = state;
  return {
    workflowKind
  };
}

export default connect(mapPropsToState)(ExportList);
