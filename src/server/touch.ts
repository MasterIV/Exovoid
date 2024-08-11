import * as fs from 'fs';

function touch(dir:string) {
    try {
        fs.statSync(dir);
    } catch(e) {
        fs.mkdirSync(dir);
    }
}

export default touch;