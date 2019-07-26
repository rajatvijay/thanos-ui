import numeral from "numeral";

export const NumberFormat = props => {
  //For format type reffer to http://numeraljs.com/
  let format = "0,0";

  if (props.format) {
    format = props.format;
  }

  const number = numeral(props.value).format(format);

  return number;
};
