import React, { Component } from "react";
import { Modal, Button, Spin, Icon } from "antd";
import { connect } from "react-redux";
import { getPdfData, postPdfData } from "../pdfPopupActions";
import WorkflowList from "./WorkflowList";

//this component contains only two apis

class PdfPopup extends Component {
  state = {
    parent_steps_to_print: [],
    child_steps_to_print: {},
    static_sections: []
  };

  componentDidMount() {
    this.props.getPdfData();
    //calling an api which is responsible for getting all the data which needs to dispay inside modal
  }

  isStepExist = (arr, value) => {
    return arr.some(val => val == value);
  };

  deleteStep = (arr, value) => {
    return arr.filter(val => val != value);
  };

  onChange = ({ target: { value } }, name, parentValue) => {
    const {
      parent_steps_to_print,
      child_steps_to_print,
      static_sections
    } = this.state;
    const { deleteStep, isStepExist } = this;

    if (name == "parent_steps_to_print") {
      if (isStepExist(parent_steps_to_print, value)) {
        this.setState({
          parent_steps_to_print: deleteStep(parent_steps_to_print, value)
        });
      } else {
        this.setState({
          parent_steps_to_print: [...parent_steps_to_print, value]
        });
      }
    } else if (name == "static_sections") {
      if (isStepExist(static_sections, value)) {
        this.setState({
          static_sections: deleteStep(static_sections, value)
        });
      } else {
        this.setState({
          static_sections: [...static_sections, value]
        });
      }
    } else {
      console.log("parent", parentValue, name);

      if (
        child_steps_to_print[parentValue] &&
        isStepExist(child_steps_to_print[parentValue], value)
      ) {
        this.setState(prevState => {
          const obj = { ...prevState.child_steps_to_print };

          obj[parentValue] = deleteStep(obj[parentValue], value);
          return { child_steps_to_print: obj };
        });
      } else {
        this.setState(prevState => {
          const obj = { ...prevState.child_steps_to_print };
          obj[parentValue] = [];
          obj[parentValue] = [...obj[parentValue], value];
          return { child_steps_to_print: obj };
        });
      }
    }
  };

  onSubmit = () => {
    //calling an api which will submit all the selected checkbox

    const {
      parent_steps_to_print,
      child_steps_to_print,
      static_sections
    } = this.state;
    const { config_id } = this.props.data.results[0];

    const obj = {
      parent_steps_to_print,
      child_steps_to_print,
      static_sections,
      config_id
    };

    this.props.postPdfData(obj);
  };

  render() {
    const { data, isLoading, visible, showModal, handleCancel } = this.props;
    console.log("state", this.state);

    return (
      <div>
        <Modal
          bodyStyle={{ maxHeight: 400 }}
          width={800}
          title="popup for pdf" //for modal heading or internally it creates a header with this title
          visible={visible} //responsible for displaying modal
          footer={null} //to remove footer because default consist two buttons in footer (ok and cancel)
          onCancel={handleCancel}
        >
          {!isLoading && (
            <div
              style={{
                position: "absolute",
                backgroundColor: "rgba(0,0,0,0.2)",
                width: 800,
                height: 400,
                top: 0,
                left: 0,
                zIndex: 2
              }}
            >
              <Spin
                indicator={
                  <Icon
                    type="loading"
                    style={{
                      fontSize: 24,
                      position: "absolute",
                      left: "50%",
                      top: "50%"
                    }}
                    spin
                  />
                }
              />
            </div>
          )}
          {data.results && (
            <WorkflowList onChange={this.onChange} data={data.results[0]} />
          )}

          <Button onClick={this.onSubmit} type="primary">
            Submit
          </Button>
        </Modal>
      </div>
    );
  }
}

function mapStateToProps({ pdfData: { data, isLoading } }) {
  return {
    data,
    isLoading
  };
}

export default connect(
  mapStateToProps,
  { getPdfData, postPdfData }
)(PdfPopup);
