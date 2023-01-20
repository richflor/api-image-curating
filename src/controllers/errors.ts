import { Response, Request } from "express-serve-static-core";

const httpError = (req:Request, res:Response, status:number|null = null) => {
    switch (status) {
        case 400:
            res.status(400).send('<h1>Wrong method used, only GET method is allowed</h1>');
            break;
        case 404:
            res.status(400).send('<h1>Ressources not found</h1>');
            break;
        case 500:
            res.status(500).send('<h1>Internal Server Error</h1>');
        default:
            res.status(404).send('<h1>Ressources not found</h1>')
    }
    res.status(404).send('<h1>Ressources not found</h1>')
}

export const handleError = httpError;

// const error400 = (req:Request, res:Response) => {
//     res.status(400).send('<h1>Wrong method used, only GET method is allowed</h1>');
// }

// const error404 = (req:Request, res:Response) => {
//     res.status(404).send('<h1>Ressources not found</h1>')
// }

// const error500 = (req:Request, res:Response) => {
//     res.status(404).send('<h1>Ressources not found</h1>')
// }

// export const error = {error400, error404}