import React from "react";
import { renderWithReactIntl as render } from "../../common/testUtils";
import TaskQueueList from "../components/TaskQueueList";

test("should render loading and no task queue when data is loading", () => {
  const fakeTaskQueues = [
    { tag: "tq10", count: 532, overdue_count: 29, name: "Test Task Queue" }
  ];
  const { getByTestId, queryByTestId } = render(
    <TaskQueueList taskQueues={fakeTaskQueues} loading={true} />
  );
  expect(getByTestId("loader")).toBeInTheDocument();
  expect(queryByTestId("task-queue-list-item")).toBeNull();
});

test("should not render 'Task Queue' heading when data is loading", () => {
  const fakeTaskQueues = [
    { tag: "tq10", count: 532, overdue_count: 29, name: "Test Task Queue" }
  ];
  const { queryByText } = render(
    <TaskQueueList taskQueues={fakeTaskQueues} loading={true} />
  );
  expect(queryByText(/task queues/i)).toBeNull();
});

test("should render the heading 'Task Queues' when data is loaded and have atleast one task queue", () => {
  const fakeTaskQueues = [
    { tag: "tq10", count: 532, overdue_count: 29, name: "Test Task Queue" }
  ];
  const { getByText } = render(
    <TaskQueueList taskQueues={fakeTaskQueues} loading={false} />
  );
  expect(getByText(/task queues/i)).toBeInTheDocument();
});

test("should not render the heading 'Task Queues' when data is loaded and have no task queue", () => {
  const fakeTaskQueues = [];
  const { queryByText } = render(
    <TaskQueueList taskQueues={fakeTaskQueues} loading={false} />
  );
  expect(queryByText(/task queues/i)).toBeNull();
});

test("should render only the 5 task queues initially with 'Show All' button texts", () => {
  const fakeTaskQueues = [
    { tag: "tq10", count: 532, overdue_count: 29, name: "Test Task Queue" },
    { tag: "tq11", count: 532, overdue_count: 29, name: "Test Task Queue" },
    { tag: "tq12", count: 532, overdue_count: 29, name: "Test Task Queue" },
    { tag: "tq13", count: 532, overdue_count: 29, name: "Test Task Queue" },
    { tag: "tq14", count: 532, overdue_count: 29, name: "Test Task Queue" },
    { tag: "tq15", count: 532, overdue_count: 29, name: "Test Task Queue" }
  ];
  const { queryByText, getByText, queryAllByTestId } = render(
    <TaskQueueList taskQueues={fakeTaskQueues} loading={false} />
  );
  expect(getByText(/show all/i)).toBeInTheDocument();
  expect(queryByText(/show less/i)).toBeNull();
  expect(queryAllByTestId("task-queue-list-item").length).toBe(5);
});

test("should render all the task queues when 'Show All' is clicked with 'Show Less' button text", () => {
  const fakeTaskQueues = [
    { tag: "tq10", count: 532, overdue_count: 29, name: "Test Task Queue" },
    { tag: "tq11", count: 532, overdue_count: 29, name: "Test Task Queue" },
    { tag: "tq12", count: 532, overdue_count: 29, name: "Test Task Queue" },
    { tag: "tq13", count: 532, overdue_count: 29, name: "Test Task Queue" },
    { tag: "tq14", count: 532, overdue_count: 29, name: "Test Task Queue" },
    { tag: "tq15", count: 532, overdue_count: 29, name: "Test Task Queue" }
  ];
  const { queryByText, getByText, queryAllByTestId } = render(
    <TaskQueueList taskQueues={fakeTaskQueues} loading={false} />
  );
  const showAll = getByText(/show all/i);
  showAll.click();
  expect(queryByText(/show all/i)).toBeNull();
  expect(getByText(/show less/i)).toBeInTheDocument();
  expect(queryAllByTestId("task-queue-list-item").length).toBe(
    fakeTaskQueues.length
  );
});

test("should render task queue's name for all task queues initially", () => {
  const fakeTaskQueues = [
    { tag: "tq10", count: 532, overdue_count: 25, name: "Test Task Queue 1" },
    { tag: "tq11", count: 533, overdue_count: 26, name: "Test Task Queue 2" },
    { tag: "tq12", count: 534, overdue_count: 27, name: "Test Task Queue 3" },
    { tag: "tq13", count: 535, overdue_count: 28, name: "Test Task Queue 4" },
    { tag: "tq14", count: 536, overdue_count: 29, name: "Test Task Queue 5" }
  ];
  const { getByText } = render(
    <TaskQueueList taskQueues={fakeTaskQueues} loading={false} />
  );
  expect(getByText(/Test Task Queue 1/i)).toBeInTheDocument();
  expect(getByText(/Test Task Queue 2/i)).toBeInTheDocument();
  expect(getByText(/Test Task Queue 3/i)).toBeInTheDocument();
  expect(getByText(/Test Task Queue 4/i)).toBeInTheDocument();
  expect(getByText(/Test Task Queue 5/i)).toBeInTheDocument();
});

