import React, { Component } from "react";
import { Form, Input, Icon, Button, Layout } from "antd";
import { FormattedMessage } from "react-intl";
const FormItem = Form.Item;
const { Sider } = Layout;

let uuid = 0;

class DynamicFieldSet extends React.Component {
  remove = k => {
    const { form } = this.props;
    // can use data-binding to get
    const keys = form.getFieldValue("keys");
    // We need at least one passenger
    if (keys.length === 1) {
      return;
    }

    // can use data-binding to set
    form.setFieldsValue({
      keys: keys.filter(key => key !== k)
    });
  };

  add = () => {
    const { form } = this.props;
    // can use data-binding to get
    const keys = form.getFieldValue("keys");
    const nextKeys = keys.concat(uuid);
    uuid++;
    // can use data-binding to set
    // important! notify form to detect changes
    form.setFieldsValue({
      keys: nextKeys
    });
  };

  handleSubmit = e => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
      }
    });
  };

  render() {
    const { getFieldDecorator, getFieldValue } = this.props.form;

    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 4 }
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 20 }
      }
    };

    const formItemLayoutWithOutLabel = {
      wrapperCol: {
        xs: { span: 24, offset: 0 },
        sm: { span: 20, offset: 4 }
      }
    };

    getFieldDecorator("keys", { initialValue: [] });
    const keys = getFieldValue("keys");
    const formItems = keys.map((k, index) => {
      return (
        <FormItem
          {...(index === 0 ? formItemLayout : formItemLayoutWithOutLabel)}
          label={index === 0 ? "Field" : ""}
          required={false}
          key={`${k}`}
        >
          {getFieldDecorator(`names[${k}]`, {
            validateTrigger: ["onChange", "onBlur"],
            rules: [
              {
                required: true,
                whitespace: true,
                message: "Please input field type or delete this field."
              }
            ]
          })(
            <Input
              placeholder="select field"
              style={{ width: "60%", marginRight: 8 }}
            />
          )}

          {keys.length > 1 ? (
            <Icon
              className="dynamic-delete-button"
              type="minus-circle-o"
              disabled={keys.length === 1}
              onClick={() => this.remove(k)}
            />
          ) : null}
        </FormItem>
      );
    });
    return (
      <Form onSubmit={this.handleSubmit}>
        {formItems}
        <FormItem {...formItemLayoutWithOutLabel}>
          <Button type="dashed" onClick={this.add} style={{ width: "60%" }}>
            <Icon type="plus" /> Add field
          </Button>
        </FormItem>
        <FormItem {...formItemLayoutWithOutLabel}>
          <Button type="primary" htmlType="submit">
            <FormattedMessage id="commonTextInstances.submitButtonText" />
          </Button>
        </FormItem>
      </Form>
    );
  }
}

const WrappedDynamicFieldSet = Form.create()(DynamicFieldSet);

class Filter extends Component {
  toggle = () => {
    this.props.toggleSidebar();
  };

  render() {
    return (
      <Sider
        className="profile-sidebar filter-sidebar sidebar-right"
        style={{
          background: "#fff",
          overflow: "auto",
          height: "100vh",
          position: "fixed",
          right: 0
        }}
        width="350"
        collapsed={!this.props.sidebar}
        collapsedWidth={0}
        collapsible
        reverseArrow={true}
        defaultCollapsed={true}
      >
        <div className="profile-details">
          <div className="sidebar-head">
            <span className="sidebar-title">Advanced Filter</span>
            <span className="close-trigger">
              <Icon
                className="trigger"
                type={this.props.sidebar ? "menu-unfold" : "menu-fold"}
                onClick={this.toggle}
              />
            </span>
          </div>
          <WrappedDynamicFieldSet />
        </div>
      </Sider>
    );
  }
}

export const Filter2 = Filter;
