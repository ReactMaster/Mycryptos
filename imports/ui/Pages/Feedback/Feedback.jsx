/* 2017-8-11
 * created by Liam M.
 * */
import React, {Component} from 'react';

// Header component
export default class Feedback extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div className="container feedback-page">
                <iframe title="Feedback Form" className="freshwidget-embedded-form" id="freshwidget-embedded-form" src="https://mycryptos.freshdesk.com/widgets/feedback_widget/new?&widgetType=embedded&screenshot=no&attachFile=no&searchArea=no&captcha=yes" scrolling="no" height="500px" width="100%" frameBorder="0" >
                </iframe>
            </div>
        );
    }
}
