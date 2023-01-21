import express, {Response, Request, NextFunction} from "express";
import dotenv from "dotenv";
// import { unsplash } from "./routes/unsplash";
import { getImages } from "./controllers/unsplash";
import { handleError } from "./controllers/errors";
import { googleApi } from "./controllers/vision";
import { filterByLabels } from "./controllers/filter";


dotenv.config();
const app = express();
const port = process.env.PORT || 3000;
const uriRoot = "/api/v1";

app.all(`${uriRoot}/*`, (req, res, next)=> {
    if(req.method !== "POST") {
        handleError(req, res, 400, "Wrong method used, only POST method is allowed");
    }
    next();
})

app.use(express.json())
app.use(uriRoot, getImages, googleApi)

app.post(`${uriRoot}/analyze`, filterByLabels)

app.all(`${uriRoot}/*`, (req, res)=> {
    handleError(req, res, 404);
})

app.listen(port, ()=> console.log(`API running on port:${port}`));
