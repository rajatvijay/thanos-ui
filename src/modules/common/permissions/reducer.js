import { permissionConstants } from "./constants";

const initialState = { loading: false, permissions: {}, error: null };

export function permissions(state = initialState, action) {
  switch (action.type) {
    case permissionConstants.PERMISSION_FETCH_REQUEST:
      return {
        loading: true,
        permissions: null
      };
    case permissionConstants.PERMISSION_FETCH_SUCCESS:
      return {
        loading: false,
        permissions: { ...action.permission.objects },
        error: null
      };
    case permissionConstants.PERMISSION_FETCH_FAILURE:
      return {
        loading: false,
        permissions: null,
        error: action.error
      };
    default:
      return state;
  }
}
