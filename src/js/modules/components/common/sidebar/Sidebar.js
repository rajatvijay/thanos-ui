import React, { Component } from "react";

import {
  Layout,
 
  Icon,
  
  Typography,
  Collapse
} from "antd";

import TaskQueue from "./TaskQueue";
import Alerts from "./Alerts";

import {
  workflowFiltersActions,
  
} from "../../../../actions";
import { connect } from "react-redux";
import Collapsible from "react-collapsible";
const {  Sider } = Layout;



class Sidebar extends Component {
  state = {
    activeFilter: [],
    parent: null,
    collapse: true
  };

 
  setFilter = () => {
    let payload = {
      filterType: "alert_category",
      filterValue: this.state.activeFilter
    };
    console.log("apicalls");
    this.props.dispatch(workflowFiltersActions.setFilters(payload));
  };

  onSelectAlert = value => {
    
    if (this.state.activeFilter[0] === value.tag) {
      this.setState({ activeFilter: [] }, function() {
        this.setFilter();
      });
    } else {
      this.setState({ activeFilter: [value.tag] }, function() {
        this.setFilter();
      });
      
    }
  };

  onSelectTask = value => {
    console.log(value);
    let payload = {
      filterType: "stepgroupdef",
      filterValue: value ? [value.id] : []
    };
    this.props.dispatch(workflowFiltersActions.setFilters(payload));
  };
  

  render() {
    
    const { stepgroupdef_counts, loading } = this.props.workflowGroupCount;
    const { alert_details, isError } = this.props.workflowAlertGroupCount;
    const { collapse } = this.state;

    console.log(this.state);
    return (
      <Sider
        width={300}
        style={{
          overflow: "auto",
          height: "100vh",
          left: 0,
          backgroundColor: "#104774"
        }}
      >
        <div
          style={{
            width: 300,
            position: "fixed",
            paddingBottom: 100,
            height: "100%",
            overflow: "scroll",
            fontFamily: "Cabin",
            minHeight: "110vh"
          }}
        >
          <div className="logo" />
          
          <div
            onClick={() => this.setState({ collapse: !collapse })}
            style={{
              color: "white",
              padding: "25px 20px",
              cursor: "pointer",
              backgroundColor: "#0A3150",
              justifyContent: "space-between",
              display: "flex",
              fontSize: 18
            }}
          >
            TPI
            <Icon type="caret-right" rotate={collapse ? 90 : 0} />
          </div>
          <Collapsible open={collapse}>
            <div
              style={{
                backgroundColor: "#104774",
                padding: "5px 0px",
                minHeight: "100vh"
              }}
            >
              <div>
                <TaskQueue
                  workflowGroupCount={this.props.workflowGroupCount}
                  onSelectTask={this.onSelectTask}
                />
              </div>

              <div style={{ display: isError ? "none" : "block" }}>
                <Alerts
                  workflowAlertGroupCount={this.props.workflowAlertGroupCount}
                  onSelectAlert={this.onSelectAlert}
                />
              </div>
            </div>
          </Collapsible>
         
        </div>
      </Sider>
    );
  }
}

function mapStateToProps(state) {
  const {
    workflowKind,
    workflowFilterType,
    workflowFilters,
    config,
    languageSelector,
    showFilterMenu
  } = state;
  return {
    workflowKind,
    workflowFilterType,
    workflowFilters,
    config,
    languageSelector,
    showFilterMenu
  };
}

export default connect(mapStateToProps)(Sidebar);
