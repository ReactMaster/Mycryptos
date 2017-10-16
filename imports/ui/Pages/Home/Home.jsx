/* 2017-8-8
 * created by Liam M.
 * */
import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import Pagination from '../../Components/Pagination/Pagination.jsx';
import {Typeahead} from 'react-bootstrap-typeahead';
import SYMBOL_CONFIG from '../../helpers/SymbolLists.jsx';
import CURRENCY_CONFIG from '../../helpers/CurrencyLists.jsx';

import { detectMobile } from '../../helpers/Authentication.jsx'

import axios from 'axios';
import request from 'request';

// App component - represents the whole app
export default class Home extends Component {
    constructor(props) {
        super(props);

        this.state = {
            coinMarketData: [], //All coin market data
            coinDataOption: [], //Dropdown optiosn data
            myCoinsData: [],  //Coins you added
            currencyData: [], //Currency Data
            selectedCoin: '', //Current Coin number that user seletec
            pageOfItems: [],  //Data per pages
            currentPage: 1,  //Current page number
            inputEnable: [],
            totalAmount: 0,
            currency: 'USD', //Current currency code
            currencyValue: [], //Current currency conversion rate
            currencyRate: 1.0, //Current currency conversion rate
            currentSymbol: '$', //Current currency symbol
            isCurrency: false, //Current status for currency box
            isDropup: false,  //Status if dropdown up or down
            updatedAt: '', //Updated Date that api called
        };

        this.onChangePage = this.onChangePage.bind(this);
        this.changeHolding = this.changeHolding.bind(this);
        this.enableInputEditing = this.enableInputEditing.bind(this);
        this.clearInputEditing = this.clearInputEditing.bind(this);
        this.removeCoinData = this.removeCoinData.bind(this);
        this.findCoins = this.findCoins.bind(this);
        this.addCoin = this.addCoin.bind(this);
        this.changeCurrency = this.changeCurrency.bind(this);
        this.handleKeyPress = this.handleKeyPress.bind(this);
        this.showCurrencyBox = this.showCurrencyBox.bind(this);
        this.closeCurrencyBox = this.closeCurrencyBox.bind(this);
    }

    componentDidMount() {
        document.addEventListener('mousedown', this.clearInputEditing);
        //Get saved coin datas from localStorage
        let savedCoinDatas = JSON.parse(window.localStorage.getItem("saved_coins_list"));
        if(savedCoinDatas == null)
            savedCoinDatas = [];

        let currencyData = {}

        //Get currency from localStorage
        this.changeCurrency(currencyData.length = 0);

        Meteor.call('loadMarketData', savedCoinDatas, function(err, res) {
            if(err) {
                console.log(err);
            }else {
                this.setState({coinMarketData: res.coinData});
                console.log(res);
                //Get current updated Date
                let date = res.coinData[0].createdDate;
                let hour =date.getUTCHours();
                let meridian = 'AM';
                if(hour > 12) {
                    hour = hour -12;
                    meridian = 'PM';
                }
                date =  ("00" + (date.getUTCMonth() + 1)).slice(-2) + "/" +
                        ("00" + date.getUTCDate()).slice(-2) + "/" +
                        date.getUTCFullYear() + " " +
                        hour + ":" +
                        ("00" + date.getUTCMinutes()).slice(-2) + ' ' + meridian;
                //Set Date
                this.setState({updatedAt: date});
                //Set Saved Date
                this.setState({myCoinsData: res.savedData});
                this.calculateTotalAmount();
            }
        }.bind(this));

        /*Get Currency Data from api*/
        axios.get('https://apilayer.net/api/live?access_key=db4e6910d65bbb42434eb0b294360e6d')
            .then(res => {
                let data = res.data.quotes;
                let currencyData = [];

                Object.keys(data).forEach(key => {
                    let option = {};
                    let code = key.substring(3);
                    option.value = code + String(data[key]);
                    option.label = code + '-' +String(CURRENCY_CONFIG[code]);
                    currencyData.push(option);
                });

                this.setState({currencyData: currencyData})
            });

        /*var options = {
            "method": 'GET',
            "url": 'https://apilayer.net/api/live?access_key=db4e6910d65bbb42434eb0b294360e6d',
            "headers": {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Credentials': true,
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET,PUT,POST,DELETE,OPTIONS'
            }
        };

        request(options, (function(err, res, body) {
            if (err) throw new Error(err);

            let data = res.data.quotes;
            let currencyData = [];

            Object.keys(data).forEach(key => {
                let option = {};
                let code = key.substring(3);
                option.value = code + String(data[key]);
                option.label = code + '-' +String(CURRENCY_CONFIG[code]);
                currencyData.push(option);
            });

            this.setState({currencyData: currencyData})
        }));*/
    }

