import { Response, Request, NextFunction } from "express-serve-static-core";
import { createApi } from "unsplash-js";
import dotenv from "dotenv";
import { handleError } from "./errors";
dotenv.config();

const accessKey = process.env.API_ACCESS_KEY || "";

const api = createApi({
    accessKey: accessKey
})

const getImages = (req:Request, res:Response, next:NextFunction)=>{
    if(checkParams(req.params.keyword)) {
        api.search.getPhotos({ query: req.params.keyword, page: 1, perPage: 10})
        .then(result => {
            if (result.errors) {
                console.log('error occurred: ', result.errors[0]);
                handleError(req, res, 500)
            } else {
                const json = result.response.results;
                console.log("json");
                res.json(json);
            }
          })
        console.log(req.params)
        next();
        // res.send(`param is ${req.params.keyword}`)
    }
}

const regex:RegExp = /\W/;

function checkParams(param:any):boolean {
    if(typeof param !== 'string'){
        console.log("not a string");
        return false;
    }
    const match:RegExpMatchArray|null = param.match(regex);
    if(match !== null){
        console.log("wrong match");
        return false;
    }
    return true;
}

export const getImg = getImages