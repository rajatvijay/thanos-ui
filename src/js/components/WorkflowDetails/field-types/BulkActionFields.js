import React, { Component } from "react";
import { Form, Input, Button, Radio, Modal } from "antd";
import { FormattedMessage } from "react-intl";
import { authHeader } from "../../../_helpers";
import { apiBaseURL } from "../../../../config";
import showNotification from "../../../../modules/common/notification";

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
              onChange={event => OnFieldChange(event, fieldDetail.tag)}
            />
          )}
        </Form.Item>
      );

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
              onChange={event => OnFieldChange(event, fieldDetail.tag)}
            >
              <Radio value="True">
                <FormattedMessage id="commonTextInstances.yes" />
              </Radio>
              <Radio value="False">
                <FormattedMessage id="commonTextInstances.no" />
              </Radio>
            </Radio.Group>
          )}
        </Form.Item>
      );

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
      const fields = {};
      this.props.actionDetail &&
        this.props.actionDetail.edit_fields.forEach(item => {
          fields[item.tag] = item.default_value;
        });
      this.setState({
        fieldList: fields
      });
    }
  }

  onFieldChange = (event, fieldName) => {
    this.setState({
      fieldList: {
        ...this.state.fieldList,
        [fieldName]: event.target.value
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
        return fetch(apiBaseURL + "workflow/bulk-action/", requestOptions)
          .then(response => {
            this.setState({
              isLoading: false
            });

            if (!response.ok) {
              showNotification({
                type: "error",
                message: "notificationInstances.asyncActionFail"
              });
            } else {
              this.props.onCloseBulkActionModal();
              showNotification({
                type: "success",
                message: "notificationInstances.asyncActionSuccess"
              });
            }
            return;
          })
          .catch(err => {
            showNotification({
              type: "error",
              message: "notificationInstances.networkError",
              description: "notificationInstances.networkErrorDescription"
            });
          });
      }
    });
  };

  render() {
    const { getFieldDecorator } = this.props.form;
    const { fieldList } = this.state;
    return (
      <Modal
        title={
          this.props.actionDetail ? (
            this.props.actionDetail.name
          ) : (
            <FormattedMessage id="fields.bulkAction" />
          )
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
            <FormattedMessage id="commonTextInstances.submitButtonText" />
          </Button>
        ]}
      >
        {this.props.actionDetail ? (
          <Form layout="inline" onSubmit={this.onSubmitClick}>
            <div style={{ display: "flex", flexDirection: "row" }}>
              {this.props.actionDetail.edit_fields.map((field, index) => (
                <div key={`${index}`}>
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
          <FormattedMessage id="commonTextInstances.nothingToDisplay" />
        )}
      </Modal>
    );
  }
}

const WrappedBulkActionFields = Form.create()(BulkActionFields);

export default WrappedBulkActionFields;
