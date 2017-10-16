/* 2017-8-8
 * created by Liam M.
 * */
import React, {Component} from 'react';

// Adimin Layout component
export default class AdminLayout extends Component {
    render() {
        return (
            <div className="app">
                <div className="header">
                    <h1>Admin Layout header</h1>
                </div>
                <div className="content">
                    {this.props.children}
                </div>
                <div>
                    <h1>Admin Layout Footer</h1>
                </div>
            </div>
        );
    }
}