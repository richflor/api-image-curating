import { Response, Request, NextFunction } from "express-serve-static-core";
import { createApi } from "unsplash-js";
import dotenv from "dotenv";
import { handleError } from "./errors";
dotenv.config();

const accessKey = process.env.API_ACCESS_KEY || "";

const api = createApi({
    accessKey: accessKey
})

const getImg = async (req:Request, res:Response, next:NextFunction)=>{
    if(!req.body.keyword && !req.body.labels) {
        return handleError(req, res, 400, "Parameters missing");
    }
    const keyword = req.body.keyword;
    if(checkParams(req.body)) {
        const json = await api.search.getPhotos({ query: keyword, page: 1, perPage: 3})
        .then(result => {
            if (result.errors) {
                console.log('error occurred: ', result.errors[0]);
                handleError(req, res, 500)
            } else {
                console.log("json received");
                const dataDump = result.response.results;
                const data:any = {};
                data.requests = dataDump.map(photo => {
                    return {
                        "image":{
                            "source":{
                                "imageUri":photo.urls.regular
                            }
                        },
                        "features":[
                            {
                                "type":"LABEL_DETECTION",
                                "maxResults":15
                            }
                        ]                        
                    }
                    // return {
                    //     url:photo.urls.regular,
                    //     link:photo.links.download_location,
                    //     linkUser:photo.user.links.self
                    // }
                })
                return data
            }
        })
        console.log("promise resolved");
        if(json?.length === 0) {
            return res.status(200).send("Nothing found with current parameter")
        }
        //return res.json(json);
        req.body = json;
        return next();
    }
    handleError(req, res, 400, "Parameters have invalid characters")
}

const regexKeyword:RegExp = /^[\w' ]{2,30}$/;
const regexLabel:RegExp = /^[\w ]{1,63}$/;

function checkParams(param:any):boolean {
    if(!validateParam(param.keyword, regexKeyword)) {
        console.log("keyword invalid")
        console.log(param.keyword)
        return false;
    }
    for (const label of param.labels) {
        if(!validateParam(label, regexLabel)) {
            console.log("label invalid")
            console.log(label)
            return false;
        }
    }
    return true
}

function validateParam(param:any, regex:RegExp):boolean {
    if(typeof param !== 'string'){
        console.log("not a string");
        return false;
    }
    const match:RegExpMatchArray|null = param.match(regex);
    if(match === null){
        console.log("wrong match");
        return false;
    }
    return true;
}



export const getImages = getImg