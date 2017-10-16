/* 2017-8-8
 * created by Liam M.
 * */
import React, {Component} from 'react';

// Header component
export default class Footer extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <section className="footer">
                <div className="container">
                    <div className="row">
                        <div className="col-md-4 copyright">
                            <h5>&copy; 2017 MyCryptos.io</h5>
                        </div>
                        <div className="col-md-8 copyright">
                            <h5>
                                <p>Donations are always appreciated!</p>
                                <p>BTC: &nbsp;1NVfRYyt9bSYsL2e5LY3jyJ5HDBhYFKwg3</p>
                                <p>ETH:&nbsp; 0x9382d67A52B1E27a3a20DE4f340E753f1d820e95</p>
                                <p>LTC:&nbsp; LgcB1JiShkXVvvrRCBHvGczT64yi3WdfnS</p>
                            </h5>
                        </div>
                    </div>
                </div>
            </section>
        );
    }
}
