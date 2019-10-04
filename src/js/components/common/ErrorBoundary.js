import React, { Component } from "react";
import * as Sentry from "@sentry/browser";
import styled from "@emotion/styled";
import { Button, Icon } from "antd";

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  componentDidCatch(err, info) {
    this.setState({ hasError: true });
    this.eventId = Sentry.captureException(err);
    Sentry.captureEvent({
      stacktrace: [],
      beforeBreadcrumb(breadcrumb, hint) {
        return breadcrumb.category === "ui.click" ? null : breadcrumb;
      }
    });
  }
  showFeedbackModal = () => {
    Sentry.showReportDialog({
      eventId: this.eventId || "unknown",
      title: "Feedback",
      subtitle: "Please share the details about actions that led you here.",
      subtitle2:
        "Your feedback is extremely importatnt to us, as it will help us improve the product and serve you better."
    });
  };

  handleGoHome = () => {
    window.location.href = "/";
  };

  render() {
    if (this.state.hasError) {
      return (
        <ErrorPage
          onSubmitFeedback={this.showFeedbackModal}
          onGoHome={this.handleGoHome}
        />
      );
    }
    return this.props.children;
  }
}

const ErrorPage = ({ onSubmitFeedback, onGoHome }) => {
  return (
    <StyledContainer>
      <StyledPadding />
      <StyledBody>
        <StyledCard>
          <StyledHeader>
            <Icon type="meh" style={{ color: "#ffffff", fontSize: 64 }} />
            <StyledHeading>Oops!</StyledHeading>
          </StyledHeader>
          <StyledDescription>
            Sorry! It looks like something isn’t working. Our engineering team
            has been notified. Thanks for your patience as they work through to
            get this running back up again. In the meantime please consider
            submitting feedback on the the actions that led you here.
          </StyledDescription>
          <StyledFooter>
            <StyledButton onClick={onGoHome}>GO HOME</StyledButton>
            <StyledButton type="primary" onClick={onSubmitFeedback}>
              SUBMIT FEEDBACK
            </StyledButton>
          </StyledFooter>
        </StyledCard>
      </StyledBody>
      <StyledPadding />
    </StyledContainer>
  );
};

const StyledContainer = styled.div`
  height: 100vh;
  width: 100vw;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
`;

const StyledHeader = styled.div`
  background-color: #148cd6;
  margin: -40px -24px 24px -24px;
  padding-top: 32px;
  padding-bottom: 12px;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const StyledPadding = styled.div`
  flex: 1;
`;

const StyledBody = styled.div`
  flex: 3;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const StyledFooter = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 48px;
`;

const StyledButton = styled(Button)`
  flex: 1;
  margin: 0 12px;
`;

const StyledCard = styled.div`
  width: 40%;
  min-width: 400px;
  box-shadow: 0px 5px 5px rgba(0, 0, 0, 0.1);
  padding: 40px 24px;
  border: 1px solid #ccc;
  border-radius: 4px;
  align-items: center;
  justify-content: center;
  overflow: hidden;
`;

const StyledHeading = styled.h1`
  text-align: center;
  color: #ffffff;
  margin-top: 12px;
`;

const StyledDescription = styled.p`
  text-align: center;
`;
