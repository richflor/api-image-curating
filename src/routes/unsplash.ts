import express from "express";
import dotenv from "dotenv";
import { getImages } from "../controllers/unsplash";

const Router = express.Router();

Router.get("/:keyword", (req, res, next)=>{
    getImages(req, res, next);
})

export const unsplash = Router;