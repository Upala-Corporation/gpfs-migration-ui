import React, {Component} from 'react';
import { attachModelToView } from 'rhelena';
import HomeModel from './HomeModel'
import {
    BrowserRouter as Router,
    Switch,
    Route,
    Redirect,
    useLocation
  } from "react-router-dom";

import Login from './Login';
import App from './App';
import Code from './Code';

function PrivateRoute ({component: Component, authed, ...rest}) {
    return (
      <Route
        {...rest}
        render={(props) => {
            const query = new URLSearchParams(window.location.search)
            if (query.get("code")){
                return (<Redirect to={{pathname: `/code`, search: `?code=${query.get("code")}`, state: {from: props.location}}} />);
            }else{  
                return authed ? <Component {...props} /> : <Redirect to={{pathname: '/login', state: {from: props.location}}} />}
            }
        }
      />
    )
}

export default class Home extends Component {

    componentWillMount(){
        attachModelToView(new HomeModel(this.props), this);
    }

    render(){
        const token = localStorage.getItem("migrationPortal/token");
        return (<Router>
            <Switch>
                <Route path="/login" component={Login}/>
                <Route path="/code" component={Code} />
                <PrivateRoute authed={token} exact path="/" component={App} />
            </Switch>
        </Router>);
    }
}