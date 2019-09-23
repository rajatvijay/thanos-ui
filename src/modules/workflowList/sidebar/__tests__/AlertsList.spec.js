import React from "react";
import { renderWithReactIntl as render } from "../../../common/utils/testUtils";
import AlertList from "../components/AlertList";

test("should render loader when the data is loading", () => {
  const fakeAlerts = [
    {
      name: "Fake Alert",
      count: 576,
      sub_categories: [
        { id: 524, name: "Fake Alert Sub Category 1", count: 572 }
      ]
    }
  ];
  const { getByTestId } = render(
    <AlertList loading={true} alerts={fakeAlerts} />
  );
  expect(getByTestId("loader")).toBeInTheDocument();
});

test("should not render loader when the data is loaded", () => {
  const fakeAlerts = [
    {
      id: 511,
      name: "Fake Alert",
      count: 576,
      sub_categories: [
        { id: 524, name: "Fake Alert Sub Category 1", count: 572 }
      ]
    }
  ];
  const { queryByTestId } = render(
    <AlertList loading={false} alerts={fakeAlerts} />
  );
  expect(queryByTestId("loader")).toBeNull();
});

test("should render 'Notifications' heading when there is atleast one alert", () => {
  const fakeAlerts = [
    {
      id: 511,
      name: "Fake Alert",
      count: 576,
      sub_categories: [
        { id: 524, name: "Fake Alert Sub Category 1", count: 572 }
      ]
    }
  ];
  const { getByText } = render(
    <AlertList loading={false} alerts={fakeAlerts} />
  );
  expect(getByText(/notifications/i)).toBeInTheDocument();
});

test("should not render 'Alerts' heading when there are no alerts", () => {
  const fakeAlerts = [];
  const { queryByText } = render(
    <AlertList loading={false} alerts={fakeAlerts} />
  );
  expect(queryByText(/alerts/i)).toBeNull();
});

test("should render alerts name when the data is loaded", () => {
  const fakeAlerts = [
    {
      id: 511,
      name: "Fake Alert",
      count: 576,
      sub_categories: [{ id: 524, name: "Fake Sub Category 1", count: 572 }]
    }
  ];
  const { getByText } = render(
    <AlertList loading={false} alerts={fakeAlerts} />
  );
  expect(getByText(/Fake Alert/i)).toBeInTheDocument();
});

test("should render workflow count when the data is loaded", () => {
  const fakeAlerts = [
    {
      id: 511,
      name: "Fake Alert",
      count: 576,
      sub_categories: [{ id: 524, name: "Fake Sub Category 1", count: 572 }]
    }
  ];
  const { getByText } = render(
    <AlertList loading={false} alerts={fakeAlerts} />
  );
  expect(getByText(String(576))).toBeInTheDocument();
});

test("should render all alerts when data is loaded", () => {
  const fakeAlerts = [
    {
      id: 511,
      name: "Fake Alert 1",
      count: 576,
      sub_categories: [{ id: 524, name: "Fake Sub Category 1", count: 572 }]
    },
    {
      id: 512,
      name: "Fake Alert 2",
      count: 576,
      sub_categories: [{ id: 524, name: "Fake Sub Category 1", count: 572 }]
    },
    {
      id: 513,
      name: "Fake Alert 3",
      count: 576,
      sub_categories: [{ id: 524, name: "Fake Sub Category 1", count: 572 }]
    },
    {
      id: 514,
      name: "Fake Alert 4",
      count: 576,
      sub_categories: [{ id: 524, name: "Fake Sub Category 1", count: 572 }]
    }
  ];
  const { getAllByTestId } = render(
    <AlertList loading={false} alerts={fakeAlerts} />
  );
  expect(getAllByTestId("alerts-list-item").length).toBe(fakeAlerts.length);
});

test("should call onSelectAlert with subcategory item when it is clicked", () => {
  const fakeAlerts = [
    {
      id: 511,
      name: "Fake Alert",
      count: 576,
      sub_categories: [{ id: 524, name: "Fake Sub Category 1", count: 572 }]
    }
  ];
  const onSelectAlert = jest.fn();
  const { getByText } = render(
    <AlertList loading={false} alerts={fakeAlerts} onClick={onSelectAlert} />
  );
  const element = getByText(/Fake Sub Category 1/i);
  element.click();
  expect(onSelectAlert).toHaveBeenCalledTimes(1);
  expect(onSelectAlert).toHaveBeenCalledWith({
    id: 524,
    name: "Fake Sub Category 1",
    count: 572
  });
});
