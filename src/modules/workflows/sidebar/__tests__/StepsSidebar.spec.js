import React from "react";
import { render, fireEvent } from "@testing-library/react";
import StepsSidebar from "../components/StepsSidebar";

test("should render all the step group names", () => {
  const fakeStepGroups = [
    {
      id: 1,
      definition: { name_en: "Group 1" },
      steps: []
    },
    {
      id: 2,
      definition: { name_en: "Group 2" },
      steps: []
    }
  ];
  const { queryByText } = render(<StepsSidebar stepGroups={fakeStepGroups} />);
  expect(queryByText(fakeStepGroups[0].definition.name_en)).toBeInTheDocument();
  expect(queryByText(fakeStepGroups[1].definition.name_en)).toBeInTheDocument();
});

test("should render completed step and total step count for every step group", () => {
  const fakeStepGroups = [
    {
      id: 1,
      definition: { name_en: "Group 1" },
      steps: [
        { id: 2, completed_by: "Rajat" },
        { id: 3, completed_by: "Rajat" },
        { id: 4, completed_by: null },
        { id: 5, completed_by: null }
      ]
    },
    {
      id: 10,
      definition: { name_en: "Group 2" },
      steps: [{ id: 20, completed_by: null }]
    }
  ];
  const { queryByText } = render(<StepsSidebar stepGroups={fakeStepGroups} />);

  // 2 completed out of 4
  expect(queryByText(/2\/4/i)).toBeInTheDocument();

  // 0 completed out of 1
  expect(queryByText(/0\/1/i)).toBeInTheDocument();
});

test("should render check circle icon when all the steps are completed", () => {
  const fakeStepGroups = [
    {
      id: 1,
      definition: { name_en: "Group 1" },
      steps: [
        { id: 2, completed_by: "Rajat" },
        { id: 3, completed_by: "Rajat" }
      ]
    }
  ];
  const { queryByText } = render(<StepsSidebar stepGroups={fakeStepGroups} />);

  expect(queryByText(/check_circle/i)).toBeInTheDocument();
});

test("should render alarm icon when step group is overdue and atleast one step is incomplete", () => {
  const fakeStepGroups = [
    {
      id: 1,
      definition: { name_en: "Group 1" },
      steps: [{ id: 2, completed_by: "Rajat" }, { id: 3, completed_by: null }],
      overdue: true
    }
  ];
  const { queryByText } = render(<StepsSidebar stepGroups={fakeStepGroups} />);

  expect(queryByText(/alarm/i)).toBeInTheDocument();
});

test("should render panorama fish eye icon when step group is not overdue and atleast one step is incomplete", () => {
  const fakeStepGroups = [
    {
      id: 1,
      definition: { name_en: "Group 1" },
      steps: [{ id: 2, completed_by: "Rajat" }, { id: 3, completed_by: null }],
      overdue: false
    }
  ];
  const { queryByText } = render(<StepsSidebar stepGroups={fakeStepGroups} />);

  expect(queryByText(/panorama_fish_eye/i)).toBeInTheDocument();
});

test("should call callback with current step group argument when any stepgroup is clicked", () => {
  const fakeStepGroups = [
    {
      id: 1,
      definition: { name_en: "Group 1" },
      steps: [{ id: 2, completed_by: "Rajat" }, { id: 3, completed_by: null }],
      overdue: false
    }
  ];
  const onChangeOfCollapse = jest.fn();
  const { queryByText } = render(
    <StepsSidebar
      stepGroups={fakeStepGroups}
      onChangeOfCollapse={onChangeOfCollapse}
    />
  );

  const stepGroupNode = queryByText(fakeStepGroups[0].definition.name_en);
  fireEvent.click(stepGroupNode);
  expect(onChangeOfCollapse).toHaveBeenCalledTimes(1);
  expect(onChangeOfCollapse).toHaveBeenCalledWith(String(fakeStepGroups[0].id));
});

