import React, { Component } from "react";
import { FormattedMessage, injectIntl } from "react-intl";
import Sidebar from "../../sidebar";
import { Chowkidaar } from "../../../common/permissions/Chowkidaar";
import Permissions from "../../../common/permissions/permissionsList";
import { css } from "emotion";
import WorkflowToolbar from "../../workflowToolbar";
import WorkflowList from "./WorkflowList";
import { connect } from "react-redux";
import {
  getStatusesThunk,
  getRegionsThunk,
  getBusinessUnitsThunk,
  getAllKindsThunk
} from "../../thunks";
import withFilters from "../../filters";
import { FILTERS_ENUM } from "../../constants";

class Dashboard extends Component {
  componentDidMount = async () => {
    // TODO: Apply the filters from URL
    //     const {location} = this.props;
    //     const urlParams = new URLSearchParams(location.search);
    // const params = Object.fromEntries(urlParams);
    this.props.getStatusesThunk();
    this.props.getRegionsThunk();
    this.props.getBusinessUnitsThunk();
    const { results: kinds } = await this.props.getAllKindsThunk();
    this.props.addFilters([
      {
        name: FILTERS_ENUM.KIND_FILTER.name,
        key: FILTERS_ENUM.KIND_FILTER.key,
        value: kinds[0].id,
        meta: kinds[0]
      }
    ]);
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
    getStatusesThunk,
    getRegionsThunk,
    getBusinessUnitsThunk,
    getAllKindsThunk
  }
)(injectIntl(withFilters(Dashboard)));
