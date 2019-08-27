import React from "react";
import { render, fireEvent } from "@testing-library/react";
import FieldAlerts from "../FieldAlerts";

test("should render the name of alert", () => {
  const fakeAlerts = [
    {
      alert: {
        id: 1,
        category: {
          category_label: "#ffffff"
        },
        tag: "Fake Alert"
      }
    }
  ];
  const { queryByText } = render(<FieldAlerts alerts={fakeAlerts} />);
  expect(queryByText(fakeAlerts[0].alert.tag)).toBeInTheDocument();
});

test("should render the color of alert as background color", () => {
  const fakeAlerts = [
    {
      alert: {
        id: 1,
        category: {
          color_label: "#ffffff"
        },
        tag: "Fake Alert"
      }
    }
  ];
  const { queryByText } = render(<FieldAlerts alerts={fakeAlerts} />);
  const alertNode = queryByText(fakeAlerts[0].alert.tag);
  const style = window.getComputedStyle(alertNode);
  expect(style.backgroundColor).toBe("rgb(255, 255, 255)");
});

test("should render all alerts if there are less than 3 alerts", () => {
  const fakeAlerts = [
    {
      alert: {
        id: 1,
        category: {
          category_label: "#ffffff"
        },
        tag: "Fake Alert 1"
      }
    },
    {
      alert: {
        id: 1,
        category: {
          category_label: "#000000"
        },
        tag: "Fake Alert 2"
      }
    }
  ];
  const { queryByText } = render(<FieldAlerts alerts={fakeAlerts} />);
  expect(queryByText(fakeAlerts[0].alert.tag)).toBeInTheDocument();
  expect(queryByText(fakeAlerts[1].alert.tag)).toBeInTheDocument();
});

test("should render only 3 alerts if there are more than 3 alerts", () => {
  const fakeAlerts = [
    {
      alert: {
        id: 1,
        category: {
          category_label: "#ffffff"
        },
        tag: "Fake Alert 1"
      }
    },
    {
      alert: {
        id: 1,
        category: {
          category_label: "#000000"
        },
        tag: "Fake Alert 2"
      }
    },
    {
      alert: {
        id: 1,
        category: {
          category_label: "#000000"
        },
        tag: "Fake Alert 3"
      }
    },
    {
      alert: {
        id: 1,
        category: {
          category_label: "#000000"
        },
        tag: "Fake Alert 4"
      }
    }
  ];
  const { queryByText } = render(<FieldAlerts alerts={fakeAlerts} />);
  expect(queryByText(fakeAlerts[0].alert.tag)).toBeInTheDocument();
  expect(queryByText(fakeAlerts[1].alert.tag)).toBeInTheDocument();
  expect(queryByText(fakeAlerts[2].alert.tag)).toBeInTheDocument();
  expect(queryByText(fakeAlerts[3].alert.tag)).toBeNull();
});

test("should render plus icon if there are more than 3 alerts", () => {
  const fakeAlerts = [
    {
      alert: {
        id: 1,
        category: {
          category_label: "#ffffff"
        },
        tag: "Fake Alert 1"
      }
    },
    {
      alert: {
        id: 1,
        category: {
          category_label: "#000000"
        },
        tag: "Fake Alert 2"
      }
    },
    {
      alert: {
        id: 1,
        category: {
          category_label: "#000000"
        },
        tag: "Fake Alert 3"
      }
    },
    {
      alert: {
        id: 1,
        category: {
          category_label: "#000000"
        },
        tag: "Fake Alert 4"
      }
    }
  ];
  const { queryByTestId } = render(<FieldAlerts alerts={fakeAlerts} />);
  expect(queryByTestId(/plus-icon/i)).toBeInTheDocument();
});

test("should render all alerts when plus icon is clicked if there are more than 3 alerts", () => {
  const fakeAlerts = [
    {
      alert: {
        id: 1,
        category: {
          category_label: "#ffffff"
        },
        tag: "Fake Alert 1"
      }
    },
    {
      alert: {
        id: 1,
        category: {
          category_label: "#000000"
        },
        tag: "Fake Alert 2"
      }
    },
    {
      alert: {
        id: 1,
        category: {
          category_label: "#000000"
        },
        tag: "Fake Alert 3"
      }
    },
    {
      alert: {
        id: 1,
        category: {
          category_label: "#000000"
        },
        tag: "Fake Alert 4"
      }
    }
  ];
  const { queryByTestId, queryAllByText } = render(
    <FieldAlerts alerts={fakeAlerts} />
  );

  const plusIcon = queryByTestId(/plus-icon/i);
  fireEvent.click(plusIcon);

  expect(queryAllByText(fakeAlerts[0].alert.tag).length).toBeGreaterThanOrEqual(
    1
  );
  expect(queryAllByText(fakeAlerts[1].alert.tag).length).toBeGreaterThanOrEqual(
    1
  );
  expect(queryAllByText(fakeAlerts[2].alert.tag).length).toBeGreaterThanOrEqual(
    1
  );
  expect(queryAllByText(fakeAlerts[3].alert.tag).length).toBeGreaterThanOrEqual(
    1
  );
});
