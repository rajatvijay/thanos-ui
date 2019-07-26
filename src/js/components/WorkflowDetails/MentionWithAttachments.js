import React, { Component, Fragment } from "react";
import { Mention, Modal, Input } from "antd";

class MentionWithAttachments extends Component {
  isFocussed = false;

  state = {
    isAddAttachmentModalVisible: false,
    inputComment: null,
    files: []
  };

  hideModalAndResetState = () => {
    this.setState({
      isAddAttachmentModalVisible: false,
      files: [],
      inputComment: null
    });
  };

  showModal = () => {
    this.setState({ isAddAttachmentModalVisible: true });
  };

  addFile = file =>
    this.setState(state => ({
      files: [...state.files, { file, url: window.URL.createObjectURL(file) }]
    }));

  componentDidMount() {
    document.onpaste = e => {
      if (this.isFocussed) {
        if (
          e.clipboardData.files.length &&
          e.clipboardData.files[0].type.startsWith("image/")
        ) {
          this.addFile(e.clipboardData.files[0]);
          this.showModal();
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
    this.hideModalAndResetState();
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
          onCancel={this.hideModalAndResetState}
        >
          {files.map((file, index) => (
            <div key={`file_${index}`}>
              <img width="200" src={file.url} alt="" />
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
            this.isFocussed = true;
          }}
          onBlur={() => {
            this.isFocussed = false;
          }}
          style={{
            width: "100%",
            height: 110,
            marginTop: "5px",
            border: "none",
            padding: "3px",
            fontSize: "16px"
          }}
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
