/* 2017-8-8
 * created by Liam M.
 * */
import React from 'react';
import {BrowserRouter, Route} from 'react-router-dom';
import {Router, Switch} from 'react-router';
import { createBrowserHistory } from 'history';

import LandingLayout from './layouts/LandingLayout.jsx';
import Home from '../ui/Pages/Home/Home.jsx';
import About from '../ui/Pages/About/About.jsx';
import Feedback from '../ui/Pages/Feedback/Feedback.jsx';

const customHistory = createBrowserHistory();
export const renderRoutes = () => (
    <Router history={customHistory}>
        <div>
            <Switch>
                <Route exact path="/" render={() => <LandingLayout><Home /></LandingLayout>}/>
            </Switch>
            <Switch>
                <Route exact path="/about" render={() => <LandingLayout><About /></LandingLayout>}/>
            </Switch>
            <Switch>
                <Route exact path="/feedback" render={() => <LandingLayout><Feedback /></LandingLayout>}/>
            </Switch>
        </div>
    </Router>
);