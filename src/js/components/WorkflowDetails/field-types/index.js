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
import { UBO } from "./dnb_ubo";
import { Directors } from "./dnb_directors";
import { Livingstone } from "./dnb_livingstone";
import { DunsDirectPlus } from "./duns_direct_plus";
import { DnBCommon } from "./dnb-common.js";
import { LexisNexis } from "./ln_field";
import { BusinessUnit } from "./business-unit";
import { Region } from "./region";
import { GoogleSearch } from "./google-search";

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
    case "dnb_duns_search_direct_plus":
      return DunsDirectPlus(props);
    case "dnb_company_profile":
      return DnBCommon(props);
    case "dnb_risk_score":
      return DnBCommon(props);
    case "dnb_ubo":
      return UBO(props);
    case "dnb_directors":
      return Directors(props);
    case "dnb_livingstone":
      return Livingstone(props);
    case "dnb_data_reader":
      return DnBCommon(props);
    case "iban_search":
      return DnBCommon(props);
    case "eu_vat_check":
      return DnBCommon(props);
    case "ln_search":
      return LexisNexis(props);
    case "salesforce":
      return DnBCommon(props);
    case "google_search":
      return GoogleSearch(props);

    default:
      return Text(props);
  }
};