test("should render all the steps for the active step group", () => {
  const fakeStepGroups = [
    {
      id: 1,
      definition: { name_en: "Group 1" },
      steps: [
        { id: 2, completed_by: "Rajat", name: "Step 1" },
        { id: 3, completed_by: null, name: "Step 2" }
      ],
      overdue: false
    }
  ];
  const { queryByText } = render(
    <StepsSidebar
      stepGroups={fakeStepGroups}
      selectedPanelId={String(fakeStepGroups[0].id)}
    />
  );

  expect(queryByText(fakeStepGroups[0].steps[0].name)).toBeInTheDocument();
  expect(queryByText(fakeStepGroups[0].steps[1].name)).toBeInTheDocument();
});

test("should render check circle icon when the step is completed", () => {
  const fakeStepGroups = [
    {
      id: 1,
      definition: { name_en: "Group 1" },
      steps: [{ id: 2, completed_by: "Rajat", name: "Step 1" }],
      overdue: false
    }
  ];
  const { queryAllByText } = render(
    <StepsSidebar
      stepGroups={fakeStepGroups}
      selectedPanelId={String(fakeStepGroups[0].id)}
    />
  );

  expect(queryAllByText(/check_circle/i).length).toBeGreaterThanOrEqual(1);
});

test("should render alarm icon when the step is overdue and incomplete", () => {
  const fakeStepGroups = [
    {
      id: 1,
      definition: { name_en: "Group 1" },
      steps: [{ id: 2, completed_by: null, name: "Step 1", overdue: true }],
      overdue: false
    }
  ];
  const { queryAllByText } = render(
    <StepsSidebar
      stepGroups={fakeStepGroups}
      selectedPanelId={String(fakeStepGroups[0].id)}
    />
  );

  expect(queryAllByText(/alarm/i).length).toBeGreaterThanOrEqual(1);
});

test("should render lens icon when the step is not overdue, incomplete and selected", () => {
  const fakeStepGroups = [
    {
      id: 1,
      definition: { name_en: "Group 1" },
      steps: [{ id: 2, completed_by: null, name: "Step 1", overdue: false }],
      overdue: false
    }
  ];
  const { queryAllByText } = render(
    <StepsSidebar
      stepGroups={fakeStepGroups}
      selectedPanelId={String(fakeStepGroups[0].id)}
      selectedStep={fakeStepGroups[0].steps[0].id}
    />
  );

  expect(queryAllByText(/lens/i).length).toBeGreaterThanOrEqual(1);
});

test("should render panoram fish icon when the step is not overdue, incomplete and not selected", () => {
  const fakeStepGroups = [
    {
      id: 1,
      definition: { name_en: "Group 1" },
      steps: [{ id: 2, completed_by: null, name: "Step 1", overdue: false }],
      overdue: false
    }
  ];
  const { queryAllByText } = render(
    <StepsSidebar
      stepGroups={fakeStepGroups}
      selectedPanelId={String(fakeStepGroups[0].id)}
      selectedStep={3}
    />
  );

  expect(queryAllByText(/panorama_fish_eye/i).length).toBeGreaterThanOrEqual(1);
});

test("should call the callback with step id and group id when any step is clicked", () => {
  const fakeStepGroups = [
    {
      id: 1,
      definition: { name_en: "Group 1" },
      steps: [{ id: 2, completed_by: null, name: "Step 1", overdue: false }],
      overdue: false
    }
  ];

  const handleStepClick = jest.fn();
  const { queryByText } = render(
    <StepsSidebar
      stepGroups={fakeStepGroups}
      selectedPanelId={String(fakeStepGroups[0].id)}
      handleStepClick={handleStepClick}
    />
  );

  const stepNode = queryByText(fakeStepGroups[0].steps[0].name);
  fireEvent.click(stepNode);

  expect(handleStepClick).toHaveBeenCalledWith(
    fakeStepGroups[0].id,
    fakeStepGroups[0].steps[0].id
  );
});

