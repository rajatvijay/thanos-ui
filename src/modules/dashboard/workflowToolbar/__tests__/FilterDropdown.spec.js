import React from "react";
import { render, fireEvent } from "@testing-library/react";
import FilterDropdown from "../components/FilterDropdown";

// Mock data
const fakePlaceholder = "Fake Placeholder";
const fakeOptions = [
  { label: "Fake Label 1", value: "Fake Value 1" },
  { label: "Fake Label 2", value: "Fake Value 2" }
];

test("should render the placeholder from the props", () => {
  const { queryByText } = render(
    <FilterDropdown placeholder={fakePlaceholder} />
  );
  expect(queryByText(fakePlaceholder)).toBeInTheDocument();
});

test("should render all the options from the props", () => {
  const { queryByText } = render(
    <FilterDropdown placeholder={fakePlaceholder} data={fakeOptions} />
  );
  const placeholderNode = queryByText(fakePlaceholder);
  fireEvent.click(placeholderNode);

  expect(queryByText(fakeOptions[0].label)).toBeInTheDocument();
  expect(queryByText(fakeOptions[1].label)).toBeInTheDocument();
});

test("should render all the options from the props", () => {
  const { queryByText } = render(
    <FilterDropdown placeholder={fakePlaceholder} data={fakeOptions} />
  );

  // Open the dropdown
  const placeholderNode = queryByText(fakePlaceholder);
  fireEvent.click(placeholderNode);

  expect(queryByText(fakeOptions[0].label)).toBeInTheDocument();
  expect(queryByText(fakeOptions[1].label)).toBeInTheDocument();
});

test("should call the onSelect callback with selected value and item", () => {
  const onSelect = jest.fn();
  const { queryByText } = render(
    <FilterDropdown
      placeholder={fakePlaceholder}
      data={fakeOptions}
      onSelect={onSelect}
    />
  );

  // Open the dropdown
  const placeholderNode = queryByText(fakePlaceholder);
  fireEvent.click(placeholderNode);

  // Select the first option
  const optionNode = queryByText(fakeOptions[0].label);
  fireEvent.click(optionNode);

  expect(onSelect).toHaveBeenCalledTimes(1);
  expect(onSelect).toHaveBeenCalledWith(fakeOptions[0].value, fakeOptions[0]);
});

test("should render the loading icon if loading prop is true", () => {
  const { container } = render(<FilterDropdown loading={true} />);
  const loadingIconNode = container.querySelector(".anticon-loading");
  expect(loadingIconNode).not.toBeNull();
});

test("should render filtered options if searcahble prop is true", () => {
  const { queryByText, container } = render(
    <FilterDropdown
      searchable
      placeholder={fakePlaceholder}
      data={[
        { label: "Alpha", value: "Alpha" },
        { label: "Beta", value: "Beta" },
        { label: "Gamma", value: "Gamma" },
        { label: "Delta", value: "Delta" }
      ]}
    />
  );

  // Open the dropdown
  const placeholderNode = queryByText(fakePlaceholder);
  fireEvent.click(placeholderNode);

  const inputNode = container.querySelector("input");
  fireEvent.change(inputNode, {
    target: {
      value: "al"
    }
  });

  expect(queryByText(/alpha/i)).toBeInTheDocument();
  expect(queryByText(/beta/i)).toBeNull();
  expect(queryByText(/gamma/i)).toBeNull();
  expect(queryByText(/delta/i)).toBeNull();
});
