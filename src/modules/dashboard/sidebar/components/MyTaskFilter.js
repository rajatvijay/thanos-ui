import React, { Component } from "react";
import { DefaultTaskQueue } from "./TaskQueue";
import { getMyTasksCount$$ } from "../../services";
import { FormattedMessage, injectIntl } from "react-intl";

class MyTaskFilter extends Component {
  state = {
    isLoading: false,
    count: null,
    error: null
  };
  getMyTasksCount = async () => {
    this.setState({ isLoading: true });
    try {
      const response = await getMyTasksCount$$();
      this.setState({
        count: response["Assignee"] || 0,
        isLoading: false
      });
    } catch (e) {
      this.setState({ isLoading: false });
    }
  };
  async componentDidMount() {
    this.getMyTasksCount();
  }
  render() {
    const { isLoading, count, error } = this.state;
    const { isSelected, onClick } = this.props;

    if (error) {
      return null;
    }

    return (
      <DefaultTaskQueue
        item={{
          name: <FormattedMessage id="mainSidebar.myTasksText" />,
          count
          // TODO: Add image here
          // image: user
        }}
        loading={isLoading}
        onClick={onClick}
        isSelected={isSelected}
      />
    );
  }
}

export default injectIntl(MyTaskFilter);
