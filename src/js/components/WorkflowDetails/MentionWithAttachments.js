import React, { Component, Fragment } from "react";
import { Mention, Modal, Input } from "antd";

class MentionWithAttachments extends Component {
  isFocussed = false;

  state = {
    isAddAttachmentModalVisible: false,
    inputComment: null,
    files: []
  };

  toggleAddAttachmentModal = () => {
    this.setState(state => {
      if (state.isAddAttachmentModalVisible) {
        // If the modal is already visible, close it and reset the state
        return {
          isAddAttachmentModalVisible: !state.isAddAttachmentModalVisible,
          files: [],
          inputComment: null
        };
      } else {
        return {
          isAddAttachmentModalVisible: !state.isAddAttachmentModalVisible
        };
      }
    });
  };

  addFile = file =>
    this.setState(state => ({
      files: [...state.files, { file, url: window.URL.createObjectURL(file) }]
    }));

  componentDidMount() {
    document.onpaste = e => {
      console.log("handler called", this);
      if (this.isFocussed) {
        if (
          e.clipboardData.files.length &&
          e.clipboardData.files[0].type.startsWith("image/")
        ) {
          this.addFile(e.clipboardData.files[0]);
          this.toggleAddAttachmentModal();
        }
      }
    };
  }

  handleInputCommentchange = e => {
    const { value } = e.target;
    this.setState({ inputComment: value });
  };

  uploadAndAddComment = () => {
    const { inputComment, files: fileWithURL } = this.state;
    const { comment } = this.props;
    const files = fileWithURL.map(({ file }) => file);
    this.props.addComment(comment, inputComment, files);
    this.toggleAddAttachmentModal();
  };

  render() {
    const { comment, placeholder, onChange, message } = this.props;
    const { isAddAttachmentModalVisible, files, inputComment } = this.state;
    return (
      <Fragment>
        <Modal
          title="Add Attachment"
          visible={isAddAttachmentModalVisible}
          onOk={this.uploadAndAddComment}
          onCancel={this.toggleAddAttachmentModal}
        >
          {files.map(file => (
            <div>
              <img width="200" src={file.url} />
              <p>{file.file.name}</p>
            </div>
          ))}
          <Input
            value={inputComment}
            onChange={this.handleInputCommentchange}
          />
        </Modal>
        <Mention
          onFocus={() => {
            console.log("focussed");
            this.isFocussed = true;
          }}
          onBlur={() => {
            console.log("blurred");
            this.isFocussed = false;
          }}
          style={{ width: "470px", height: 30 }}
          suggestions={comment.mentions}
          placeholder={placeholder}
          multiLines
          onChange={onChange}
          value={message}
          notFoundContent={"user not found"}
        />
      </Fragment>
    );
  }
}

export default MentionWithAttachments;
