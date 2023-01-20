import express, {Response, Request} from "express";
import dotenv from "dotenv";
// import { testRouter } from "./routes/test";
import { unsplash } from "./routes/unsplash";
import { handleError } from "./controllers/errors";
dotenv.config();

const app = express();
const port = process.env.PORT || 3000;
const URIroot = "/api/v1"


// app.use("/test", testRouter)
app.use("/api/v1", [unsplash
])

// app.get("/", (req, res)=>{
//     res.redirect("/test");
// })

// app.get(URIroot, "/:keyword" );

app.all("*", (req, res)=>{
    if(req.method != "GET") {
        handleError(req, res, 400);
    }
    handleError(req, res, 404)
})

app.listen(port, ()=> console.log(`API running on port:${port}`));
