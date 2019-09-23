import React from "react";
import { render } from "@testing-library/react";
import Alerts from "../components/Alerts";

test("should render the name of the alert", () => {
  const fakeAlert = {
    name: "Fake Alert",
    count: 576,
    sub_categories: []
  };
  const { getByText } = render(<Alerts item={fakeAlert} />);
  expect(getByText(fakeAlert.name)).toBeInTheDocument();
});

test("should render the workflow count if not zero", () => {
  const fakeAlert = {
    name: "Fake Alert",
    count: 576,
    sub_categories: []
  };
  const { getByText } = render(<Alerts item={fakeAlert} />);
  expect(getByText(String(fakeAlert.count))).toBeInTheDocument();
});

test("should not render the workflow count if zero", () => {
  const fakeAlert = {
    name: "Fake Alert",
    count: 0,
    sub_categories: []
  };
  const { queryByText } = render(<Alerts item={fakeAlert} />);
  expect(queryByText(String(fakeAlert.count))).toBeNull();
});

test("should render all the alert sub categories", () => {
  const fakeAlert = {
    name: "Fake Alert",
    count: 0,
    sub_categories: [
      { id: 524, name: "Fake Alert Sub Category 1", count: 572 },
      { id: 525, name: "Fake Alert Sub Category 2", count: 573 },
      { id: 526, name: "Fake Alert Sub Category 3", count: 574 },
      { id: 527, name: "Fake Alert Sub Category 4", count: 575 },
      { id: 528, name: "Fake Alert Sub Category 5", count: 576 },
      { id: 529, name: "Fake Alert Sub Category 6", count: 577 },
      { id: 523, name: "Fake Alert Sub Category 7", count: 578 }
    ]
  };
  const { getAllByTestId } = render(<Alerts item={fakeAlert} />);
  expect(getAllByTestId("alerts-list-item").length).toBe(
    fakeAlert.sub_categories.length
  );
});

test("should render the name of the  sub category", () => {
  const fakeAlert = {
    name: "Fake Alert",
    count: 576,
    sub_categories: [{ id: 524, name: "Fake Alert Sub Category 1", count: 572 }]
  };
  const { getByText } = render(<Alerts item={fakeAlert} />);
  expect(getByText(/fake alert sub category/i)).toBeInTheDocument();
});

test("should render the workflow count for the  sub category", () => {
  const fakeAlert = {
    name: "Fake Alert",
    count: 576,
    sub_categories: [{ id: 524, name: "Fake Alert Sub Category 1", count: 572 }]
  };
  const { getByText } = render(<Alerts item={fakeAlert} />);
  expect(getByText(String(572))).toBeInTheDocument();
});

test("should call onSelect with alert sub cateogry when a it is clicked", () => {
  const fakeAlert = {
    name: "Fake Alert",
    count: 576,
    sub_categories: [{ id: 524, name: "Fake Alert Sub Category 1", count: 572 }]
  };
  const onSelect = jest.fn();
  const { getByText } = render(<Alerts item={fakeAlert} onClick={onSelect} />);
  const element = getByText(/Fake Alert Sub Category 1/i);
  element.click();
  expect(onSelect).toHaveBeenCalledTimes(1);
  expect(onSelect).toHaveBeenCalledWith({
    id: 524,
    name: "Fake Alert Sub Category 1",
    count: 572
  });
});
