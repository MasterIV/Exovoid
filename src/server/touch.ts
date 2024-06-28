import fs from 'node:fs';
export default function touch(dir:string) {
    try {
        fs.statSync(dir);
    } catch(e) {
        fs.mkdirSync(dir);
    }
};