import express from "express";
import dotenv from "dotenv";
import { getImg } from "../controllers/unsplash";

const Router = express.Router();

Router.get("/:keyword", (req, res, next)=>{
    // console.log(req.params);
    getImg(req, res, next);
    next()
})

export const unsplash = Router;