import { Response, Request, NextFunction } from "express-serve-static-core";
import { createApi } from "unsplash-js";
import dotenv from "dotenv";
import { handleError } from "./errors";
import { type } from "os";

dotenv.config();
const accessKey = process.env.API_ACCESS_KEY || "";
// can't send more than 16 images to google cloud vision api
// at least not with a free account
let numberOfImages = 16;

const api = createApi({
    accessKey: accessKey
})

const getImg = async (req:Request, res:Response, next:NextFunction)=>{    
    const errorMessage = checkParams(req.body);
    if(!errorMessage) {
        const keyword = req.body.keyword;
        if(req.body.limit) {
            numberOfImages = req.body.limit;
        }
        const json = await api.search.getPhotos({ query: keyword, page: 1, perPage: numberOfImages})
        .then(result => {
            if (result.errors) {
                console.log('error occurred: ', result.errors[0]);
                handleError(req, res, 500, `Error from Unsplash API :${result.errors[0]}`)
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
                })
                return data
            }
        })
        console.log("promise resolved");
        if(json?.length === 0) {
            return res.status(200).send("No image was found, try with another keyword")
        }
        //return res.json(json);
        res.locals.labels = req.body.labels;
        res.locals.keyword = req.body.keyword;
        res.locals.imgLinks = json.requests.map((photo: { image: { source: { imageUri: string; }; }; }) => photo.image.source.imageUri)
        req.body = json;
        return next();
    }
    handleError(req, res, 400, errorMessage)
}

const regexKeyword:RegExp = /^[\w' -]{2,30}$/;
const regexLabel:RegExp = /^[\w ]{1,63}$/;

function checkParams(param:any):string | null {
    if(!param.keyword && !param.labels) {
        return "Parameters missing";
    }
    if(typeof param.labels !== "object") {
        return "Labels is not an array";
    }
    if(param.limit) {
        if (typeof param.limit !== "number") {
            return "Limit is not a number";
        }
    }
    if(!validateParam(param.keyword, regexKeyword)) {
        console.log("keyword invalid")
        console.log(param.keyword)
        return `${param.keyword} as a keyword is invalid, 
        it should only contain the following characters :
        - alpha-numeric characters
        - the characters " - ' _ "
        - white spaces`;
    }
    for (const label of param.labels) {
        if(!validateParam(label, regexLabel)) {
            console.log("label invalid")
            console.log(label)
            return `${label} as one of the labels is invalid, 
            it should only contain the following characters :
            - alpha-numeric characters
            - white spaces`;
        }
    }
    return null;
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