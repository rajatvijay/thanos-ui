import React, { Component } from "react";
import { Form, Input, Button } from "antd";
import _ from "lodash";

const FormItem = Form.Item;

class StepBody extends Component {
  constructor(props) {
    super(props);
    //    console.log(this.props.stepBody.fields);
  }

  renderField() {
    return <div>ewfsdf</div>;
  }

  handleSubmit() {
    console.log("submit");
  }

  render() {
    return (
      <div className="pd-ard-lg">
        <Form layout="vertical" onSubmit={this.handleSubmit}>
          {_.map(this.props.stepBody.fields, function(f) {
            //            console.log(f);
            return (
              <FormItem label={f.body} key={f.id}>
                <Input defaultValue={f.answer} />
              </FormItem>
            );
          })}

          <FormItem>
            <Button type="primary" htmlType="submit">
              Submit
            </Button>
          </FormItem>
        </Form>
      </div>
    );
  }
}

export default StepBody;
