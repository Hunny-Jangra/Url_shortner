const { json } = require('express');
const mongoose = require('mongoose');
const redis = require('redis');
const util = require('util');

const redisUrl = 'redis://127.0.0.1:6379';
const client = redis.createClient(redisUrl);
client.get = util.promisify(client.get);


const exec = mongoose.Query.prototype.exec;

mongoose.Query.prototype.exec = async function() {
    console.log("I'm about to run this code");
    // console.log(this.getQuery());
    // console.log(this.mongooseCollection.name);
   const keys =  JSON.stringify(Object.assign({}, this.getQuery(), {
        collection: this.mongooseCollection.name
    }));
    
    // if we have a value or 'key' in redis
    let chacheClient = await client.get(keys);
    ///////// this is only written for Post request //////

    if(chacheClient == 'null') {
        return 1;
    }

    ////////////////////////////////////////////////////////
   
    // if do thn return 
    if(chacheClient) {
        console.log('serving from REDIS {{ Cache HIT }}');
        console.log(JSON.parse(chacheClient));
        return JSON.parse(chacheClient);
        
    }
    // otherwise issue that query, and store the result in redis 
    const result = await exec.apply(this, arguments);
    if(result == 'null') {
        return 0;
    }
    client.set(keys, JSON.stringify(result));
    console.log('serving from MONGODB {{ cahce MISS }}');
    console.log(result);
    return result ;
}

