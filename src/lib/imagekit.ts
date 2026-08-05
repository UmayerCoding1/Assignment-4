
import ImageKit from "@imagekit/nodejs";
import config from "../config";

const imagekit = new ImageKit({
    privateKey: config.imagekit.privateKey,

});

export default imagekit;