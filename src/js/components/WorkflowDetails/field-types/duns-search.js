import React, { Component } from "react";
//import { authHeader, baseUrl } from "../../../_helpers";
import { Form, Input, Button, Row, Col, Table, Icon, Divider } from "antd";
import _ from "lodash";
import { commonFunctions } from "./commons";

const FormItem = Form.Item;
const { Column, ColumnGroup } = Table;

const {
  getLabel,
  // onFieldChange,
  // onFieldChangeArray,
  // arrayToString,
  // stringToArray,
  field_error,
  getRequired,
  feedValue,
  // addComment,
  addCommentBtn
  // getLink
} = commonFunctions;

//Field Type DUNS SEARCH

//duns field
class DunsSearch extends Component {
  render = () => {
    const { field } = this.props;

    return (
      <div>
        <div className="ant-form-item-label">
          <label
            className={getRequired(this.props) ? "ant-form-item-required" : ""}
            title={getLabel(this.props)}
          >
            {getLabel(this.props)}
          </label>
        </div>
        <Row gutter={16}>
          <Col span={12}>
            <FormItem
              //label={getLabel(this.props)}
              labelCol={24}
              //className="from-label"
              style={{ display: "block" }}
              key={field.id + "-1"}
              wrapperCol={12}
              required={getRequired(this.props)}
              {...field_error(this.props)}
              validateStatus={field.updated_at ? "success" : null}
            >
              <Input
                disabled={
                  this.props.completed ||
                  this.props.is_locked ||
                  this.props.field.definition.disabled
                }
                type="text"
                placeholder={this.props.field.placeholder}
                defaultValue={
                  this.props.field.answers[0]
                    ? this.props.field.answers[0].answer
                    : this.props.field.definition.defaultValue
                }
                {...feedValue(this.props)}
                //onChange={e => this.props.onFieldChange(e, this.props)}
              />
            </FormItem>
          </Col>
          <Col span={8}>
            <FormItem
              className="from-label"
              style={{ display: "block" }}
              key={field.id + "-2"}
              wrapperCol={8}
              required={getRequired(this.props)}
              {...field_error(this.props)}
              validateStatus={field.updated_at ? "success" : null}
            >
              <Input
                disabled={
                  this.props.completed ||
                  this.props.is_locked ||
                  this.props.field.definition.disabled
                }
                type="text"
                placeholder={this.props.field.placeholder}
                defaultValue={
                  this.props.field.answers[0]
                    ? this.props.field.answers[0].answer
                    : this.props.field.definition.defaultValue
                }
                {...feedValue(this.props)}
                //onChange={e => props.onFieldChange(e, props)}
              />
            </FormItem>
          </Col>
          <Col span={4}>
            <FormItem
              wrapperCol={4}
              style={{ display: "block" }}
              key={field.id + "-3"}
              required={getRequired(this.props)}
              {...field_error(this.props)}
              validateStatus={field.updated_at ? "success" : null}
            >
              <Button type="primary" className="btn-block">
                Check
              </Button>
            </FormItem>
          </Col>
        </Row>

        <div className="table">
          <GetTable />
        </div>
        <div>{addCommentBtn(this, this.props)}</div>
      </div>
    );
  };

  // render = () => {
  //   return <div>llkkll</div>;
  // };
}

const GetTable = () => {
  const data = [
    {
      key: "1",
      firstName: "John",
      lastName: "Brown",
      age: 32,
      address: "New York No. 1 Lake Park"
    },
    {
      key: "2",
      firstName: "Jim",
      lastName: "Green",
      age: 42,
      address: "London No. 1 Lake Park"
    },
    {
      key: "3",
      firstName: "Joe",
      lastName: "Black",
      age: 32,
      address: "Sidney No. 1 Lake Park"
    }
  ];

  return (
    <Table dataSource={data} pagination={false} bordered={true}>
      <Column title="First Name" dataIndex="firstName" key="firstName" />
      <Column title="Last Name" dataIndex="lastName" key="lastName" />
      <Column title="Age" dataIndex="age" key="age" />
      <Column title="Address" dataIndex="address" key="address" />
      <Column
        title="Action"
        key="action"
        // render={(text, record) => (
        //   <span>
        //     <a href="javascript:;">Action 一 {record.name}</a>
        //     <Divider type="vertical" />
        //     <a href="javascript:;">Delete</a>
        //     <Divider type="vertical" />
        //     <a href="javascript:;" className="ant-dropdown-link">
        //       More actions <Icon type="down" />
        //     </a>
        //   </span>
        // )}
      />
    </Table>
  );
};

export const Duns = props => {
  return <DunsSearch {...props} />;
};
