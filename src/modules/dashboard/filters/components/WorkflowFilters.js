import React, { Component } from "react";
import { connect, batch } from "react-redux";
import {
  getAllTaskQueuesThunk,
  getAllAlertsThunk,
  getAdvancedFilterDataThunk,
  getBusinessUnitsThunk,
  getWorkflowListThunk,
  applyFiltersFromStateThunk
} from "../../thunks";
import {
  setWorkflowFilter,
  setMultipleWorkflowFilters,
  removeWorkflowFilter
} from "../../actionCreators";
import { FILTERS_ENUM } from "../../constants";
import { selectedBasicFiltersSelector } from "../../selectors";

class WorkflowFitlers extends Component {
  // TODO: Add docs
  addFilters = async (
    filters = [],
    removeRest = false,
    removeFilters = [],
    callback = null
  ) => {
    this.validateFitlerData(filters);
    // Set/Remove all the filters in the state
    // Using batch to optimize re-rendering
    batch(() => {
      if (removeRest) {
        FILTERS_ENUM.forEach(filter =>
          this.props.removeWorkflowFilter(filter.name)
        );
      } else if (Array.isArray(removeFilters)) {
        removeFilters.forEach(filter =>
          this.props.removeWorkflowFilter(filter)
        );
      }
      this.props.setMultipleWorkflowFilters(filters);
    });

    // Custom business logic in case of some specific filters
    filters.forEach(filter => {
      if (filter.name === FILTERS_ENUM.KIND_FILTER.name) {
        this.props.getAllTaskQueuesThunk(filter.meta.tag);
        this.props.getAllAlertsThunk(filter.meta.tag);
        this.props.getAdvancedFilterDataThunk(filter.meta.tag);
      }

      if (filter.name === FILTERS_ENUM.REGION_FILTER.name) {
        this.props.getBusinessUnitsThunk(filter.value);
      }
    });

    // Waiting for next tick, so that component can be re-rendered with new state
    // setTimeout(async () => {
    //   // Apply the filters from the state
    //   await this.props.getWorkflowListThunk(this.createFilterParams());
    //   callback && callback(); // FIXME: See if some param is required
    // });
    this.props.applyFiltersFromStateThunk();
  };

  validateFitlerData = filters => {
    filters.forEach(filter => {
      if (!filter.name) {
        // Putting this as a hard check because
        // w/o this applying filters doesn't make sense
        throw new Error(
          "WorkflowFilters: filter name is mandatory for addFilter function"
        );
      }
      if (!filter.value || !filter.key) {
        console.warn(
          `WorkflowFitlers: Unexpected arguments for addFilters functions, only recieved for ${filter.name}`
        );
      }
    });
  };

  createFilterParams = () => {
    const params = {};
    const { selectedWorkflowFilters: filters } = this.props;

    for (let filterName in filters) {
      const { key, value } = filters[filterName];
      params[key] = value;
    }

    if (params[FILTERS_ENUM.MY_TASK_FILTER.key]) {
      delete params[FILTERS_ENUM.KIND_FILTER.key];
    }

    return params;
  };

  removeFilters = filters => {
    this.addFilters([], false, filters);
  };

  removeAllFilters = () => {
    this.addFilters([], true);
  };

  getSelectedFilterValue = (filterName, key = "meta") => {
    const filter = this.props.selectedWorkflowFilters[filterName];
    return filter ? filter[key] : null;
  };

  render() {
    const { children } = this.props;
    if (!React.isValidElement(children)) {
      console.warn(
        `WorkflowFitlers: Expected a valid react element found ${typeof children}`
      );
      return null;
    }

    const filterProps = {
      addFilters: this.addFilters,
      removeFilters: this.removeFilters,
      removeAllFilters: this.removeAllFilters,
      selectedFilters: this.props.selectedWorkflowFilters,
      getSelectedFilterValue: this.getSelectedFilterValue,
      selectedBasicWorkflowFilters: this.props.selectedBasicWorkflowFilters
    };
    const childrenWithProps = React.Children.map(children, child =>
      React.cloneElement(child, filterProps)
    );

    return <div>{childrenWithProps}</div>;
  }
}

const mapStateToProps = state => ({
  selectedWorkflowFilters: state.workflowList.selectedWorkflowFilters,
  selectedBasicWorkflowFilters: selectedBasicFiltersSelector(state)
});

const WrappedWorkflowFitlers = connect(
  mapStateToProps,
  {
    setWorkflowFilter,
    getAllTaskQueuesThunk,
    getAllAlertsThunk,
    getAdvancedFilterDataThunk,
    getBusinessUnitsThunk,
    getWorkflowListThunk,
    setMultipleWorkflowFilters,
    removeWorkflowFilter,
    applyFiltersFromStateThunk
  }
)(WorkflowFitlers);

// creating an HOC
export default function(ChildComponent) {
  return props => (
    <WrappedWorkflowFitlers>
      <ChildComponent {...props} />
    </WrappedWorkflowFitlers>
  );
}
