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
    console.log(req.body)
    const keyword = req.body.keyword;
    if(checkParams(keyword)) {
        const json = await api.search.getPhotos({ query: keyword, page: 1, perPage: 10})
        .then(result => {
            if (result.errors) {
                console.log('error occurred: ', result.errors[0]);
                handleError(req, res, 500)
            } else {
                console.log("json received");
                const dataDump = result.response.results;
                const data = dataDump.map(photo => {
                    return {
                        url:photo.urls.regular,
                        link:photo.links.download_location,
                        linkUser:photo.user.links.self
                    }
                })
                return data
            }
        })
        console.log("promise resolved");
        if(json?.length === 0) {
            return res.status(200).send("Nothing found with current parameter")
        }
        return res.json(json);
        // next();
    }
    handleError(req, res, 400, "Keyword parameter has invalid characters")
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

export const getImages = getImg