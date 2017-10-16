/* 2017-8-8
 * created by Liam M.
 * */
import React, {Component} from 'react';
import {Link} from 'react-router-dom';

import Header from '../../ui/Pages/Includes/Header.jsx';
import Footer from '../../ui/Pages/Includes/Footer.jsx';

// Landing Layout component
export default class LandingLayout extends Component {
    constructor(props){
        super(props);
    }

    render() {
        return (
            <div className="app">
                <Header />

                <div className="content">
                    {this.props.children}
                </div>

                <Footer />
            </div>
        );
    }
}