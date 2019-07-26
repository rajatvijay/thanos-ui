import React, { Component } from "react";
import { Icon, Spin } from "antd";
import styled from "@emotion/styled";
import { css } from "emotion";
import Alerts from "./Alerts";

class AlertList extends Component {
  state = { selected: null };

  onSelect = alert => {
    const { onSelectAlert } = this.props;
    const { selected } = this.state;

    if (selected === alert.name) {
      this.setState({ selected: null });
    } else {
      this.setState({ selected: alert.name });
    }

    onSelectAlert(alert);
  };

  renderList = () => {
    const { alerts, loading } = this.props;
    return alerts.map(item => {
      return (
        <Alerts
          key={`alert_${item.id}`}
          loading={loading}
          selected={this.state.selected}
          onSelect={this.onSelect}
          item={item}
        />
      );
    });
  };

  render() {
    const { alerts, loading } = this.props;

    if (loading) {
      return (
        <div
          className={css`
            text-align: center;
          `}
        >
          <Spin
            data-testid="loader"
            indicator={
              <Icon
                type="loading"
                className={css`
                  font-size: 24px;
                  color: white;
                `}
                spin
              />
            }
          />
        </div>
      );
    }

    if (!alerts || !alerts.length) {
      return null;
    }

    return (
      <div>
        <StyledAlertsHeading>ALERTS</StyledAlertsHeading>
        <div>
          <ul
            className={css`
              padding: 0;
              list-style: none;
            `}
          >
            {this.renderList()}
          </ul>
        </div>
      </div>
    );
  }
}

export default AlertList;

const StyledAlertsHeading = styled.h1`
  color: #138bd4;
  margin: 40px 0px 20px 20px;
  font-size: 12px;
  font-weight: bold;
  letter-spacing: 0.8px;
`;
