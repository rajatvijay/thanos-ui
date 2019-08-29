import React from "react";
import { render, fireEvent } from "@testing-library/react";
import FormattedTextInput from "../FormattedTextInput";

test("should render format input value according to formatting and return formatted value", () => {
  const handleOnChange = jest.fn();
  const instance = render(
    <FormattedTextInput
      format={"##-###-####"}
      onChange={handleOnChange}
      useFormattedValue={true}
      data-testid="t1"
    />
  ).getAllByTestId("t1")[0];

  fireEvent.input(instance, { target: { value: "777777777" } });
  expect(handleOnChange).toHaveBeenCalledWith({
    target: { value: "77-777-7777" }
  });
  expect(instance.value).toBe("77-777-7777");
});

test("should render format input value according to formatting and return raw formatted value", () => {
  const handleOnChange = jest.fn();
  const instance = render(
    <FormattedTextInput
      format={"##-###-####"}
      onChange={handleOnChange}
      data-testid="t1"
    />
  ).getAllByTestId("t1")[0];

  fireEvent.input(instance, { target: { value: "77-777-7777" } });
  expect(handleOnChange).toHaveBeenCalledWith({
    target: { value: "777777777" }
  });
  expect(instance.value).toBe("77-777-7777");

  // Appending more text, which shouldn't append, and the result must not change.
  fireEvent.input(instance, { target: { value: "abcdefge" } });
  expect(handleOnChange).toHaveBeenCalledWith({
    target: { value: "777777777" }
  });
  expect(instance.value).toBe("77-777-7777");
});

test("should render formatted input with formatting where it doesn't where it doesn't goes beyond allowed character limit", () => {
  const handleOnChange = jest.fn();
  const instance = render(
    <FormattedTextInput
      format={"##-###-####"}
      onChange={handleOnChange}
      data-testid="t1"
    />
  ).getAllByTestId("t1")[0];

  fireEvent.input(instance, {
    target: { value: "1a2b3c4d5e6r7t8t90abcdefghijklmnopqrst" }
  });
  expect(instance.value).not.toBe("1a2b3c4d5e6r7t8t90abcdefghijklmnopqrst");
  expect(instance.value).toBe("12-345-6789");
});

test("should render TextArea from instead of NumberFormat due to unspecified format", () => {
  const handleOnChange = jest.fn();
  const instance = render(
    <FormattedTextInput onChange={handleOnChange} data-testid="t1" />
  );

  expect(
    instance.queryAllByText("Unspecified format").length
  ).toBeGreaterThanOrEqual(1);
});

test("should render TextArea from instead of NumberFormat due to unsupported format", () => {
  const handleOnChange = jest.fn();
  const instance = render(
    <FormattedTextInput
      format={"__random__"}
      onChange={handleOnChange}
      data-testid="t1"
    />
  );

  expect(
    instance.queryAllByText("Unsupported format __random__").length
  ).toBeGreaterThanOrEqual(1);
});
