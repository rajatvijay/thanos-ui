import React from "react";
import { renderWithReactIntl } from "../../../common/utils/testUtils";
import AdvancedFilter from "../components/AdvancedFilter";
import { fireEvent } from "@testing-library/react";

test("should render all the operators", () => {
  const { queryByText } = renderWithReactIntl(<AdvancedFilter />);
  const operatorDropdownNode = queryByText(/operator/i);

  fireEvent.click(operatorDropdownNode);

  expect(queryByText(/^equal$/i)).toBeInTheDocument();
  expect(queryByText(/not equal/i)).toBeInTheDocument();
  expect(queryByText(/has value/i)).toBeInTheDocument();
  expect(queryByText(/contains/i)).toBeInTheDocument();
  expect(queryByText(/does not contain/i)).toBeInTheDocument();
});

test("should the callback with proper arguments when all fields are filled", () => {
  const fakeFields = [
    {
      value: "Fake L1",
      label: "Fake L1",
      children: [
        {
          value: "Fake L2",
          label: "Fake L2",
          children: [
            {
              value: "Fake L3",
              label: "Fake L3",
              children: [{ value: "Fake L4", label: "Fake L4" }]
            }
          ]
        }
      ]
    }
  ];
  const onApply = jest.fn();

  const { queryByText, queryByPlaceholderText } = renderWithReactIntl(
    <AdvancedFilter options={fakeFields} onApply={onApply} />
  );

  // Selecting field
  fireEvent.click(queryByPlaceholderText(/field/i));
  fireEvent.click(queryByText(fakeFields[0].label));
  fireEvent.click(queryByText(fakeFields[0].children[0].label));
  fireEvent.click(queryByText(fakeFields[0].children[0].children[0].label));
  fireEvent.click(
    queryByText(fakeFields[0].children[0].children[0].children[0].label)
  );

  // Selecting operator
  fireEvent.click(queryByText(/operator/i));
  fireEvent.click(queryByText(/not equal/i));

  // Entering value
  const inputNode = queryByPlaceholderText(/input value/i);
  fireEvent.blur(inputNode, { target: { value: "asdf" } });

  expect(onApply).toHaveBeenCalledTimes(1);
  expect(onApply).toHaveBeenCalledWith({
    field: ["Fake L1", "Fake L2", "Fake L3", "Fake L4"],
    operator: "not_eq",
    text: "asdf"
  });
});
