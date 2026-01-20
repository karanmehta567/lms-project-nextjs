import arcjet, { fixedWindow } from "@/lib/arcjet";

export const aj=arcjet.withRule(
    fixedWindow({
        mode:'LIVE',
        window:'1m',
        max:5
    })
)