    onChangePage(pageOfItems, currentPage) {
        if(pageOfItems.length > 8) {
            this.setState({isDropup: true});
        }else {
            this.setState({isDropup: false});
        }
        this.setState({ pageOfItems: pageOfItems });
        this.setState({ currentPage: currentPage});
    }

    //Change Event of Input Holding
    changeHolding(e, index) {
        let holdingVal = e.target.value;
        let holdString = holdingVal.toString().split('.')[1];

        /*Check if it's number*/
        if(!isNaN(holdingVal) && (holdString == undefined || holdString.length <= 8)) {
            /*Save holding val to state*/
            let thistate = this.state;
            thistate.myCoinsData[index -1].holding = holdingVal;
            this.setState(thistate);
            /*Calculate when not string*/
            this.calculateTotalAmount();

            window.localStorage.setItem("saved_coins_list", JSON.stringify(thistate.myCoinsData));
        }
    }

    //Show Input of Holding
    enableInputEditing(index) {
        let _this = this;
        let thistate = this.state;

        /*Reset Holding Input Box status*/
        if(thistate.inputEnable[index]) {
            thistate.inputEnable = [];
        }else {
            thistate.inputEnable = [];
            thistate.inputEnable[index] = true;
            setTimeout(function() {
                ReactDOM.findDOMNode(_this.refs.holdingInput).focus();
                ReactDOM.findDOMNode(_this.refs.holdingInput).select()
            }, 250);
        }

        this.setState(thistate);
    }

    clearInputEditing(evt) {
        if("fa fa-pencil-square-o" !== evt.target.className){
            this.setState({inputEnable: []});
        }

        if(document.getElementsByClassName('dropdown-item').length > 0) {
            evt.preventDefault();
        }
    }

    onblur(e) {
        console.log('blur');
    }

    //Remove one field from coinMarketData
    removeCoinData(index) {
        var array = this.state.myCoinsData;
        array.splice(index -1, 1);
        this.setState({myCoinsData: array});
        this.refs.pagination.setPage(this.state.currentPage);
        this.calculateTotalAmount();

        //Remove Coin from cookie
        window.localStorage.setItem("saved_coins_list", JSON.stringify(array));
    }

    //Calculate Total Amount
    calculateTotalAmount() {
        let totalVal = 0;
        this.state.myCoinsData.map((item) => {
            let mkt_value = 0;
            if('holding' in item) {
                if(this.state.currency === 'BTC') {
                    mkt_value = item.holding * item.price_btc;
                }else {
                    mkt_value = item.holding * item.price_usd * this.state.currencyRate;
                }
            }
            totalVal =totalVal + mkt_value;
        });

        this.setState({totalAmount: totalVal.toFixed(8)});
    }

    //DropDown change event to get the coin
    findCoins(e) {
        if(e.length > 0) {
            this.setState({selectedCoin: e[0]}, function() {
                this.addCoin();
            });
        }
    }

    //Add coin when user clicked Add Button
    addCoin() {
        this.coinTypeahead.getInstance().clear()
        let coinDatas = this.state.myCoinsData;
        let selectedCoin = this.state.selectedCoin;
        let isExist = false;

        //Check if Same coin exists in the myCoinsData
        coinDatas.map((item) => {
            if(item.id === selectedCoin.id) {
                isExist = true
            }
        });

        if(coinDatas.length === 0 || isExist === false) {
            coinDatas.push(selectedCoin);
            this.setState({myCoinsData: coinDatas}, function(){
                this.refs.pagination.setPage(this.state.currentPage);
            });
            //Save to localStorage
            window.localStorage.setItem("saved_coins_list", JSON.stringify(coinDatas));
        }
    }

