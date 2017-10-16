/* 2017-8-8
 * created by Liam M.
 * */
import React, {Component} from 'react';
import {Link} from 'react-router-dom';
import { isLoggedIn } from '../../helpers/Authentication.jsx'
import { isLoggedOut } from '../../helpers/Authentication.jsx'

// Header component
export default class Header extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div className="header">
                <div className="container">
                    <nav className="navbar navbar-default">
                        <div className="container-fluid">
                            <div className="navbar-header">
                                <button type="button" className="navbar-toggle collapsed" data-toggle="collapse" data-target="#navbar1">
                                    <span className="sr-only">Toggle navigation</span>
                                    <span className="icon-bar"></span>
                                    <span className="icon-bar"></span>
                                    <span className="icon-bar"></span>
                                </button>
                                <a href="/" to="/" className="navbar-brand">
                                    <div className="site-logo">
                                        <img src="/img/SmallLogo.png"/>
                                    </div>
                                </a>
                            </div>
                            <div id="navbar1" className="navbar-collapse collapse">
                                <ul className="nav navbar-nav navbar-right">
                                    <li className="active"><a href="/">Home</a></li>
                                    <li className="active"><Link to="/about">About</Link></li>
                                    <li className="active"><Link to="/feedback">Feedback</Link></li>
                                </ul>
                            </div>
                        </div>
                    </nav>
                </div>
            </div>
        );
    }
}
