"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.commentContentValidation = exports.passwordValidation = exports.loginValidation = exports.bloggerIdValidation = exports.contentValidation = exports.shortDescriptionValidation = exports.youtubeUrlValidation2 = exports.youtubeUrlValidation1 = exports.nameValueValidation = exports.titleValidation = exports.getQueryPaginationFromQueryString = exports.checkAuth = exports.bearerAuth = exports.basicAuth = exports.authValidationMiddleware = exports.inputValidationMiddleware = void 0;
const express_validator_1 = require("express-validator");
const jwt_utility_1 = require("../application/jwt-utility");
const users_service_1 = require("../bll-domain/users-service");
const getErrorResponse_1 = require("../helpers/getErrorResponse");
const inputValidationMiddleware = (req, res, next) => {
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        const newErrors = errors.array({ onlyFirstError: true }).map((error) => ({
            message: error.msg,
            field: error.param,
        }));
        const errorResponse = (0, getErrorResponse_1.getErrorResponse)(newErrors);
        res.status(400).json(errorResponse);
    }
    else {
        next();
    }
};
exports.inputValidationMiddleware = inputValidationMiddleware;
const authValidationMiddleware = (req, res, next) => {
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        let newErrors = errors.array();
        res.sendStatus(401);
    }
    else {
        next();
    }
};
exports.authValidationMiddleware = authValidationMiddleware;
const credentials = {
    login: 'admin',
    password: 'qwerty'
};
let data = `${credentials.login}:${credentials.password}`;
let basicAuth = (req, res, next) => {
    let buff = Buffer.from(data); //string from auth - hcsakj23nj
    let base64data = buff.toString('base64'); //закодированная string под base64
    const validAuthValue = `Basic ${base64data}`; //вся кодировка 'Basic  SDGSNstnsdgn' (admin:qwerty)
    let authHeader = req.headers.authorization;
    if (authHeader && authHeader === validAuthValue) {
        next();
    }
    else
        res.sendStatus(401);
};
exports.basicAuth = basicAuth;
let bearerAuth = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    if (!req.headers.authorization) {
        res.sendStatus(401);
        return;
    }
    const token = req.headers.authorization.split(' ')[1]; //deleted Bearer
    const userId = yield jwt_utility_1.jwtUtility.extractUserIdFromToken(token);
    if (userId) {
        const user = yield users_service_1.usersService.getUserBy_id(userId);
        if (user) {
            req.user = user;
            next();
            return;
        }
        else {
            res.sendStatus(401);
            return;
        }
    }
    else {
        res.sendStatus(401);
        return;
    }
});
exports.bearerAuth = bearerAuth;
let checkAuth = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    if (!req.headers.authorization) {
        next();
        return;
    }
    const token = req.headers.authorization.split(' ')[1]; //deleted Bearer
    const userId = yield jwt_utility_1.jwtUtility.extractUserIdFromToken(token);
    if (userId) {
        const user = yield users_service_1.usersService.getUserBy_id(userId);
        if (user) {
            req.user = user;
        }
    }
    next();
});
exports.checkAuth = checkAuth;
const getQueryPaginationFromQueryString = (req) => {
    const pageNumber = req.query.PageNumber && typeof (req.query.PageNumber) === 'string' && (isFinite(parseInt(req.query.PageNumber))) ? parseInt(req.query.PageNumber) : 1;
    const pageSize = req.query.PageSize && typeof (req.query.PageSize) === 'string' && (isFinite(parseInt(req.query.PageSize))) ? parseInt(req.query.PageSize) : 10;
    return { pageNumber, pageSize };
};
exports.getQueryPaginationFromQueryString = getQueryPaginationFromQueryString;
const regexp = new RegExp('^https://([a-zA-Z0-9_-]+\\.)+[a-zA-Z0-9_-]+(\\/[a-zA-Z0-9_-]+)*\\/?$');
exports.titleValidation = (0, express_validator_1.body)('title').trim().isLength({ min: 2, max: 30 })
    .withMessage('title is required and its length should be 2-30 symbols');
exports.nameValueValidation = (0, express_validator_1.body)('name').trim().isLength({ min: 2, max: 15 })
    .withMessage('name is required and its length should be 2-15symbols');
exports.youtubeUrlValidation1 = (0, express_validator_1.body)('youtubeUrl').isLength({ min: 2, max: 100 })
    .withMessage('UrlValidations length should be 2-100 symbols');
exports.youtubeUrlValidation2 = (0, express_validator_1.body)('youtubeUrl').matches(regexp)
    .withMessage('UrlValidation is required, length 2-100 and its pattern:' +
    ' ^https://([a-zA-Z0-9_-]+\\.)+[a-zA-Z0-9_-]+(\\/[a-zA-Z0-9_-]+)*\\/?$\n');
exports.shortDescriptionValidation = (0, express_validator_1.body)('shortDescription').trim().isLength({ min: 2, max: 100 })
    .withMessage('shortDescription is required and its Klength should be 2-100 symbols');
exports.contentValidation = (0, express_validator_1.body)('content').trim().isLength({ min: 2, max: 1000 })
    .withMessage('content is required and its length should be 2-100 symbols');
exports.bloggerIdValidation = (0, express_validator_1.body)('bloggerId').isNumeric()
    .withMessage('bloggerId is required and its number');
exports.loginValidation = (0, express_validator_1.body)('login').trim().isLength({ min: 3, max: 10 })
    .withMessage('login is required and its length should be 3-10 symbols');
exports.passwordValidation = (0, express_validator_1.body)('password').trim().isLength({ min: 6, max: 20 })
    .withMessage('password is required and its length should be 6-20 symbols');
exports.commentContentValidation = (0, express_validator_1.body)('content').trim().isLength({ min: 20, max: 300 })
    .withMessage('content is required and its length should be 20-300 symbols');
//# sourceMappingURL=input-validation-middleware.js.map