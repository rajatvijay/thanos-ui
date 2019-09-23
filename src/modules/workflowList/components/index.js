import React, { Component } from "react";
import { FormattedMessage, injectIntl } from "react-intl";
import Sidebar from "../sidebar/components/Sidebar";
import { Chowkidaar } from "../../common/permissions/Chowkidaar";
import Permissions from "../../common/permissions/permissionsList";
import { css } from "emotion";
import WorkflowToolbar from "../filters/components/WorkflowToolbar";
import WorkflowList from "./WorkflowList";
import { connect } from "react-redux";
import {
  applyWorkflowFilterThunk,
  getStatusesThunk,
  getRegionsThunk,
  getBusinessUnitsThunk,
  getAllKindsThunk
} from "../thunks";

class Workflow extends Component {
  componentDidMount = () => {
    // TODO: Apply the filters from URL
    //     const {location} = this.props;
    //     const urlParams = new URLSearchParams(location.search);
    // const params = Object.fromEntries(urlParams);
    this.props.getStatusesThunk();
    this.props.getRegionsThunk();
    this.props.getBusinessUnitsThunk();
    this.props.getAllKindsThunk();
  };

  get notAllowedMessage() {
    return (
      <div style={{ paddingTop: "150px" }}>
        <h4 className="text-center t-24 text-bold">
          <FormattedMessage id={"workflowsInstances.unauthorisedText"} />
        </h4>
      </div>
    );
  }

  render = () => {
    return (
      <Chowkidaar
        check={Permissions.CAN_VIEW_DASHBOARD}
        deniedElement={this.notAllowedMessage}
      >
        <div
          className={css`
            min-height: 100vh;
            /* Height of the header */
            padding-top: 60px;
            display: flex;
          `}
        >
          <Sidebar />
          <div
            className={css`
              flex: 1;
              padding: 20px 80px;
              background-color: #fafafa;
            `}
          >
            <WorkflowToolbar />
            <WorkflowList />
          </div>
        </div>
      </Chowkidaar>
    );
  };
}

export default connect(
  null,
  {
    applyWorkflowFilterThunk,
    getStatusesThunk,
    getRegionsThunk,
    getBusinessUnitsThunk,
    getAllKindsThunk
  }
)(injectIntl(Workflow));
