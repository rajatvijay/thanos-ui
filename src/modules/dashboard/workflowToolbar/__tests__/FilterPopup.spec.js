import React from "react";
import FilterPopup from "../components/FilterPopup";
import { renderWithRedux } from "../../../common/utils/testUtils";
import { fireEvent } from "@testing-library/react";
import { FetchMock, fetchMock } from "@react-mock/fetch";
import {
  REGION_FILTER_NAME,
  STATUS_FILTER_NAME,
  BUSINESS_UNIT_FILTER_NAME,
  FIELD_ANSWER_PARAM
} from "../../constants";

test("should render status filter dropdown with options filtered with kind", () => {
  const fakeStatuses = [
    { id: 1, label: "Fake Status 1" },
    { id: 2, label: "Fake Status 2" }
  ];
  const { queryByText } = renderWithRedux(<FilterPopup />, {
    initialState: {
      workflowList: {
        staticData: {
          statuses: { data: fakeStatuses }
        },
        selectedWorkflowFilters: {
          kind: {
            available_statuses: [1]
          }
        }
      }
    }
  });
  const statusDropdownNode = queryByText(/status/i);
  fireEvent.click(statusDropdownNode);

  expect(queryByText(fakeStatuses[0].label)).toBeInTheDocument();
  expect(queryByText(fakeStatuses[1].label)).toBeNull();
});

test("should apply the workflow filter when selecting a status", () => {
  const fakeStatuses = [{ id: 1, label: "Fake Status 1" }];
  const API_URL = "path:/api/v1/workflows-list/";
  const { queryByText } = renderWithRedux(
    <FetchMock mocks={[{ matcher: API_URL, method: "GET", response: 200 }]}>
      <FilterPopup />
    </FetchMock>,
    {
      initialState: {
        workflowList: {
          staticData: {
            statuses: { data: fakeStatuses }
          },
          selectedWorkflowFilters: {
            kind: {
              available_statuses: [fakeStatuses[0].id]
            }
          }
        }
      }
    }
  );
  const statusDropdownNode = queryByText(/status/i);
  fireEvent.click(statusDropdownNode);

  const statusNode = queryByText(fakeStatuses[0].label);
  fireEvent.click(statusNode);

  const [url] = fetchMock.lastCall(API_URL, "GET");
  const orderingParam = new URL(url).searchParams.get(STATUS_FILTER_NAME);
  expect(Number(orderingParam)).toEqual(fakeStatuses[0].id);
});

test("should render region filter dropdown with all options", () => {
  const fakeRegions = [
    { label: "Fake Region 1", value: "Fake Region 1" },
    { label: "Fake Region 2", value: "Fake Region 2" }
  ];
  const { queryByText } = renderWithRedux(<FilterPopup />, {
    initialState: {
      workflowList: {
        staticData: {
          regions: { data: fakeRegions }
        }
      }
    }
  });
  const regionDropdownNode = queryByText(/region/i);
  fireEvent.click(regionDropdownNode);

  expect(queryByText(fakeRegions[0].label)).toBeInTheDocument();
  expect(queryByText(fakeRegions[1].label)).toBeInTheDocument();
});

test("should render business unit filter dropdown with all options", () => {
  const fakeBusinessUnit = [
    { label: "Fake Business Unit 1", value: "Fake Business Unit 1" },
    { label: "Fake Business Unit 2", value: "Fake Business Unit 2" }
  ];
  const { queryByText } = renderWithRedux(<FilterPopup />, {
    initialState: {
      workflowList: {
        staticData: {
          businessUnits: { data: fakeBusinessUnit }
        }
      }
    }
  });
  const businessUnitDropdownNode = queryByText(/business/i);
  fireEvent.click(businessUnitDropdownNode);

  expect(queryByText(fakeBusinessUnit[0].label)).toBeInTheDocument();
  expect(queryByText(fakeBusinessUnit[1].label)).toBeInTheDocument();
});

test("should trigger business and workflow list filter API call when regions is selected", () => {
  const fakeRegions = [{ label: "Fake Region 1", value: "Fake Region 1" }];
  const WORKFLOW_LIST_API_URL = "path:/api/v1/workflows-list/";
  const BUSINESS_UNIT_API_URL = "path:/api/v1/business-unit/extra-data/";
  const { queryByText } = renderWithRedux(
    <FetchMock
      mocks={[
        { matcher: WORKFLOW_LIST_API_URL, method: "GET", response: 200 },
        { matcher: BUSINESS_UNIT_API_URL, method: "GET", response: 200 }
      ]}
    >
      <FilterPopup />
    </FetchMock>,
    {
      initialState: {
        workflowList: {
          staticData: {
            regions: { data: fakeRegions }
          }
        }
      }
    }
  );
  const regionDropdownNode = queryByText(/region/i);
  fireEvent.click(regionDropdownNode);

  // Selecting the region node
  const regionNode = queryByText(fakeRegions[0].label);
  fireEvent.click(regionNode);

  {
    const [url] = fetchMock.lastCall(WORKFLOW_LIST_API_URL, "GET");
    const regionFilterParam = new URL(url).searchParams.get(REGION_FILTER_NAME);
    expect(regionFilterParam).toEqual(fakeRegions[0].value);
  }
  {
    const [url] = fetchMock.lastCall(BUSINESS_UNIT_API_URL, "GET");
    const regionFilterParam = new URL(url).searchParams.get("regions__code");
    expect(regionFilterParam).toEqual(fakeRegions[0].value);
  }
});

