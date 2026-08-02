"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const imagekit_1 = __importDefault(require("imagekit"));
const config_1 = __importDefault(require("../config"));
const imagekit = new imagekit_1.default({
    publicKey: config_1.default.imagekit.publicKey,
    privateKey: config_1.default.imagekit.privateKey,
    urlEndpoint: config_1.default.imagekit.urlEndpoint,
});
exports.default = imagekit;
