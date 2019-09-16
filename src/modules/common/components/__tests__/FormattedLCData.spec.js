import React from "react";
import { render } from "@testing-library/react";
import { FormattedLCData } from "../FormattedLCData";

test("should render nothing if no props are passed", () => {
  const instance = render(<FormattedLCData />);
  expect(instance.container.innerHTML).toBe("");
});

test('should render according to "icon" format', () => {
  const fakeProps = {
    format: "icon",
    value: "http://test.test/",
    label: "Icon Type"
  };
  const instance = render(<FormattedLCData {...fakeProps} />);

  expect(
    instance.container.getElementsByTagName("a").length
  ).toBeGreaterThanOrEqual(1);
});

test("should render D-U-N-S number properly formatted", () => {
  const fakeProps = {
    format: "duns",
    value: "777777777",
    label: "DUNS"
  };
  const instance = render(<FormattedLCData {...fakeProps} />);

  expect(instance.queryAllByText("77-777-7777").length).toBeGreaterThanOrEqual(
    1
  );
});

test("should render text as it is because of unsupported format", () => {
  const fakeProps = {
    format: "someunsupportedformat",
    value: "777777777",
    label: "Unsupported Format"
  };
  const instance = render(<FormattedLCData {...fakeProps} />);

  expect(instance.queryAllByText("777777777").length).toBeGreaterThanOrEqual(1);
});

test("should render text as it is because of unsupported format", () => {
  const fakeProps = {
    format: "duns",
    value: "",
    label: "DUNS"
  };
  const instance = render(<FormattedLCData {...fakeProps} />);

  expect(instance.container.innerHTML).toBe("");
});
