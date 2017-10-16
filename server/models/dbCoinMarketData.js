/* 2017-8-9
 * created by Liam M.
 * */
import { Mongo } from 'meteor/mongo';

const dbCoinMarketData = new Mongo.Collection('dbCoinMarketData');

dbCoinMarketData.schema = new SimpleSchema({
    id: {type: String},
    name: {type: String},
    symbol: {type: String},
    rank: {type: Number},
    price_usd: {type: String},
    price_btc: {type: String},
    '24h_volume_usd': {type: String},
    market_cap_usd: {type: String},
    available_supply: {type: String},
    total_supply: {type: String},
    percent_change_1h: {type: String},
    percent_change_24h: {type: String},
    percent_change_7d: {type: String},
    last_updated: {type: String},
    createdDate: {type: Date}
});

export default dbCoinMarketData