    //Convert Currency
    convertCurrency(data) {
        this.setState({currencyValue: data});
        let curencyRate = data[0].value.substring(3);
        let currency = data[0].value.slice(0, 3);

        if(currency == 'BTC') {
            this.setState({currentSymbol: 'BTC'});
            this.setState({currency: 'BTC'}, function () {
                this.calculateTotalAmount();
            });
        }else {
            this.setState({currentSymbol: SYMBOL_CONFIG[currency]});
            this.setState({currencyRate: parseFloat(curencyRate)});
            this.setState({currency: currency}, function () {
                this.calculateTotalAmount();
            });
        }
    }

    //Change Currency Event
    changeCurrency(e) {
        if(e.length > 0) {
            window.localStorage.setItem("saved_currency", JSON.stringify(e));
            this.setState({isCurrency: false});
            this.convertCurrency(e);
        }else {
            let data = JSON.parse(window.localStorage.getItem("saved_currency"));
            if(data) {
                let option = [];
                Object.keys(data).forEach(key => {
                    option.push(data[key]);
                });
                this.convertCurrency(option);
            }
        }
    }

    //Hide Currency Box
    closeCurrencyBox() {
        this.setState({isCurrency: false});
    }

    //Handle Key press to get Enter key of input
    handleKeyPress(e) {
        if(e.key === 'Enter') {
            this.setState({inputEnable: []});
        }
    }

    //Visible currency box
    showCurrencyBox() {
        let _this = this;
        this.setState({isCurrency: true});
        //setTimeout(function(){_this.currencyTypeahead.getInstance().clear()}, 500);
    }

    renderMenuItem(option) {
        return <div>
            {option.label}
        </div>
    }

    renderTableBody() {
        return this.state.pageOfItems.map((item, index) => {
            let number = index + 1 + (this.state.currentPage - 1) * 10;
            let isInput = this.state.inputEnable[number];
            let holding = 0;        //Holding Value (Bitcoin Counts)
            let mkt_value = 0;      //Mkt Value
            let price = 0;          //Price for each coin

            /*Make mkt_value decimal change*/
            if('holding' in item) {
                holding = item.holding;
                if(this.state.currency === 'BTC') {
                    mkt_value = item.holding * item.price_btc;
                }else {
                    mkt_value = item.holding * item.price_usd * this.state.currencyRate;
                    if(mkt_value > 1.0){
                        mkt_value = mkt_value.toFixed(2);
                    }else if(mkt_value == 0){
                        mkt_value = 0;
                    }else {
                        mkt_value = mkt_value.toFixed(6);
                    }
                }
            }

            /*Make price decimal change*/
            if(this.state.currency === 'BTC') {
                mkt_value = mkt_value.toFixed(8);
                price = item.price_btc;
            }else {
                price = item.price_usd * this.state.currencyRate;
                if(price > 1.0){
                    price = price.toFixed(2);
                }else if(price == 0){
                    price = 0;
                }else {
                    price = price.toFixed(6);
                }
            }

            let isMobile = detectMobile();
            if(isMobile) {
                return <div key={index} className="row">
                    <div className="col-xs-2">
                        <span>{item.symbol}</span>
                    </div>
                    <div className="col-xs-4 text-right">
                        <span>{this.state.currency !== 'BTC' ? <span dangerouslySetInnerHTML={{__html: this.state.currentSymbol}} />: ''}{price}
                            {this.state.currency === 'BTC' ? <span>&nbsp;BTC</span>: ''}
                        </span>
                    </div>
                    <div className="col-xs-6 text-right">
                        {isInput ? <input ref="holdingInput" onKeyPress={this.handleKeyPress} className="editable" type="text" value={holding} onChange={(e) => this.changeHolding(e, number)}/>
                            : <span>{holding}</span>}
                        <button type="button" className="close mob-edit" aria-label="close" onClick={() => this.enableInputEditing(number)}>
                            <span className="fa fa-pencil-square-o"></span>
                        </button>
                        <button type="button" className="close mob-remove" aria-label="Close" onClick={() => this.removeCoinData(number)}>
                            <span className="fa fa-times"></span>
                        </button>
                    </div>
                    <div className="col-xs-6 text-right">
                        {item.percent_change_24h > 0 ?
                            <div style={{color: '#21ba45'}}><span>{item.percent_change_24h}%</span></div>:
                            <div style={{color: 'red'}}><span >{item.percent_change_24h}%</span></div>
                        }
                    </div>
                    <div className="col-xs-6 text-right">
                        <span className="mob-mktvalue">{this.state.currency !== 'BTC' ? <span dangerouslySetInnerHTML={{__html: this.state.currentSymbol}} />: ''}{mkt_value}
                            {this.state.currency === 'BTC' ? <span>&nbsp;BTC</span>: ''}</span>
                    </div>
                </div>;
            }else {
                return <tr key={index}>
                    <td style={{'paddingLeft': '20px'}}>{item.name}&nbsp;({item.symbol})</td>
                    <td className="text-right">
                        {this.state.currency !== 'BTC' ? <span dangerouslySetInnerHTML={{__html: this.state.currentSymbol}} />: ''}{price}
                        {this.state.currency === 'BTC' ? <span>&nbsp;BTC</span>: ''}
                    </td>
                    <td className="text-right">
                        {item.percent_change_24h > 0 ?
                            <div style={{color: '#21ba45'}}><span>{item.percent_change_24h}%</span></div>:
                            <div style={{color: 'red'}}><span >{item.percent_change_24h}%</span></div>
                        }
                    </td>
                    <td className="td-holding text-right">
                        {isInput ? <input ref="holdingInput" onKeyPress={this.handleKeyPress} className="editable" type="text" value={holding} onChange={(e) => this.changeHolding(e, number)}/>
                            : <span>{holding}</span>}
                        <button type="button" className="close" aria-label="close" ref={ref => this.removeCoinRef = ref} onClick={() => this.enableInputEditing(number)}>
                            <span className="fa fa-pencil-square-o"></span>
                        </button>
                    </td>
                    <td className="text-right" className="text-right">
                        {this.state.currency !== 'BTC' ? <span dangerouslySetInnerHTML={{__html: this.state.currentSymbol}} />: ''}{mkt_value}
                        {this.state.currency === 'BTC' ? <span>&nbsp;BTC</span>: ''}
                    </td>
                    <td className="text-right" style={{paddingRight: '2%'}}>
                        <button type="button" className="close" aria-label="Close" onClick={() => this.removeCoinData(number)}>
                            <span className="fa fa-times"></span>
                        </button>
                    </td>
                </tr>;
            }
        });
    }

