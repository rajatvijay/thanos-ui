import React from "react";
import Sidebar from "./Sidebar";

const SidebarView = props => <Sidebar minimalUI={props.minimalUI} {...props} />;

export default SidebarView;
