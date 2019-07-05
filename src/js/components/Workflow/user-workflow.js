import React from "react";
import {
  Modal,
  Form,
  Icon,
  Input,
  Button,
  Checkbox,
  Alert,
  notification
} from "antd";
import { FormattedMessage } from "react-intl";
import PropTypes from "prop-types";
import { workflowService } from "../../services/workflow";
import { workflowActions, createWorkflow } from "../../actions";

const openNotificationWithIcon = data => {
  notification[data.type]({
    message: data.message,
    description: data.body,
    placement: "bottomLeft"
  });
};

const UserWorkflowModal = props => {
  const alertMessageID = props.workflowID
    ? "userWorkflowInstances.userFoundMessage"
    : "userWorkflowInstances.userNotFoundMessage";
  const alertType = props.workflowID ? "success" : "info";
  return (
    <Modal
      title={<FormattedMessage id="userWorkflowInstances.searchUser" />}
      visible={props.visible}
      onCancel={props.onModalCancel}
      footer={[
        <Button
          key="continue"
          onClick={props.onContinue}
          disabled={!props.searchedUser}
          loading={props.linkingUser}
        >
          <FormattedMessage id="commonTextInstances.submitButtonText" />
        </Button>,
        <Button key="cancel" onClick={props.onModalCancel}>
          <FormattedMessage id="commonTextInstances.cancel" />
        </Button>
      ]}
      closable={true}
    >
      <Form onSubmit={props.onSearchPress}>
        <Form.Item>
          <Input
            type={"email"}
            onChange={props.onEmailChange}
            required={true}
            value={props.email}
          />
        </Form.Item>
        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            className="login-form-button"
            loading={props.searchingUser}
          >
            <FormattedMessage id="userWorkflowInstances.searchUser" />
          </Button>
        </Form.Item>
      </Form>
      {props.showAlert && (
        <Alert
          message={<FormattedMessage id={alertMessageID} />}
          type={alertType}
          showIcon
        />
      )}
    </Modal>
  );
};

UserWorkflowModal.propTypes = {
  visible: PropTypes.bool.isRequired,
  onSearchPress: PropTypes.func.isRequired,
  onEmailBlur: PropTypes.func.isRequired,
  onEmailChange: PropTypes.func.isRequired,
  showAlert: PropTypes.bool,
  searchingUser: PropTypes.bool.isRequired,
  searchedUser: PropTypes.bool.isRequired,
  onModalCancel: PropTypes.func.isRequired,
  onContinue: PropTypes.func.isRequired,
  linkingUser: PropTypes.bool.isRequired
};

class UserWorkflow extends React.Component {
  SEARCH_STATE_UNINTIATED = "uninitiated";
  SEARCH_STATE_SEARCHING = "searching";
  SEARCH_STATE_SEARCHED = "searched";
  SEARCH_STATE_LINKING = "linking";

  constructor(props) {
    super(props);
    this.state = {
      email: "",
      workflowID: null,
      visible: this.props.visible,
      searchState: this.SEARCH_STATE_UNINTIATED
    };
  }

  searchUser = event => {
    this.setState({ searchState: this.SEARCH_STATE_SEARCHING });
    event.preventDefault();

    const _searchUser = async () => {
      return await workflowService.searchUserWorkflowByEmail({
        email: this.state.email
      });
    };

    _searchUser()
      .then(response => {
        const workflowID = response.workflow;
        this.setState({
          searchState: this.SEARCH_STATE_SEARCHED,
          workflowID: workflowID
        });
      })
      .catch(error => {
        this.setState({
          searchState: this.SEARCH_STATE_SEARCHED
        });
      });
  };

  onEmailFieldBlur = event => {
    this.setState({ email: event.target.value });
  };

  resetForm = () => {
    this.props.dispatch(workflowActions.hideUserWorkflowModal());
    this.setState({
      email: "",
      searchState: this.SEARCH_STATE_UNINTIATED
    });
  };

  get searching() {
    return this.state.searchState === this.SEARCH_STATE_SEARCHING;
  }

  get searched() {
    return this.state.searchState === this.SEARCH_STATE_SEARCHED;
  }

  get linkingWorkflow() {
    return this.state.searchState === this.SEARCH_STATE_LINKING;
  }

  associateOrCreateUserWorkflow = () => {
    this.setState({ searchState: this.SEARCH_STATE_LINKING });
    if (this.state.workflowID) {
      this.associateWorkflowWithParent();
    } else {
      this.createUserWorkflow();
    }
  };

  createUserWorkflow = () => {
    const kind = this.props.kinds.workflowKind.find(
      kind => kind.tag == "users"
    );
    const payload = {
      status: kind && kind.default_status,
      kind: "users",
      name: "Draft",
      parent: this.props.parentWorkflowID
    };

    this.props.dispatch(workflowActions.hideUserWorkflowModal());
    this.props.dispatch(createWorkflow(payload));
  };

  associateWorkflowWithParent = () => {
    this.setState({
      searchState: this.SEARCH_STATE_LINKING
    });

    const _updateWorkflow = async payload => {
      await workflowService.updateWorkflow({
        id: this.state.workflowID,
        payload: payload
      });
    };

    const payload = {
      kind: "users",
      parents: [this.props.parentWorkflowID]
    };

    _updateWorkflow(payload)
      .then(() => {
        this.setState({ searchState: this.SEARCH_STATE_UNINTIATED });
        openNotificationWithIcon({
          type: "success",
          message: "Workflow linked successfully"
        });
        this.resetForm();
      })
      .catch(err => {
        this.setState({ searchState: this.SEARCH_STATE_UNINTIATED });
        openNotificationWithIcon({
          type: "error",
          message: "An error occurred while linking workflow"
        });
        console.error(err);
      });
  };

  render() {
    return (
      <div>
        <UserWorkflowModal
          visible={this.props.visible}
          onEmailBlur={this.onEmailFieldBlur}
          onSearchPress={this.searchUser}
          showAlert={this.searched}
          searchingUser={this.searching}
          searchedUser={this.searched}
          linkingUser={this.linkingWorkflow}
          workflowID={this.state.workflowID}
          onModalCancel={this.resetForm}
          onContinue={this.associateOrCreateUserWorkflow}
          onEmailChange={this.onEmailFieldBlur}
          email={this.state.email}
        />
      </div>
    );
  }
}

UserWorkflow.propTypes = {
  visible: PropTypes.bool.isRequired,
  parentWorkflowID: PropTypes.number
};

export default UserWorkflow;
