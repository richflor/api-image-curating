import express, {Response, Request, NextFunction} from "express";
import dotenv from "dotenv";
// import { unsplash } from "./routes/unsplash";
import { getImages } from "./controllers/unsplash";
import { handleError } from "./controllers/errors";
import { googleApi } from "./controllers/vision";


dotenv.config();
const app = express();
const port = process.env.PORT || 3000;
const uriRoot = "/api/v1";

app.use(express.json())
app.use(uriRoot, getImages, googleApi)

app.all(`${uriRoot}/*`, (req, res)=> {
    if(req.method !== "GET") {
        handleError(req, res, 400, "Wrong method used, only GET method is allowed");
    }
    handleError(req, res, 404);
})

app.listen(port, ()=> console.log(`API running on port:${port}`));