test("should workflow list filter API call when business unit is selected", () => {
  const fakeBusinessUnits = [{ label: "Fake Unit 1", value: "Fake Unit 1" }];
  const API_URL = "path:/api/v1/workflows-list/";
  const { queryByText } = renderWithRedux(
    <FetchMock mocks={[{ matcher: API_URL, method: "GET", response: 200 }]}>
      <FilterPopup />
    </FetchMock>,
    {
      initialState: {
        workflowList: {
          staticData: {
            businessUnits: { data: fakeBusinessUnits }
          }
        }
      }
    }
  );
  const businessDropdownNode = queryByText(/business/i);
  fireEvent.click(businessDropdownNode);

  // Selecting the region node
  const businessNode = queryByText(fakeBusinessUnits[0].label);
  fireEvent.click(businessNode);

  const [url] = fetchMock.lastCall(API_URL, "GET");
  const businessFilterParam = new URL(url).searchParams.get(
    BUSINESS_UNIT_FILTER_NAME
  );
  expect(businessFilterParam).toEqual(fakeBusinessUnits[0].value);
});

test("should render region placeholder from config when provided", () => {
  const fakePlaceholderFromConfig = "Fake placeholder from config";
  const { queryByText } = renderWithRedux(<FilterPopup />, {
    initialState: {
      config: {
        custom_ui_labels: {
          filterPlaceholders: {
            Region: fakePlaceholderFromConfig
          }
        }
      }
    }
  });
  expect(queryByText(/region/i)).toBeNull();
  expect(queryByText(fakePlaceholderFromConfig)).toBeInTheDocument();
});

test("should render business placeholder from config when provided", () => {
  const fakePlaceholderFromConfig = "Fake placeholder from config";
  const { queryByText } = renderWithRedux(<FilterPopup />, {
    initialState: {
      config: {
        custom_ui_labels: {
          filterPlaceholders: {
            Business: fakePlaceholderFromConfig
          }
        }
      }
    }
  });
  expect(queryByText(/business/i)).toBeNull();
  expect(queryByText(fakePlaceholderFromConfig)).toBeInTheDocument();
});

test("should call the api without status, region and business filter when clear all is clicked", () => {
  const fakeStatuses = [{ id: 1, label: "Fake Status 1" }];
  const fakeRegions = [{ label: "Fake Region 1", value: "Fake Region 1" }];
  const fakeBusinessUnits = [{ label: "Fake Unit 1", value: "Fake Unit 1" }];
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
  const API_URL = "path:/api/v1/workflows-list/";
  const { queryByText, queryByPlaceholderText } = renderWithRedux(
    <FetchMock mocks={[{ matcher: API_URL, method: "GET", response: 200 }]}>
      <FilterPopup />
    </FetchMock>,
    {
      initialState: {
        workflowList: {
          staticData: {
            statuses: { data: fakeStatuses },
            regions: { data: fakeRegions },
            businessUnits: { data: fakeBusinessUnits },
            advancedFilterData: {
              data: fakeFields
            }
          },
          selectedWorkflowFilters: {
            kind: {
              available_statuses: [1]
            }
          }
        }
      }
    }
  );

  // Open status dropdown
  const statusDropdownNode = queryByText(/status/i);
  fireEvent.click(statusDropdownNode);

  // select a status
  const statusNode = queryByText(fakeStatuses[0].label);
  fireEvent.click(statusNode);

  // Open region dropdown
  const regionDropdownNode = queryByText(/region/i);
  fireEvent.click(regionDropdownNode);

  // Selecting a region
  const regionNode = queryByText(fakeRegions[0].label);
  fireEvent.click(regionNode);

  // Open business dropdown
  const businessDropdownNode = queryByText(/business/i);
  fireEvent.click(businessDropdownNode);

  // Selecting a business
  const businessNode = queryByText(fakeBusinessUnits[0].label);
  fireEvent.click(businessNode);

  // Selecting advanced filter
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

  // Clicking on apply
  fireEvent.click(queryByText(/apply/i));

  // clicking clear all
  const clearButton = queryByText(/clear all/i);
  fireEvent.click(clearButton);

  const [url] = fetchMock.lastCall(API_URL, "GET");
  const businessFilterParam = new URL(url).searchParams.get(
    BUSINESS_UNIT_FILTER_NAME
  );
  const regionFilterParam = new URL(url).searchParams.get(REGION_FILTER_NAME);
  const statusFilterParam = new URL(url).searchParams.get(STATUS_FILTER_NAME);
  const advancedFilterParam = new URL(url).searchParams.get(FIELD_ANSWER_PARAM);

  expect(businessFilterParam).toBeNull();
  expect(regionFilterParam).toBeNull();
  expect(statusFilterParam).toBeNull();
  expect(advancedFilterParam).toBeNull();
});

test("should call the callback when cancel button is clicked", () => {
  const onClose = jest.fn();
  const { queryByText } = renderWithRedux(<FilterPopup onClose={onClose} />);

  const cancelButton = queryByText(/close/i);
  fireEvent.click(cancelButton);

  expect(onClose).toHaveBeenCalledTimes(1);
});

test("should call the workflow filter api when apply is clicked with selected advanced filters", () => {
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
  const API_URL = "path:/api/v1/workflows-list/";
  const { queryByText, queryByPlaceholderText } = renderWithRedux(
    <FetchMock mocks={[{ matcher: API_URL, method: "GET", response: 200 }]}>
      <FilterPopup />
    </FetchMock>,
    {
      initialState: {
        workflowList: {
          staticData: {
            advancedFilterData: {
              data: fakeFields
            }
          }
        }
      }
    }
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

  fireEvent.click(queryByText(/apply/i));

  const [url] = fetchMock.lastCall(API_URL, "GET");
  const advancedFilterParam = new URL(url).searchParams.get(FIELD_ANSWER_PARAM);
  expect(advancedFilterParam).toBe(
    `${decodeURIComponent("Fake L4")}__not_eq__asdf`
  );
});
