import React, { Component } from "react";
//import { authHeader, baseUrl } from "../../../_helpers";
import { Form, Input, Button, Row, Col } from "antd";
import _ from "lodash";
import { commonFunctions } from "./commons";

const FormItem = Form.Item;

const {
  getLabel,
  // onFieldChange,
  // onFieldChangeArray,
  // arrayToString,
  // stringToArray,
  field_error,
  getRequired,
  feedValue
  // addComment,
  // addCommentBtn,
  // getLink
} = commonFunctions;

//Field Type DUNS SEARCH
class DunsSearch extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  // render = () => {
  //   const { field } = this.props;

  //   return (
  //     <div>
  //       <div>{getRequired(this.props) ? <span className="text-red">*</span> : null}<label className="from-label">{getLabel(this.props)}</label></div>
  //       {<div>
  //                   <FormItem
  //                     label={getLabel(this.props)}
  //                     labelCol={24}
  //                     //className="from-label"
  //                     style={{ display: "block" }}
  //                     key={field.id+"-1"}
  //                     wrapperCol={12}
  //                     required={getRequired(this.props)}
  //                     {...field_error(this.props)}
  //                     validateStatus={field.updated_at ? "success" : null}>
  //                      <Input
  //                         disabled={this.props.completed || this.props.is_locked || this.props.field.definition.disabled}
  //                         type="text"
  //                         placeholder={this.props.field.placeholder}
  //                         defaultValue={
  //                           this.props.field.answers[0]
  //                             ? this.props.field.answers[0].answer
  //                             : this.props.field.definition.defaultValue
  //                           }
  //                         {...feedValue(this.props)}
  //                         //onChange={e => this.props.onFieldChange(e, this.props)}
  //                       />
  //                   </FormItem>
  //                   <FormItem
  //                     //label={getLabel(this.props)}
  //                     className="from-label"
  //                     style={{ display: "block" }}
  //                     key={field.id+"-2"}
  //                     wrapperCol={8}
  //                     required={getRequired(this.props)}
  //                     {...field_error(this.props)}
  //                     validateStatus={field.updated_at ? "success" : null}>
  //                      <Input
  //                         disabled={this.props.completed || this.props.is_locked || this.props.field.definition.disabled}
  //                         type="text"
  //                         placeholder={this.props.field.placeholder}
  //                         defaultValue={
  //                           this.props.field.answers[0]
  //                             ? this.props.field.answers[0].answer
  //                             : this.props.field.definition.defaultValue
  //                           }
  //                         {...feedValue(this.props)}
  //                         //onChange={e => props.onFieldChange(e, props)}
  //                       />
  //                   </FormItem>
  //                   <FormItem
  //                     wrapperCol={4}
  //                     style={{ display: "block" }}
  //                     key={field.id+"-3"}
  //                     required={getRequired(this.props)}
  //                     {...field_error(this.props)}
  //                     validateStatus={field.updated_at ? "success" : null}>
  //                      <Button type="primary" >Submit</Button>
  //                   </FormItem>
  //                 </div>
  //               {addCommentBtn(this, this.props)}
  //             }

  //       <div className="table">data here-></div>
  //     </div>
  //   );
  // };

  render = () => {
    return <div>{this.props.label}</div>;
  };
}

export const Duns = props => {
  return <Duns {...props} />;
};
