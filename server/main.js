/* 2017-8-8
 * created by Liam M.
 * */
import { Meteor } from 'meteor/meteor';
import { Accounts } from 'meteor/accounts-base';
import { Mongo } from 'meteor/mongo';
import dbCoinMarketData from './models/dbCoinMarketData';
import dbCoinMarketDataCopy from './models/dbCoinMarketDataCopy';
import dbCoins from './models/dbCoins';

let request = Npm.require('request');

Meteor.startup(() => {
  // code to run on server at startup
    let isRunning = true;
    Meteor.setTimeout(function(){Meteor.call('getMarketData');}, 1);
    Meteor.setInterval(function(){Meteor.call('getMarketData');}, 300000);

    Meteor.methods({
        getMarketData: function () {
            console.log("called by server");
            isRunning = true;
            //Remove all data in the table
            dbCoinMarketData.remove({});

            var options = {
                "method": 'GET',
                "url": 'https://api.coinmarketcap.com/v1/ticker/',
                "headers": {
                    'Content-Type': 'application/json'
                }
            };

            request(options, Meteor.bindEnvironment(function(err, response, body) {
                if (err) throw new Error(err);

                let requestData = JSON.parse(body);
                let existingData = dbCoins.find({}).count();

                //Insert loaded coin Market datas
                Object.keys(requestData).forEach(key => {
                    let coin = requestData[key];
                    coin.rank = parseInt(coin.rank);
                    coin.label =  coin.name + ' (' + coin.symbol +  ')';
                    coin.createdDate = new Date();
                    dbCoinMarketData.insert(coin);

                    //Insert db coins of first Insert
                    if(existingData < 1) {
                        let options = [];
                        options.value = coin.id;
                        options.label = coin.name + ' (' + coin.symbol +  ')';
                        dbCoins.insert(options);
                    }
                });
                isRunning = false;

                //Copy Table to dbCoinMarketDataCopy
                dbCoinMarketDataCopy.remove({});
                let coinMarketData = dbCoinMarketData.find({}, {sort: {rank: 1}}).fetch();
                coinMarketData.map((item) => {
                    delete item._id;
                    dbCoinMarketDataCopy.insert(item);
                })

            }));
        },

        loadMarketData: function (savedData) {
            let data = {};
            let coinData = [];
            if(isRunning) {
                coinData = dbCoinMarketDataCopy.find({}, {sort: {rank: 1}}).fetch();
            }else {
                coinData = dbCoinMarketData.find({}, {sort: {rank: 1}}).fetch();
            }

            let savedCoins = [];
            if(savedData) {
                savedData.map((savedItem) => {
                    coinData.map((item) => {
                        if(item.id === savedItem.id) {
                            item.holding = savedItem.holding;
                            savedCoins.push(item);
                        }
                    });
                });
            }

            data.coinData = coinData;
            data.savedData = savedCoins;
            
            return data;
        }
    });
});
