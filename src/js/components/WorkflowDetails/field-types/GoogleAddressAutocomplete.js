import React, { Component } from "react";
import { css } from "emotion";
import Autocomplete from "react-google-autocomplete";
import { fieldActions } from "../../../..//modules/fields/actions";
import loadGoogleMaps from "../../../utils/loadGoogleMaps";
import { Form } from "antd";

import { commonFunctions } from "./commons";

const FormItem = Form.Item;

const { getLabel, field_error } = commonFunctions;

const getAddressDetail = place => {
  let addressData = {};
  place.forEach(detail => {
    detail.types.forEach(type => {
      if (detail.types && detail.types[0] === "country") {
        return (addressData[type] = detail.short_name);
      } else {
        return (addressData[type] = detail.long_name);
      }
    });
  });

  const addressUnitValue = () => {
    const { street_number, route } = addressData;

    return [street_number, route].filter(address => !!address).join(", ");
  };

  const addressStreetValue = () => {
    const {
      sublocality_level_1,
      sublocality_level_2,
      sublocality_level_3
    } = addressData;

    return (
      [sublocality_level_1, sublocality_level_2, sublocality_level_3]
        .filter(address => !!address)
        .join(", ") || []
    );
  };

  const addressCityValue = () => {
    const { locality, neighborhood } = addressData;

    return [locality, neighborhood].filter(address => !!address).join(", ");
  };

  let addressDetail = {
    Address_Unit: addressUnitValue(),
    Address_Street: addressStreetValue(),
    Address_City: addressCityValue(),
    Address_State: addressData.administrative_area_level_1
      ? addressData.administrative_area_level_1
      : "",
    Address_Country: addressData.country ? addressData.country : "",
    Address_PostalCode: addressData.postal_code ? addressData.postal_code : ""
  };

  return addressDetail;
};

class GoogleAddressAutocomplete extends Component {
  scriptLoadedCheckerTimer = null;

  state = {
    scriptLoaded: false
  };

  componentDidMount() {
    loadGoogleMaps();
    this.updateIfScriptLoaded();
    this.scriptLoadedCheckerTimer = setInterval(() => {
      this.updateIfScriptLoaded();
    }, 500);
  }

  updateIfScriptLoaded = () => {
    if (window.google) {
      this.setState({ scriptLoaded: true });
      this.stopCheckingIfScriptLoaded();
    }
  };

  stopCheckingIfScriptLoaded = () => {
    if (this.scriptLoadedCheckerTimer) {
      clearInterval(this.scriptLoadedCheckerTimer);
    }
  };

  render() {
    const defaultAnswer = this.props.field.answers[0]
      ? this.props.field.answers[0].answer
      : this.props.field.definition.defaultValue;

    if (!this.state.scriptLoaded) {
      return null;
    }

    return (
      <FormItem
        label={getLabel(this.props, this)}
        className="from-label"
        style={{ display: "block" }}
        key={this.props.field.id}
        hasFeedback
        {...field_error(this.props)}
      >
        <Autocomplete
          onPlaceSelected={place => {
            this.props.dispatch(
              fieldActions.saveResponse({
                answer: place.formatted_address,
                fieldId: this.props.field.id,
                workflowId: this.props.workflowId,
                extraJSON: getAddressDetail(place.address_components)
              })
            );
          }}
          defaultValue={defaultAnswer}
          types={[]}
          className={css`
            width: 410px;
            border: none;
            border-bottom: 1px solid;
            font-size: 16px;
            font-weight: 500;
            padding-top: 6px;
            padding-bottom: 4px;
          `}
        />
      </FormItem>
    );
  }
}

export default GoogleAddressAutocomplete;
