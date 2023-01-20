import express, {Response, Request} from "express";

const Router = express.Router();

Router.get("/", (req, res)=>{
    res.json({ "message": "Template Router"})
})

export const testRouter = Router;