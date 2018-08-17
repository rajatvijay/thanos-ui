import {
  Text,
  Bool,
  Number,
  List,
  Date,
  Checkbox,
  CascaderField,
  Email,
  Phone,
  Paragraph,
  Break,
  Select,
  Divider,
  URL,
  Attachment,
  File
  //Duns
} from "./fields";

import { Duns } from "./duns-search";
import { DnBCommon } from "./dnb-common.js";
import { LexisNexis } from "./ln_field";
import { BusinessUnit } from "./business-unit";
import { Region } from "./region";

export const getFieldType = props => {
  switch (props.field.definition.field_type) {
    //generic fields
    case "text":
      return Text(props);
    case "bool":
      return Bool(props);
    case "integer":
      return Number(props);
    case "attachment":
      return Attachment(props);
    case "word_document":
      return Attachment(props);
    case "file":
      return File(props);
    case "list":
      return List(props);
    case "date":
      return Date(props);
    case "checkbox":
      return Checkbox(props);
    case "email":
      return Email(props);
    case "phone":
      return Phone(props);
    case "paragraph":
      return Paragraph(props);
    case "break":
      return Break(props);
    case "divider":
      return Divider(props);
    case "single_select":
      return Select(props);
    case "multi_select":
      return Select(props);
    case "cascader":
      return CascaderField(props);
    case "url":
      return URL(props);

    //custom
    case "business_unit":
      return BusinessUnit(props);
    case "region":
      return Region(props);

    // Integrations
    case "dnb_duns_search":
      return Duns(props);
    case "dnb_company_profile":
      return DnBCommon(props);
    case "dnb_risk_score":
      return DnBCommon(props);
    case "dnb_data_reader":
      return DnBCommon(props);
    case "ln_search":
      return LexisNexis(props);
    case "salesforce":
      return DnBCommon(props);

    default:
      return Text(props);
  }
};