    render() {
        let totalAmount = parseFloat(this.state.totalAmount);

        if(this.state.currency === 'BTC') {
            totalAmount = totalAmount.toFixed(8);
        }else {
            if (totalAmount > 1) {
                totalAmount = totalAmount.toFixed(2);
            } else if (totalAmount == 0) {
                totalAmount = 0;
            } else {
                totalAmount = totalAmount.toFixed(6);
            }
        }

        let isMobile = detectMobile();
        if (isMobile) {
            return (
                <div className="container coin-home">
                    <div className="row">
                        <div className="col-xs-8">
                            <Typeahead placeholder='Type Coin Name' minLength={2} ref={ref => this.coinTypeahead = ref} filterBy={['label']}
                                       maxResults={8} paginate={false}
                                       onChange={this.findCoins}
                                       renderMenuItemChildren = {(option) => this.renderMenuItem(option)}
                                       options={this.state.coinMarketData}/>
                        </div>
                        {/*<div className="col-xs-4">
                            <button type="button add-coin" className="btn btn-success" onClick={this.addCoin}>Add</button>
                        </div>*/}
                    </div>

                    <div className="row col-xs-12">
                        <h4 className="text-left crypto-title">Total Value:</h4>
                    </div>

                    <div className="row col-xs-12">
                        <h4 className="text-center crypto-value">{this.state.currency !== 'BTC' ?
                            <span dangerouslySetInnerHTML={{__html: this.state.currentSymbol}}/> : ''}
                            {totalAmount}{this.state.currency === 'BTC' ? <span>&nbsp;BTC</span> : ''}</h4>
                    </div>

                    <div className="row">
                        <div className="col-xs-2">
                            <label>Currency</label>
                        </div>
                        <div className="col-xs-4 text-right">
                            <label>Price</label>
                        </div>
                        <div className="col-xs-6 text-right">
                            <label className="span-holding">Holdings</label>
                        </div>
                    </div>

                    {this.renderTableBody()}

                    <div className="wrapper-pagination">
                        <Pagination ref="pagination" items={this.state.myCoinsData} onChangePage={this.onChangePage}/>
                    </div>

                    <div className="row price-field">
                        {this.state.isCurrency ?
                            <div className="col-md-4 col-xs-8">
                                <label>Currency :</label>
                                <Typeahead placeholder='Type Currency Name' dropup={this.state.isDropup} minLength={2}
                                           maxResults={8} paginate={false}
                                           onChange={this.changeCurrency}
                                           renderMenuItemChildren = {(option) => this.renderMenuItem(option)}
                                           options={this.state.currencyData}/>
                            </div>:
                            <div className="col-md-8 col-xs-12">
                                <span>Prices shown in {this.state.currencyValue.length > 0 ? this.state.currencyValue[0].label : 'US - United States Dollar'}.</span>
                                <button type="button" onClick={this.showCurrencyBox} className="btn btn-link">Click here to change view settings</button>
                            </div>
                        }
                        <div className="col-md-12 col-xs-12">
                            <span>*Prices are from coinmarketcap.com, refreshed every 5 minutes. </span>
                            <span>{this.state.updatedAt}  in UTC</span>
                        </div>
                    </div>
                </div>
            )
        } else {
            return (
                <div className="container coin-home">
                    <div className="table-header">
                        <div className="row">
                            <div className="col-md-4 col-xs-6">
                                <div className="col-md-8 col-xs-12">
                                    <Typeahead placeholder='Type Coin Name' minLength={2} ref={ref => this.coinTypeahead = ref} filterBy={['label']}
                                               maxResults={8} paginate={false}
                                               onBlur={this.onblur}
                                               onChange={this.findCoins}
                                               renderMenuItemChildren = {(option) => this.renderMenuItem(option)}
                                               options={this.state.coinMarketData}/>
                                </div>
                                {/*<div className="col-md-4 col-xs-4">
                                    <button type="button add-coin" className="btn btn-success" onClick={this.addCoin}>Add</button>
                                </div>*/}
                            </div>
                            <div className="col-md-5 col-xs-8 crypto-market">
                                <h4>Total Value :&nbsp;{this.state.currency !== 'BTC' ?
                                    <span dangerouslySetInnerHTML={{__html: this.state.currentSymbol}}/> : ''}
                                    {totalAmount}{this.state.currency === 'BTC' ? <span>&nbsp;BTC</span> : ''}</h4>
                            </div>
                        </div>
                    </div>
                    <table className="table table-striped">
                        <thead>
                        <tr>
                            <th style={{'width': '15%', 'paddingLeft': '20px'}}>Name</th>
                            <th className="text-right" style={{'width': '10%'}}>Price</th>
                            <th className="text-right" style={{'width': '20%'}}>% Change(24h)</th>
                            <th className="text-right" style={{'width': '20%'}}>Holding</th>
                            <th className="text-right" style={{'width': '20%'}}>Mkt Value</th>
                            <th style={{'width': '10%'}}></th>
                        </tr>
                        </thead>
                        <tbody>
                        {this.renderTableBody()}
                        </tbody>
                    </table>
                    <div className="wrapper-pagination">
                        <Pagination ref="pagination" items={this.state.myCoinsData} onChangePage={this.onChangePage}/>
                    </div>

                    <div className="row price-field">
                        {this.state.isCurrency ?
                            <div className="col-md-12 col-xs-12">
                                <div className="col-md-4 col-xs-5">
                                    <Typeahead placeholder='Type Currency Name' dropup={this.state.isDropup} minLength={2} maxResults={8}
                                               filterBy={['label']}
                                               onChange={this.changeCurrency} paginate={false}
                                               renderMenuItemChildren = {(option) => this.renderMenuItem(option)}
                                               options={this.state.currencyData}/>
                                </div>
                                <div className="col-md-2 col-xs-3">
                                    <button type="button" onClick={this.closeCurrencyBox} className="btn btn-primary">Cancel</button>
                                </div>
                            </div>:
                            <div className="col-md-8">
                                <span>*Prices shown in {this.state.currencyValue.length > 0 ? this.state.currencyValue[0].label : 'US - United States Dollar'}.</span>
                                <button type="button" onClick={this.showCurrencyBox} className="btn btn-link">Click here to change view settings</button>
                            </div>
                        }
                        <div className="col-md-12 col-xs-12">
                            <span>*Prices are from coinmarketcap.com, refreshed every 5 minutes. </span>
                            <span>{this.state.updatedAt} in UTC</span>
                        </div>
                    </div>
                </div>
            );
        }
    }
}