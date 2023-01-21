import express, {Response, Request, NextFunction} from "express";

const filter = (req:Request, res:Response, next:NextFunction) => {
    const toFilter = req.body[0].responses.map((image: { labelAnnotations: { description: string; }[]; }, index:number) => {
        return {
            "image_url": res.locals.imgLinks[index],
            "labels": image.labelAnnotations.map(
                (label: { description: string; }) => label.description
            )
        }
    });
    console.log("filtering")
    //return res.status(200).json(toFilter)
    const labels = res.locals.labels;
    const filteredReq = toFilter.filter((image: any) => checkLabels(image.labels, labels));
    console.log(`${filteredReq.length} matches`)
    if(filteredReq.length < 1) {
        return res.status(200).send("No matches were found. Try with other labels")
    }
    return res.status(200).json(
        {
            keyword:res.locals.keyword,
            matches:filteredReq
        }
    )
}

const regexSingleWordLabel:RegExp = /^[\w]{1,63}$/;
const regexSpace:RegExp = /[ _-]/;
const regexPluralWordsLabel:RegExp = /[\w]{1,63}/;

function checkLabels(labelstoCheck:string[], labels:string[]):boolean {
    const nbrLabels = labels.length;
    let countLabelsMatch = 0;
    for (const label of labels) {
        const found = labelstoCheck.find(labelBeingChecked => checkRegex(labelBeingChecked, label))
        if(found){
            countLabelsMatch++;
        }
    }
    // console.log(`labels:${nbrLabels}, count:${countLabelsMatch}`)
    if(countLabelsMatch >= nbrLabels) {
        return true;
    }
    return false;
}

function checkRegex(label:string, schema:string):boolean {
    const regex = new RegExp(`(?<!\\w)${schema.toLowerCase()}(?!\\w)`);
    const match:RegExpMatchArray|null = label.toLowerCase().match(regex);
    if(match === null){
        //console.log("no match");
        return false;
    }
    //console.log("match");
    return true;
}

export const filterByLabels = filter;