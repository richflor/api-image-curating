import { Response, Request } from "express-serve-static-core";

const defaultMessage = "Ressources not found";
const defaultError = 404;

const httpError = (req:Request, res:Response, errorStatus:number = defaultError, message:string = defaultMessage) => {

    if(errorStatus !== defaultError && message === defaultMessage) {
        switch (errorStatus) {
            case 400:
                message = 'Bad request';
                break;
            case 404:
                message = 'Ressources not found';
                break;
            case 500:
                message = 'Internal Server Error';
        }        
    }

    res.status(errorStatus).send(`<h1>${message}</h1>`);
}

export const handleError = httpError;