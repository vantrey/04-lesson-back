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
exports.postsRouter = void 0;
const express_1 = require("express");
const bloggers_db_repository_1 = require("../repositories/bloggers-db-repository");
const input_validation_middleware_1 = require("../middlewares/input-validation-middleware");
const posts_service_1 = require("../bll-domain/posts-service");
const comments_db_repository_1 = require("../repositories/comments-db-repository");
const comments_service_1 = require("../bll-domain/comments-service");
const getErrorResponse_1 = require("../helpers/getErrorResponse");
exports.postsRouter = (0, express_1.Router)({});
exports.postsRouter.get('/', input_validation_middleware_1.checkAuth, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const params = (0, input_validation_middleware_1.getQueryPaginationFromQueryString)(req);
    const user = req.user;
    const posts = yield posts_service_1.postService.getPosts(params.pageNumber, params.pageSize, user === null || user === void 0 ? void 0 : user._id);
    console.log('GET_POSTS__ ', posts);
    res.status(200).send(posts);
}));
exports.postsRouter.post('/', input_validation_middleware_1.basicAuth, input_validation_middleware_1.titleValidation, input_validation_middleware_1.shortDescriptionValidation, input_validation_middleware_1.contentValidation, input_validation_middleware_1.bloggerIdValidation, input_validation_middleware_1.inputValidationMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const title = req.body.title;
    const shortDescription = req.body.shortDescription;
    const content = req.body.content;
    const bloggerId = req.body.bloggerId;
    const blogger = yield bloggers_db_repository_1.bloggersRepository.findBloggerById(bloggerId);
    if (!blogger) {
        res.status(400).send((0, getErrorResponse_1.getErrorResponse)([{ message: 'no blogger with this id', field: 'bloggerId' }]));
        return;
    }
    const newPost = yield posts_service_1.postService.createPost(title, shortDescription, content, bloggerId);
    if (newPost) {
        res.status(201).send(newPost);
    }
    else {
        res.status(400).send((0, getErrorResponse_1.getErrorResponse)([{ message: 'post is not created', field: 'bloggerId' }]));
    }
}));
exports.postsRouter.put('/:postId/like-status', input_validation_middleware_1.bearerAuth, input_validation_middleware_1.inputValidationMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const postId = req.params.postId;
    const likeStatus = req.body.likeStatus;
    console.log('LIKE_REQ = ', likeStatus);
    if (postId === undefined) {
        res.sendStatus(404);
        return;
    }
    const post = yield posts_service_1.postService.getPostById(postId.toString());
    if (!post) {
        res.sendStatus(404);
        return;
    }
    if (!req.user) {
        return res.status(500).send('NO USER');
    }
    const isLikeStatusUpdated = yield posts_service_1.postService.updateLikeStatus(postId, req.user, likeStatus);
    if (!isLikeStatusUpdated) {
        return res.status(500).send('SWW');
    }
    return res.sendStatus(204);
}));
exports.postsRouter.post('/:postId/comments', input_validation_middleware_1.bearerAuth, input_validation_middleware_1.commentContentValidation, input_validation_middleware_1.inputValidationMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const postId = req.params.postId;
    if (postId === undefined) {
        res.sendStatus(404);
        return;
    }
    const post = yield posts_service_1.postService.getPostById(postId.toString());
    if (!post) {
        res.sendStatus(404);
        return;
    }
    const content = req.body.content;
    const comment = yield comments_db_repository_1.commentsRepository.createComment(content, req.user, postId);
    res.status(201).send({
        id: comment.id,
        content: comment.content,
        userId: comment.userId,
        userLogin: comment.userLogin,
        addedAt: comment.addedAt
    });
}));
exports.postsRouter.get('/:postId/comments', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const params = (0, input_validation_middleware_1.getQueryPaginationFromQueryString)(req);
    const postId = req.params.postId;
    if (postId === undefined) {
        res.sendStatus(404);
        return;
    }
    const post = yield posts_service_1.postService.getPostById(postId.toString());
    if (!post) {
        res.sendStatus(404);
        return;
    }
    const comments = yield comments_service_1.commentsService.getCommentsByPostId(postId, params.pageNumber, params.pageSize);
    const commentsCount = yield comments_service_1.commentsService.getCommentsCountByPostId(postId);
    res.status(200).send({
        pagesCount: Math.ceil(commentsCount / params.pageSize),
        page: params.pageNumber,
        pageSize: params.pageSize,
        totalCount: commentsCount,
        items: comments
    });
}));
exports.postsRouter.get('/:id', input_validation_middleware_1.checkAuth, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    if (!id) {
        res.sendStatus(400);
        return;
    }
    console.log('REQ_POST_BY_ID');
    const user = req.user;
    const post = yield posts_service_1.postService.getPostById(id, user === null || user === void 0 ? void 0 : user._id.toString());
    console.log(post);
    if (post) {
        res.send(post);
    }
    else {
        res.sendStatus(404);
    }
}));
exports.postsRouter.put('/:id', input_validation_middleware_1.basicAuth, input_validation_middleware_1.titleValidation, input_validation_middleware_1.shortDescriptionValidation, input_validation_middleware_1.contentValidation, input_validation_middleware_1.bloggerIdValidation, input_validation_middleware_1.inputValidationMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    if (!id) {
        res.sendStatus(400);
        return;
    }
    const title = req.body.title;
    const shortDescription = req.body.shortDescription;
    const content = req.body.content;
    const bloggerId = req.body.bloggerId;
    const blogger = yield bloggers_db_repository_1.bloggersRepository.findBloggerById(bloggerId);
    if (!blogger) {
        res.status(400).send((0, getErrorResponse_1.getErrorResponse)([{ message: 'blogger is not created', field: 'bloggerId' }]));
        return;
    }
    const isUpdated = yield posts_service_1.postService.updatePost(id, title, shortDescription, content, bloggerId, blogger.name);
    if (isUpdated) {
        res.sendStatus(204);
    }
    else
        res.sendStatus(404);
}));
exports.postsRouter.delete('/:id', input_validation_middleware_1.basicAuth, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    if (!id) {
        res.sendStatus(400);
        return;
    }
    const isDeleted = yield posts_service_1.postService.deletePost(id);
    if (isDeleted) {
        res.sendStatus(204);
    }
    else
        res.sendStatus(404);
}));
//# sourceMappingURL=posts-router.js.map