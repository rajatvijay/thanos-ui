import React from "react";
import { render } from "@testing-library/react";
import CountWidget from "../components/CountWidget";

test("should render the value passed as prop", () => {
  const fakeValue = "fakevalue";
  const { getByText } = render(<CountWidget value={fakeValue} />);
  expect(getByText(fakeValue)).toBeInTheDocument();
});
