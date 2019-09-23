import React from "react";
import { renderWithReactIntl } from "../../../common/utils/testUtils";
import MyTaskFilter from "../components/MyTaskFilter";
import { FetchMock, fetchMock } from "@react-mock/fetch";
import { waitForElement, fireEvent } from "@testing-library/react";

test("should render my task heading", () => {
  const { queryByText } = renderWithReactIntl(<MyTaskFilter />);
  expect(queryByText(/my task/i)).toBeInTheDocument();
});

test("should render the image", () => {
  const { queryByText } = renderWithReactIntl(<MyTaskFilter />);
  expect(queryByText(/person/i)).toBeInTheDocument();
});

test("should call the count api and render the count from it", async () => {
  const API_URL = "path:/api/v1/get-my-tagged-incomplete-steps/";
  const { queryByText } = renderWithReactIntl(
    <FetchMock
      mocks={[{ matcher: API_URL, method: "GET", response: { Assignee: 2 } }]}
    >
      <MyTaskFilter />
    </FetchMock>
  );

  await waitForElement(() => fetchMock.called(API_URL, "GET"));

  const taskCountElement = await waitForElement(() => queryByText(/2/i));
  expect(taskCountElement).toBeInTheDocument();
});

test("should call the onClick callback when clicked on it", () => {
  const onClick = jest.fn();
  const { queryByText } = renderWithReactIntl(
    <MyTaskFilter onClick={onClick} />
  );
  fireEvent.click(queryByText(/my task/i));

  expect(onClick).toHaveBeenCalledTimes(1);
});

test("should not render anything when api fails", async () => {
  const API_URL = "path:/api/v1/get-my-tagged-incomplete-steps/";
  const { queryByTestId } = renderWithReactIntl(
    <FetchMock mocks={[{ matcher: API_URL, method: "GET", response: 500 }]}>
      <MyTaskFilter />
    </FetchMock>
  );

  await waitForElement(() => fetchMock.called(API_URL, "GET"));

  const taskCountElement = await waitForElement(() =>
    queryByTestId(/my-task-count-error/i)
  );
  expect(taskCountElement).toBeInTheDocument();
});
