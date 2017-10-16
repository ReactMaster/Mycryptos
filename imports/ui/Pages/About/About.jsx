/* 2017-8-11
 * created by Liam M.
 * */
import React, {Component} from 'react';

// Header component
export default class About extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div className="container about-page">
                <h2>About</h2>
                <p>I created MyCryptos.io because I did not want to keep logging into my online exchange account to find out how my crypto currencies are doing! I also did not want to install complicated mobile apps that require too much access rights.&nbsp;</p>
                <p>Simply add whatever coins you want to track or hold, and the amount you own (optional), and MyCryptos will tell you the market value of your portfolio.</p>
                <p>Data is coming from coinmarketcap.com (thank you guys!), refreshed every 5 minutes. &nbsp;</p>
                <p>There is no personal information needed to use the tool.&nbsp;</p>
                <p>What you see today is the first version. Tell me what you think! If you like MyCryptos, let everyone know :) &nbsp;&nbsp;</p>
                <p>&nbsp;</p>
                <p><strong>Upcoming New Features:&nbsp;</strong></p>
                <p>Ability to get email notifications based on rules you setup.</p>
                <p>Seeing prices from specific exchanges. </p>

            <br/>
                <p>Do you want to see a specific feature? Let me know!</p>
            </div>
        );
    }
}
