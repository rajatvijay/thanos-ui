import React from "react";
import { Icon } from "antd";
import {
  StyledContainer,
  StyledHeader,
  StyledPadding,
  StyledBody,
  StyledCard,
  StyledHeading,
  StyledDescription,
  StyledFooter,
  StyledButton
} from "./ErrorBoundary";
import { history } from "../../_helpers";

export const ServiceUnavailableError = () => {
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
            The server is under maintenance. Please check back in a few minutes.
          </StyledDescription>
          <StyledFooter>
            <StyledButton onClick={() => history.goBack()}>
              GO BACK
            </StyledButton>
          </StyledFooter>
        </StyledCard>
      </StyledBody>
      <StyledPadding />
    </StyledContainer>
  );
};
