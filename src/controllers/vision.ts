import express, { Request, Response, NextFunction} from "express";
import { handleError } from "./errors";
import vision from "@google-cloud/vision";

const client = new vision.ImageAnnotatorClient({
    keyFilename: "./APIKey.json",
});

const toGoogle = async (req:Request, res:Response, next:NextFunction) => {
    const request = req.body;
    const response = await client.batchAnnotateImages(request)
    .catch((err) => {
        console.log(err);
        handleError(req, res, 500, `From cloud-vision API.\n${err}`);
    });
    console.log("Received response from cloud vision");
    // res.json(response);
    req.body = response;
    next();
}


export const googleApi = toGoogle;
