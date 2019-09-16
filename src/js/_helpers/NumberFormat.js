import numeral from "numeral";

// TODO : This file is only being used in FinancialData.js
// We should reconsider naming this component as it conflicts
// with NumberFormat from 'react-number-format'
export const NumberFormat = props => {
  //For format type reffer to http://numeraljs.com/
  let format = "0,0";

  if (props.format) {
    format = props.format;
  }

  const number = numeral(props.value).format(format);

  return number;
};
