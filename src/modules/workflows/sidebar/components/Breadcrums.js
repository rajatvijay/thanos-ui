import React from "react";
import { Link } from "react-router-dom";
import { StyledBreadCrumbItem } from "../styledComponents";

const Breadcrums = ({ workflowFamily }) => {
  if (workflowFamily) {
    return workflowFamily.map((family, index) => (
      <React.Fragment key={family.id}>
        <Link to={`/workflows/instances/${family.id}`}>
          <StyledBreadCrumbItem>{family.name}</StyledBreadCrumbItem>
        </Link>
        {index === workflowFamily.length - 1 ? null : (
          <StyledBreadCrumbItem>></StyledBreadCrumbItem>
        )}
      </React.Fragment>
    ));
  }
  return null;
};

export default Breadcrums;
