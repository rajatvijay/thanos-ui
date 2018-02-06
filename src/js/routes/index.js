import React from "react";
import { BrowserRouter, Route, Switch, Link } from "react-router-dom";
import Login from "../login";
import LifecycleList from "../lifecycle";


// const Topic = ({ match }) => (
//   <div>
//     <h3>{match.params.topicId}</h3>
//   </div>
// );

// const Topics = ({ match }) => (
//   <div>
//     <h2>Topics</h2>
//     <ul>
//       <li>
//         <Link to={`${match.url}/rendering`}>Rendering with React</Link>
//       </li>
//       <li>
//         <Link to={`${match.url}/components`}>Components</Link>
//       </li>
//       <li>
//         <Link to={`${match.url}/props-v-state`}>Props v. State</Link>
//       </li>
//     </ul>

//     <Route path={`${match.url}/:topicId`} component={Topic} />
//     <Route
//       exact
//       path={match.url}
//       render={() => <h3>Please select a topic.</h3>}
//     />
//   </div>
// );



export default () => (
  <BrowserRouter>
    <Switch>
      <Route path="/" exact={true} component={Login} />
      <Route path="/lifecycles" component={LifecycleList} />
    </Switch>
  </BrowserRouter>
);
