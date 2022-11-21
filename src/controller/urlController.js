const Short_Url = require('../models/userModel');
const shortid = require('shortid');
var validUrl = require('valid-url');
const AppError = require('../utils/appError');



exports.createUrl = async(req, res, next) => {
    try{

        let data1 = req.body;
        let {longUrl} = data1;   
        if(!longUrl) {
         return next(new AppError('longUrl is not exists! Please provide this field', 400));
        }
        if(!validUrl.isUri(longUrl)) {
            return res.status(400).send({status: false, message: "Url is not Valid"});
        }
       
        let short = 'http://localhost:3000/';
        let code = shortid.generate().toLowerCase();
        let short_Url = req.body.shortUrl = `${short}${code}`;
        
        let url_Code = req.body.urlCode = code;

        let some_data = {};
        some_data.Short_Url = short_Url;
        some_data.url_Code = url_Code;
        
        let checkinDB = await Short_Url.findOne({longUrl: req.body.longUrl});
            console.log(checkinDB);
            
            
            if(checkinDB) {
                return next(new AppError('longUrl is already existes in DB', 400));
            }
            
            const createtinyUrl = await Short_Url.create(req.body);
            let data = {};
            data.longUrl = createtinyUrl.longUrl;
            data.shortUrl = some_data.Short_Url;
            data.urlCode = some_data.url_Code;
                
            return res.status(201).send({
                status: true,
                data
            })

    }catch(error) {
        return res.status(500).send({status: false, message: error.message})
    }


}

exports.getOriginalUrl = async(req, res, next) => {
    try{

        const urlCode_param = req.params.urlCode;
        // const redis = require('redis');
        // const redisUrl = 'redis://127.0.0.1:6379';
        // const client = redis.createClient(redisUrl);
        // const util = require('util');
        // client.get = util.promisify(client.get);
        // we have any cahed data in redis related to this query 
        // const cached_Url = await client.get(urlCode_param);
        
        // if yes, then respond reuest right away and return 
    

        // if(cached_Url) {
        //     console.log('Serving form cache');
    
        //     return res.status(302).send({
        //         status: true,
        //         data: JSON.parse(cached_Url)
        //     })
        // }
        // if no, then respond to request through DB and update our cache to store our data

   
        const throughUrlCode = await Short_Url.findOne({urlCode: urlCode_param});
   
        // console.log('serving form MondoDB');
        // client.set(urlCode_param, JSON.stringify(throughUrlCode));
        
        
        if(!throughUrlCode) {
            return next(new AppError(`No UrlCode found  | ${req.originalUrl} | from DataBase`,404))
        }
        else{
            const data ={};
            data.longUrl = throughUrlCode.longUrl;
            data.shortUrl = throughUrlCode.shortUrl;
            data.urlCode = throughUrlCode.urlCode;
            return res.status(200).redirect(throughUrlCode.longUrl)
        }

    }catch(error) {
        return res.status(500).send({
            status: false,
            message: error.message
        })
    }
    

}