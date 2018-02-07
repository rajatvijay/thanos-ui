import React, { Component } from "react";
import Auxbar from "./auxbar";
import Lifecycles from "./lifecycle-list";
import "../../css/App.css";
//import { BrowserRouter, Route, Switch, Link} from 'react-router-dom';

class List extends Component {
  render() {
    return (
      <div
        className="lifecycle-list-page lifecycle-list-page-container container"
        id="lifecycle-list-page"
      >
        <div className="row">
          <div className="col-lg-3">
            <Auxbar />
          </div>
          <div className="col-lg-9">
            <Lifecycles />
          </div>
        </div>
      </div>
    );
  }
}

// const Topics = ({ match }) => (
//   <div>
//     <h2>Topics</h2>
//     <ul>
//       <li>
//         <Link to={`${match.url}/rendering`}>
//           Rendering with React
//         </Link>
//       </li>
//       <li>
//         <Link to={`${match.url}/components`}>
//           Components
//         </Link>
//       </li>
//       <li>
//         <Link to={`${match.url}/props-v-state`}>
//           Props v. State
//         </Link>
//       </li>
//     </ul>

//     <Route path={`${match.url}/:topicId`} component={Topic}/>
//     <Route exact path={match.url} render={() => (
//       <h3>Please select a topic.</h3>
//     )}/>
//   </div>
// )

export default () => <List />;
