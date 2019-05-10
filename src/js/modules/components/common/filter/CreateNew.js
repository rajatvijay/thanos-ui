import React, { Component } from "react";
import { Menu, Dropdown, Icon } from "antd";
import { connect } from "react-redux";
import { workflowKindActions, createWorkflow } from "../../../../actions";



class CreateNew extends Component {

  loadWorkflowKind = () => {
    this.props.dispatch(workflowKindActions.getAll());
  };

  clicked = tag => {
    //dispatch
    let payload = {
      status: 1,
      kind: tag,
      name: "Draft"
    };
    this.props.dispatch(createWorkflow(payload));
  };

  render() {
    //just copy paste the content before return statement and dont know how menu list is creating

   

    const { workflowKind } = this.props.workflowKind;

    let workflowKindFiltered = [];

    // _.map(workflowKind, function(item) {
    //   if (!item.is_related_kind && _.includes(item.features, "add_workflow")) {
    //     workflowKindFiltered.push(item);
    //   }
    // });
    if(workflowKind){
    workflowKind.map(function(item) {
          if (!item.is_related_kind && item.features.includes("add_workflow")) {
            workflowKindFiltered.push(item);
          }
        })
    }

    const menu = (
      <Menu className="kind-menu" theme="Light">
        {workflowKindFiltered.map( function(item, index) {
          //////////---------------HACK---------------////////////
          //Hide users workflow kind from create button. Temporary

          let showitem = false;

          if (item.tag === "users") {
            return;
          } else if (item.tag === "entity-id") {
            return;
          } else {
            return (
              <Menu.Item key={"key-" + index} className="">
                <div
                  onClick={()=>this.clicked(item.tag)}
                  className="kind-item "
                >
                  {item.name}
                </div>
              </Menu.Item>
            );
          }
        })}

        {this.props.workflowKind.error ? (
          <Menu.Item key="1" className="text-primary text-medium">
            <span onClick={this.loadWorkflowKind}>
              <i className="material-icons t-14 pd-right-sm">refresh</i> Reload
            </span>
          </Menu.Item>
        ) : null}

        {this.props.workflowKind.workflowKind && this.props.workflowKind.workflowKind .length<1 ? (
          <Menu.Item key="1" className="text-grey text-medium" disabled>
            <span>
              <i className="material-icons t-14 pd-right-sm">error</i> Empty
            </span>
          </Menu.Item>
        ) : (
          ""
        )}
      </Menu>
    );

    return (
      <div style={{ paddingRight: 36 }}>
        <Dropdown overlay={menu} placement="bottomCenter">
          <p
            style={{
              backgroundColor: "#138BD6",
              borderRadius: "50%",
              height: 40,
              width: 40,
              lineHeight: "40px",
              textAlign: "center",
              fontSize: 24,
              color: "white",
              boxShadow: "1px 5px 8px rgba(0, 0, 0, .12)"
            }}
            className="ant-dropdown-link"
          >
            <Icon type="plus" />
          </p>
        </Dropdown>
      </div>
    );
  }
}

function mapStateToProps(state) {
  const {
    workflowKind,
    workflowFilterType,
    workflowFilters,
    config,
    languageSelector,
    showFilterMenu
  } = state;
  return {
    workflowKind,
    workflowFilterType,
    workflowFilters,
    config,
    languageSelector,
    showFilterMenu
  };
}

export default connect(mapStateToProps)(CreateNew);
