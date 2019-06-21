import React, { Component } from "react";
import { Form, Input, Button, Radio, Modal, notification } from "antd";
import { css } from "emotion";
import { authHeader, baseUrl } from "../../../_helpers";

const openNotificationWithIcon = data => {
  notification[data.type]({
    message: data.message,
    description: data.body,
    placement: "bottomLeft"
  });
};

function getField(fieldDetail, OnFieldChange, fieldList, getFieldDecorator) {
  switch (fieldDetail.field_type) {
    case "text":
      return (
        <Form.Item>
          {getFieldDecorator(
            fieldDetail.body,
            {
              rules: [
                { required: fieldDetail.is_required, message: "Required" }
              ]
            },
            {
              initialValue: fieldList[fieldDetail.tag]
                ? fieldList[fieldDetail.tag]
                : null
            }
          )(
            <Input
              disabled={fieldDetail.disabled}
              onChange={event =>
                OnFieldChange(event, fieldDetail.tag, fieldDetail.field_type)
              }
            />
          )}
        </Form.Item>
      );
      break;

    case "bool":
      return (
        <Form.Item>
          {getFieldDecorator(
            fieldDetail.body,
            {
              rules: [
                { required: fieldDetail.is_required, message: "Required" }
              ]
            },
            {
              initialValue: fieldList[fieldDetail.tag]
                ? fieldList[fieldDetail.tag]
                : null
            }
          )(
            <Radio.Group
              onChange={event =>
                OnFieldChange(event, fieldDetail.tag, fieldDetail.field_type)
              }
            >
              <Radio.Button value="true">Yes</Radio.Button>
              <Radio.Button value="false">NO</Radio.Button>
            </Radio.Group>
          )}
        </Form.Item>
      );
      break;

    default:
      break;
  }
}

class BulkActionFields extends Component {
  state = {
    fieldList: {},
    isLoading: false
  };

  componentDidUpdate(prevProps) {
    if (prevProps.actionDetail !== this.props.actionDetail) {
      let fields = {};
      this.props.actionDetail &&
        this.props.actionDetail.edit_fields.forEach(item => {
          fields[item.tag] = item.default_value;
        });
      this.setState({
        fieldList: fields
      });
    }
  }

  onFieldChange = (event, fieldName, type) => {
    this.setState({
      fieldList: {
        ...this.state.fieldList,
        [fieldName]:
          type === "bool"
            ? event.target.value
              ? true
              : false
            : event.target.value
      }
    });
  };

  onSubmitClick = e => {
    e.preventDefault();
    e.stopPropagation();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        this.setState({
          isLoading: true
        });
        const requestOptions = {
          method: "POST",
          headers: authHeader.post(),
          credentials: "include",
          body: JSON.stringify({
            workflow_ids: this.props.bulkActionWorkflowChecked.map(
              item => item.id
            ),
            action_tag: this.props.actionDetail.action_tag,
            action_type: this.props.actionDetail.action_type,
            action_params: {
              fields: this.state.fieldList,
              step_action: "submit"
            }
          })
        };
        return fetch(baseUrl + "workflow/bulk-action/", requestOptions).then(
          response => {
            this.setState({
              isLoading: false
            });
            if (!response.ok) {
              return openNotificationWithIcon({
                type: "error",
                message: "Error in performing the action!"
              });
            } else {
              this.props.onCloseBulkActionModal();
              return openNotificationWithIcon({
                type: "success",
                message:
                  "Your request has been submitted, action will be performed shortly."
              });
            }
          }
        );
      }
    });
  };

  render() {
    const { getFieldDecorator } = this.props.form;
    const { fieldList } = this.state;
    return (
      <Modal
        title={
          this.props.actionDetail ? this.props.actionDetail.name : "Bulk Action"
        }
        visible={this.props.open}
        onCancel={this.props.onCloseBulkActionModal}
        destroyOnClose
        onOk={this.onSubmitClick}
        footer={[
          <Button
            key="submit"
            type="primary"
            loading={this.state.isLoading}
            onClick={this.onSubmitClick}
          >
            Submit
          </Button>
        ]}
      >
        {this.props.actionDetail ? (
          <Form layout="inline" onSubmit={this.onSubmitClick}>
            <div style={{ display: "flex", flexDirection: "row" }}>
              {this.props.actionDetail.edit_fields.map(field => (
                <div>
                  <p
                    style={{
                      margin: 0,
                      padding: 0,
                      opacity: 0.5,
                      color: "#000000",
                      fontSize: "16px",
                      letterSpacing: "-0.03px",
                      lineHeight: "6px,"
                    }}
                  >
                    {field.body}
                  </p>
                  {getField(
                    field,
                    this.onFieldChange,
                    fieldList,
                    getFieldDecorator
                  )}
                </div>
              ))}
            </div>
          </Form>
        ) : (
          "Nothing to display"
        )}
      </Modal>
    );
  }
}

const WrappedBulkActionFields = Form.create()(BulkActionFields);

export default WrappedBulkActionFields;