test("should render workflow count for all task queues initially", () => {
  const fakeTaskQueues = [
    { tag: "tq10", count: 532, overdue_count: 25, name: "Test Task Queue 1" },
    { tag: "tq11", count: 533, overdue_count: 26, name: "Test Task Queue 2" },
    { tag: "tq12", count: 534, overdue_count: 27, name: "Test Task Queue 3" },
    { tag: "tq13", count: 535, overdue_count: 28, name: "Test Task Queue 4" },
    { tag: "tq14", count: 536, overdue_count: 29, name: "Test Task Queue 5" }
  ];
  const { getByText } = render(
    <TaskQueueList taskQueues={fakeTaskQueues} loading={false} />
  );
  expect(getByText(String(532))).toBeInTheDocument();
  expect(getByText(String(533))).toBeInTheDocument();
  expect(getByText(String(534))).toBeInTheDocument();
  expect(getByText(String(535))).toBeInTheDocument();
  expect(getByText(String(536))).toBeInTheDocument();
});

test("should render overdue count for all task queues initially", () => {
  const fakeTaskQueues = [
    { tag: "tq10", count: 532, overdue_count: 25, name: "Test Task Queue 1" },
    { tag: "tq11", count: 533, overdue_count: 26, name: "Test Task Queue 2" },
    { tag: "tq12", count: 534, overdue_count: 27, name: "Test Task Queue 3" },
    { tag: "tq13", count: 535, overdue_count: 28, name: "Test Task Queue 4" },
    { tag: "tq14", count: 536, overdue_count: 29, name: "Test Task Queue 5" }
  ];
  const { getByText } = render(
    <TaskQueueList taskQueues={fakeTaskQueues} loading={false} />
  );
  expect(getByText(String(25))).toBeInTheDocument();
  expect(getByText(String(26))).toBeInTheDocument();
  expect(getByText(String(27))).toBeInTheDocument();
  expect(getByText(String(28))).toBeInTheDocument();
  expect(getByText(String(29))).toBeInTheDocument();
});

test("should call onSelectTask with task queue when any one task queue is clicked once", () => {
  const fakeTaskQueues = [
    { tag: "tq10", count: 532, overdue_count: 25, name: "Test Task Queue 1" }
  ];
  const onSelectTask = jest.fn();
  const { getByText } = render(
    <TaskQueueList
      taskQueues={fakeTaskQueues}
      loading={false}
      onSelectTask={onSelectTask}
    />
  );
  const taskQueue = getByText(/Test Task Queue 1/i);
  taskQueue.click();
  expect(onSelectTask).toHaveBeenCalledTimes(1);
  expect(onSelectTask).toHaveBeenCalledWith(fakeTaskQueues[0]);
});

test("should call onSelectTask with nothing when an already selected task queue is clicked", () => {
  const fakeTaskQueues = [
    { tag: "tq10", count: 532, overdue_count: 25, name: "Test Task Queue 1" }
  ];
  const onSelectTask = jest.fn();
  const TaskQueueListInstance = render(
    <TaskQueueList
      activeTaskQueue={{
        stepgroupdef: { filterValue: [fakeTaskQueues[0].tag] }
      }}
      taskQueues={fakeTaskQueues}
      loading={false}
      onSelectTask={onSelectTask}
    />
  );
  const taskQueue = TaskQueueListInstance.getByText(/test task queue 1/i);
  taskQueue.click();
  expect(onSelectTask).toHaveBeenLastCalledWith();
});

test("should apply proper styles to the selected task queue", () => {
  const fakeTaskQueues = [
    { tag: "tq10", count: 532, overdue_count: 25, name: "Test Task Queue 1" }
  ];
  const onSelectTask = jest.fn();
  const TaskQueueListInstance = render(
    <TaskQueueList
      activeTaskQueue={{
        stepgroupdef: { filterValue: [fakeTaskQueues[0].tag] }
      }}
      taskQueues={fakeTaskQueues}
      loading={false}
      onSelectTask={onSelectTask}
    />
  );
  const taskQueue = TaskQueueListInstance.getByText(/test task queue 1/i);
  const style = window.getComputedStyle(taskQueue.parentElement);
  expect(style.backgroundColor).not.toBe("none");
});
