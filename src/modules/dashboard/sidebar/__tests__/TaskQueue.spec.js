import React from "react";
import { render } from "@testing-library/react";
import { TaskQueue } from "../components/TaskQueue";

test("should render workflow count under this task queue", () => {
  const fakeTaskQueue = { count: "test count" };
  const { getByText } = render(<TaskQueue item={fakeTaskQueue} />);
  expect(getByText(String(fakeTaskQueue.count))).toBeInTheDocument();
});

test("should render the name of the task queue", () => {
  const fakeTaskQueue = { name: "Fake Task Queue" };
  const { getByText } = render(<TaskQueue item={fakeTaskQueue} />);
  expect(getByText(fakeTaskQueue.name)).toBeInTheDocument();
});

test("should render the overdue count when it is greater than zero", () => {
  const fakeTaskQueue = { overdue_count: 5237 };
  const { getByText } = render(<TaskQueue item={fakeTaskQueue} />);
  expect(getByText(String(fakeTaskQueue.overdue_count))).toBeInTheDocument();
});

test("should not render the overdue count when it is zero", () => {
  const fakeTaskQueue = { overdue_count: 0 };
  const { queryByText } = render(<TaskQueue item={fakeTaskQueue} />);
  expect(queryByText(String(fakeTaskQueue.overdue_count))).toBeNull();
});

test("should call onSelect prop with item provided", () => {
  const fakeTaskQueue = { name: "Fake Task Queue" };
  const onSelect = jest.fn();
  const { getByTestId } = render(
    <TaskQueue item={fakeTaskQueue} onClick={onSelect} />
  );
  const element = getByTestId("task-queue-list-item");
  element.click();
  expect(onSelect).toHaveBeenCalledTimes(1);
  expect(onSelect).toHaveBeenCalledWith(fakeTaskQueue);
});
