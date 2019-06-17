import React from "react";
import Sidebar from "./Sidebar";

const SidebarView = props => (
  <Sidebar act={props.act} minimalUI={props.minimalUI} />
);

export default SidebarView;
