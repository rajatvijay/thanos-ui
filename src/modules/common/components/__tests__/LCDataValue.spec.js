import React from "react";
import { render } from "@testing-library/react";
import { LCDataValue } from "../LCDataValue";

test("should render hypen if no props are passed", () => {
  const instance = render(<LCDataValue />);
  expect(instance.container.children[0].innerHTML).toBe("-");
});

test("should render nothing if no value is passed but isAlert is present", () => {
  const instance = render(<LCDataValue isAlert={true} />);
  expect(instance.container.children[0].innerHTML).toBe("");
});

test("should render hyphen when no value is passed and isAlert is no preset/false", () => {
  const fakeProps = {
    format: "duns",
    value: "",
    label: "DUNS"
  };
  const instance = render(<LCDataValue {...fakeProps} />);

  expect(instance.container.children[0].innerHTML).toBe("-");
});

test('should render according to "icon" format', () => {
  const fakeProps = {
    format: "icon",
    value: "http://test.test/",
    label: "Icon Type"
  };
  const instance = render(<LCDataValue {...fakeProps} />);

  expect(
    instance.container.getElementsByTagName("a").length
  ).toBeGreaterThanOrEqual(1);

  expect(
    instance.queryAllByText("picture_as_pdf").length
  ).toBeGreaterThanOrEqual(1);
});

test("should render D-U-N-S number properly formatted", () => {
  const fakeProps = {
    format: "duns",
    value: "777777777",
    label: "DUNS"
  };
  const instance = render(<LCDataValue {...fakeProps} />);

  expect(instance.queryAllByText("77-777-7777").length).toBeGreaterThanOrEqual(
    1
  );
});

test('should render PID with class "t-upr"', () => {
  const fakeProps = {
    format: "pid",
    value: "123456789",
    label: "DUNS"
  };
  const instance = render(<LCDataValue {...fakeProps} />);

  expect(instance.queryAllByText("123456789").length).toBeGreaterThanOrEqual(1);
  expect(instance.container.children[0].className).toBe("t-upr");
});

test("should render date formatted like MM/DD/YYYY", () => {
  const fakeProps = {
    format: "date",
    value: "2019-08-28T17:03:17.892Z",
    label: "Date"
  };
  const instance = render(<LCDataValue {...fakeProps} />);

  expect(instance.queryAllByText("08/28/2019").length).toBe(1);
  expect(instance.queryAllByText("2019-08-28T17:03:17.892Z").length).toBe(0);
});

test("should render NOT date formatted like MM/DD/YYYY, instead just like plain text", () => {
  const fakeProps = {
    format: "date",
    value: "Wed Aug 28 2019 22:34:14 GMT+0530",
    label: "Date"
  };
  const instance = render(<LCDataValue {...fakeProps} />);

  expect(instance.queryAllByText("08/28/2019").length).toBe(0);
  expect(
    instance.queryAllByText("Wed Aug 28 2019 22:34:14 GMT+0530").length
  ).toBe(1);
});

test("should render text as it is because of unsupported format", () => {
  const fakeProps = {
    format: "someunsupportedformat",
    value: "777777777",
    label: "Unsupported Format"
  };
  const instance = render(<LCDataValue {...fakeProps} />);

  expect(instance.queryAllByText("777777777").length).toBeGreaterThanOrEqual(1);
});
