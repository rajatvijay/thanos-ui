import React, { Component } from "react";

const WorkflowItem = ({ onClick, workflow }) => (
  <div onClick={e => onClick(workflow.id)}></div>
);
