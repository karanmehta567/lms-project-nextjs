import arcjet, { detectBot, fixedWindow } from "./arcjet";

export const arcjetRule=arcjet.withRule(
    detectBot({
        mode:'LIVE',
        allow:[]
    })
).withRule(
    fixedWindow({
        mode:'LIVE',
        window:'1m',
        max:5
    })
)