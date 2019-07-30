import React, { Component } from "react";
import { connect } from "react-redux";
import { Icon } from "antd";
import { workflowFiltersActions } from "../../actions";
import _ from "lodash";
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
  Tooltip as RTooltip
} from "recharts";

///////////////////
///STATUS GRAPH////
///////////////////

class StatusGraph extends Component {
  constructor() {
    super();
    this.state = {
      colors: [],
      statusList: [],
      loading: true
    };
  }

  componentDidMount = () => {
    this.setState({
      loading: this.props.workflowKindStatus.loading,
      activeFilter: this.props.workflowFilters.status[0]
    });
  };

  handleChange = value => {
    this.setState({ selected: value });
    const payload = { filterType: "status", filterValue: [value] };
    this.props.dispatch(workflowFiltersActions.setFilters(payload));
  };

  componentDidUpdate = prev => {
    if (
      this.props.workflowKindStatus.status_counts !==
        prev.workflowKindStatus.status_counts &&
      this.props.workflowKindStatus.status_counts.length !== 0
    ) {
      this.setState({
        loading: false,
        statusList: this.generateData(
          this.props.workflowKindStatus.status_counts
        )
      });
    }

    if (this.props.workflowFilters.status !== prev.workflowFilters.status) {
      this.setState({ activeFilter: this.props.workflowFilters.status[0] });
    }
  };

  pieClick = e => {
    this.handleChange(e.id);
  };

  legendClick = e => {
    this.handleChange(e.payload.id);
  };

  generateData = fList => {
    const arr = [];
    _.map(fList, function(i, index) {
      const item = { name: i.status.label, id: i.status.id, value: i.count };
      arr.push(item);
    });
    return arr;
  };

  removeFilter = () => {
    const payload = { filterType: "status", filterValue: [] };
    this.props.dispatch(workflowFiltersActions.setFilters(payload));
  };

  render = () => {
    const COLORS = [
      "#C0CA33",
      "#039BE5",
      "#6D4C41",
      "#FDD835",
      "#FFB300",
      "#5E35B1",
      "#43A047",
      "#F4511E",
      "#546E7A",
      "#1E88E5",
      "#E53935",
      "#00ACC1",
      "#D81B60",
      "#3949AB",
      "#00897B",
      "#7CB342",
      "#8E24AA",
      "#757575",
      "#FB8C00"
    ];

    const renderLegend = props => {
      const { payload } = props;
      return (
        <ul className="chart-legend-list">
          {payload.map((entry, index) => (
            <li
              key={`item-${index}`}
              className="pd-ard-sm display-inline-block  recharts-legend-item"
              onClick={() => props.onClick(entry)}
            >
              <span
                className="display-inline-block"
                style={{
                  width: "10px",
                  height: "10px",
                  backgroundColor: entry.color
                }}
              >
                {" "}
              </span>{" "}
              ({entry.payload.value}) {entry.value}
            </li>
          ))}
          <br />
          {!_.isEmpty(payload) ? (
            <li
              key="close"
              className="chart-legend-list-item   display-inline-block recharts-legend-item"
              onClick={this.removeFilter}
            >
              <i className="material-icons t-14 text-middle text-red pd-right-sm">
                cancel
              </i>
              <b>Clear filter</b>
            </li>
          ) : null}
        </ul>
      );
    };

    return this.state.loading ? (
      <div className="text-center">
        <Icon type="loading" loading />
      </div>
    ) : (
      <div style={{ width: "100%", height: "150px" }}>
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={this.state.statusList}
              nameKey="name"
              dataKey="value"
              innerRadius={"60%"}
              outerRadius={"100%"}
              onClick={this.pieClick}
              fill="#e4229a"
              cx="20%"
            >
              {this.state.statusList.map((entry, index) => (
                <Cell key={`${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <RTooltip />
            <Legend
              content={renderLegend}
              verticalAlign="middle"
              align="right"
              onClick={this.legendClick}
              wrapperStyle={{ maxWidth: "65%", textAlight: "left" }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    );
  };
}

function mapStateToProps(state) {
  const { workflowKindStatus, workflowFilters } = state;
  return {
    workflowKindStatus,
    workflowFilters
  };
}

export default connect(mapStateToProps)(StatusGraph);
