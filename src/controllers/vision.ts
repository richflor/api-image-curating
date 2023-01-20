import express, { Request, Response, NextFunction} from "express";
import { handleError } from "./errors";
import vision from "@google-cloud/vision";

const client = new vision.ImageAnnotatorClient({
    keyFilename: "./APIKey.json",
});

const toGoogle = async (req:Request, res:Response, next:NextFunction) => {
    const request = req.body;
    console.log(req.body.requests[0])
    const response = await client.batchAnnotateImages(request);
    console.log("Received response from cloud vision");
    res.json(response);
    //next();
}


export const googleApi = toGoogle;
