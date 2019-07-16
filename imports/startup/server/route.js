import { Picker } from 'meteor/meteorhacks:picker';
import { StoragePath } from "../both/Images";
import fs from "fs";

Picker.route('/file/:path', function(params, req, res, next) {
    if(fs.existsSync(StoragePath + "/" + params.path)){
        const file = fs.readFileSync(StoragePath + "/" + params.path);
        res.end(file);
    } else {
        res.end("File not found.");
    }
});