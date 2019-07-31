import {
  GET_PDF_DATA,
  GET_PDF_DATA_SUCCESS,
  GET_PDF_DATA_FAILURE,
  POST_PDF_DATA,
  POST_PDF_DATA_SUCCESS,
  POST_PDF_DATA_FAILURE
} from "./pdfPopupActionTypes";

export const getPdfData = () => async dispatch => {
  dispatch({ type: GET_PDF_DATA });

  try {
    //api stuff

    const res = await new Promise(function(resolve, reject) {
      resolve({
        payload: {
          count: 1,
          next: null,
          previous: null,
          results: [
            {
              config_id: 863,
              parent_workflows: {
                label: "Entity",
                value: "entity",
                steps: [
                  {
                    label: "Screening Results",
                    value: "ln_step"
                  },
                  {
                    label: "Executive Summary",
                    value: "create-car"
                  },
                  {
                    label: "Other Alerts",
                    value: "greylist_step"
                  }
                ]
              },
              child_workflows: [
                {
                  label: "Grey List",
                  value: "grey-list",
                  steps: [
                    {
                      label: "Grey List Information",
                      value: "grey_list_information"
                    }
                  ]
                },
                {
                  label: "RDC Screening",
                  value: "rdc-screening",
                  steps: [
                    {
                      label: "Entity Details",
                      value: "inherited_fields"
                    }
                  ]
                }
              ],
              static_sections: [
                {
                  label: "Cover Page",
                  value: "cover_page"
                },
                {
                  label: "Table Of Contents",
                  value: "table_of_contents"
                }
              ]
            }
          ]
        }
      });
    });

    dispatch({
      type: GET_PDF_DATA_SUCCESS,
      payload: res.payload
    });
  } catch (err) {
    dispatch({
      type: GET_PDF_DATA_FAILURE,
      payload: err
    });
  }
};

export const postPdfData = obj => async dispatch => {
  dispatch({ type: POST_PDF_DATA });

  console.log("postObject", obj);
  try {
    //api stuff

    const res = await new Promise(function(resolve, reject) {
      resolve({
        payload: {
          config_id: 863,
          workflow_id: 28157,
          parent_steps_to_print: ["ln_step", "greylist_step"],
          child_steps_to_print: {
            "grey-list": ["grey_list_information"]
          },
          static_sections: ["cover_page"],
          include_flags: true,
          include_comments: true,
          include_archived_related_workflows: false
        }
      });
    });

    dispatch({
      type: POST_PDF_DATA_SUCCESS,
      payload: res.payload
      // stepId: obj.step
    });
  } catch (err) {
    dispatch({
      type: POST_PDF_DATA_FAILURE,
      payload: err
      // stepId: obj.step
    });
  }
};
