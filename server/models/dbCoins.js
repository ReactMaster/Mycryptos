/* 2017-8-9
 * created by Liam M.
 * */
import { Mongo } from 'meteor/mongo';

const dbCoins = new Mongo.Collection('dbCoins');

dbCoins.schema = new SimpleSchema({
    value: {type: Number},
    text: {type: String},
    created: {type: Date}
});

export default dbCoins
