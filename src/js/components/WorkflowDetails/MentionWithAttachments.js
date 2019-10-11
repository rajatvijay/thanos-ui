import React, { Component, Fragment } from "react";
import { Modal, Input } from "antd";
import { Mention, MentionsInput } from "react-mentions";

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
    const { placeholder, onChange, message, mentions } = this.props;
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
            <div key={`${index}`}>
              <img width="200" src={file.url} alt="" />
              <p>{file.file.name}</p>
            </div>
          ))}
          <Input
            value={inputComment}
            onChange={this.handleInputCommentchange}
          />
        </Modal>
        <MentionsInput
          value={message}
          onChange={onChange}
          allowSpaceInQuery
          allowSuggestionsAboveCursor
          placeholder={placeholder}
          className="comments-textarea"
        >
          <Mention
            appendSpaceOnAdd
            trigger="@"
            displayTransform={(id, display) => "@" + display}
            data={mentions}
            markup={"~[__display__](__id__)"}
            style={{
              backgroundColor: "#eaf5fc"
            }}
          />
        </MentionsInput>
      </Fragment>
    );
  }
}

export default MentionWithAttachments;
