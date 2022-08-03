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
exports.bloggersRouter = void 0;
const express_1 = require("express");
const input_validation_middleware_1 = require("../middlewares/input-validation-middleware");
const bloggers_service_1 = require("../bll-domain/bloggers-service");
const posts_service_1 = require("../bll-domain/posts-service");
const getErrorResponse_1 = require("../helpers/getErrorResponse");
exports.bloggersRouter = (0, express_1.Router)({});
exports.bloggersRouter.get('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const searchName = (_a = req.query.SearchNameTerm) === null || _a === void 0 ? void 0 : _a.toString();
    const params = (0, input_validation_middleware_1.getQueryPaginationFromQueryString)(req);
    const bloggers = yield bloggers_service_1.bloggersService.findBloggers(params.pageNumber, params.pageSize, searchName);
    res.status(200).send(bloggers);
}));
exports.bloggersRouter.get('/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    if (!id) {
        res.sendStatus(400);
        return;
    }
    const blogger = yield bloggers_service_1.bloggersService.findBloggerById(id);
    if (blogger) {
        res.send(blogger);
    }
    else {
        res.sendStatus(404);
    }
}));
exports.bloggersRouter.get('/:bloggerId/posts', input_validation_middleware_1.bearerAuth, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _b;
    const bloggerId = req.params.bloggerId;
    const params = (0, input_validation_middleware_1.getQueryPaginationFromQueryString)(req);
    const blogger = yield bloggers_service_1.bloggersService.findBloggerById(bloggerId);
    if (!blogger) {
        res.sendStatus(404);
        return;
    }
    const postsByBloggerId = yield posts_service_1.postService.getPostsByBloggerId(params.pageNumber, params.pageSize, bloggerId, (_b = req.user) === null || _b === void 0 ? void 0 : _b._id);
    res.status(200).send(postsByBloggerId);
}));
exports.bloggersRouter.post('/', input_validation_middleware_1.basicAuth, input_validation_middleware_1.nameValueValidation, input_validation_middleware_1.youtubeUrlValidation1, input_validation_middleware_1.youtubeUrlValidation2, input_validation_middleware_1.inputValidationMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const name = req.body.name;
    const youtubeUrl = req.body.youtubeUrl;
    const blogger = yield bloggers_service_1.bloggersService.createBlogger(name, youtubeUrl);
    if (blogger) {
        res.status(201).send(blogger);
    }
    else {
        res.status(400).send((0, getErrorResponse_1.getErrorResponse)([{ message: 'blogger is not created', field: 'bloggerId' }]));
    }
}));
exports.bloggersRouter.post('/:bloggerId/posts', input_validation_middleware_1.basicAuth, input_validation_middleware_1.titleValidation, input_validation_middleware_1.shortDescriptionValidation, input_validation_middleware_1.contentValidation, input_validation_middleware_1.inputValidationMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const bloggerId = req.params.bloggerId;
    const title = req.body.title;
    const shortDescription = req.body.shortDescription;
    const content = req.body.content;
    const blogger = yield bloggers_service_1.bloggersService.findBloggerById(bloggerId);
    if (!blogger) {
        res.sendStatus(404);
        return;
    }
    if (blogger) {
        const post = yield posts_service_1.postService.createPost(title, shortDescription, content, bloggerId);
        res.status(201).send(post);
    }
    else {
        res.status(400).send((0, getErrorResponse_1.getErrorResponse)([{ message: 'post is not created', field: 'postId' }]));
    }
}));
exports.bloggersRouter.put('/:id', input_validation_middleware_1.basicAuth, input_validation_middleware_1.nameValueValidation, input_validation_middleware_1.youtubeUrlValidation1, input_validation_middleware_1.youtubeUrlValidation2, input_validation_middleware_1.inputValidationMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    if (!id) {
        res.sendStatus(400);
        return;
    }
    const name = req.body.name;
    const youtubeUrl = req.body.youtubeUrl;
    const isUpdated = yield bloggers_service_1.bloggersService.updateBlogger(id, name, youtubeUrl);
    if (isUpdated) {
        res.sendStatus(204);
    }
    else
        res.sendStatus(404);
}));
exports.bloggersRouter.delete('/:id', input_validation_middleware_1.basicAuth, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    if (!id) {
        res.sendStatus(400);
        return;
    }
    const isDeleted = yield bloggers_service_1.bloggersService.deleteBlogger(id);
    if (isDeleted) {
        res.sendStatus(204);
    }
    else
        res.sendStatus(404);
}));
//# sourceMappingURL=bloggers-router.js.map