test("should render the selected step with proper styling", () => {
  const fakeStepGroups = [
    {
      id: 1,
      definition: { name_en: "Group 1" },
      steps: [{ id: 2, completed_by: null, name: "Step 1", overdue: false }],
      overdue: false
    }
  ];

  const { queryByText } = render(
    <StepsSidebar
      stepGroups={fakeStepGroups}
      selectedPanelId={String(fakeStepGroups[0].id)}
      selectedStep={fakeStepGroups[0].steps[0].id}
    />
  );

  const stepNode = queryByText(fakeStepGroups[0].steps[0].name);
  const style = window.getComputedStyle(stepNode.parentElement);
  expect(style.backgroundColor).not.toBe("none");
});

test("should render alerts count on stepgroup when there is atleast one alert", () => {
  const fakeStepGroups = [
    {
      id: 1,
      definition: { name_en: "Group 1" },
      steps: [],
      overdue: false,
      alerts: [
        {
          alert: {
            category: {
              color_label: "#ffffff"
            }
          }
        }
      ]
    }
  ];
  const { queryByTestId } = render(
    <StepsSidebar stepGroups={fakeStepGroups} />
  );
  expect(queryByTestId(/colored-count/i).innerHTML).toBe("1");
});

test("should not render alerts count on stepgroup when there are no alerts", () => {
  const fakeStepGroups = [
    {
      id: 1,
      definition: { name_en: "Group 1" },
      steps: [],
      overdue: false,
      alerts: []
    }
  ];
  const { queryByTestId } = render(
    <StepsSidebar stepGroups={fakeStepGroups} />
  );
  expect(queryByTestId(/colored-count/i)).toBeNull();
});

test("should not render alerts count on stepgroup when when group is selected", () => {
  const fakeStepGroups = [
    {
      id: 1,
      definition: { name_en: "Group 1" },
      steps: [],
      overdue: false,
      alerts: [
        {
          alert: {
            category: {
              color_label: "#ffffff"
            }
          }
        }
      ]
    }
  ];
  const { queryByTestId } = render(
    <StepsSidebar
      stepGroups={fakeStepGroups}
      selectedPanelId={fakeStepGroups[0].id}
    />
  );
  expect(queryByTestId(/colored-count/i)).toBeNull();
});

test("should render alerts count on step when there is atleast one alert", () => {
  const fakeStepGroups = [
    {
      id: 1,
      definition: { name_en: "Group 1" },
      steps: [
        {
          id: 2,
          completed_by: null,
          name: "Step 1",
          alerts: [
            {
              alert: {
                category: {
                  color_label: "#ffffff"
                }
              }
            }
          ]
        }
      ],
      overdue: false
    }
  ];
  const { queryByTestId } = render(
    <StepsSidebar
      stepGroups={fakeStepGroups}
      selectedPanelId={fakeStepGroups[0].id}
    />
  );

  expect(queryByTestId(/colored-count/i).innerHTML).toBe("1");
});

test("should not render alerts count on step when there are no alerts", () => {
  const fakeStepGroups = [
    {
      id: 1,
      definition: { name_en: "Group 1" },
      steps: [
        {
          id: 2,
          completed_by: null,
          name: "Step 1",
          alerts: []
        }
      ],
      overdue: false
    }
  ];
  const { queryByTestId } = render(
    <StepsSidebar
      stepGroups={fakeStepGroups}
      selectedPanelId={fakeStepGroups[0].id}
    />
  );

  expect(queryByTestId(/colored-count/i)).toBeNull();
});

test("should render Locked icon on locked steps", () => {
  const fakeStepGroups = [
    {
      id: 1,
      definition: { name_en: "Group 1" },
      steps: [
        {
          id: 2,
          completed_by: null,
          name: "Step 1",
          alerts: [],
          is_locked: true
        },
        {
          id: 3,
          completed_by: null,
          name: "Step 1",
          alerts: [],
          is_locked: false
        }
      ],
      overdue: false
    }
  ];
  const { queryAllByTestId } = render(
    <StepsSidebar
      stepGroups={fakeStepGroups}
      selectedPanelId={fakeStepGroups[0].id}
    />
  );

  expect(queryAllByTestId(/step-locked-icon/i).length).toBe(1);
});
