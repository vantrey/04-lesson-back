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
exports.commentsRouter = void 0;
const express_1 = require("express");
const comments_service_1 = require("../bll-domain/comments-service");
const input_validation_middleware_1 = require("../middlewares/input-validation-middleware");
exports.commentsRouter = (0, express_1.Router)({});
exports.commentsRouter.get('/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    if (!id) {
        res.send(404);
        return;
    }
    const comment = yield comments_service_1.commentsService.getComment(id);
    if (!comment) {
        res.sendStatus(404);
    }
    else
        res.status(200).send(comment);
}));
exports.commentsRouter.put('/:commentId', input_validation_middleware_1.bearerAuth, input_validation_middleware_1.commentContentValidation, input_validation_middleware_1.inputValidationMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const commentId = req.params.commentId;
    if (!commentId) {
        res.send(404);
        return;
    }
    const comment = yield comments_service_1.commentsService.getComment(commentId);
    if (!comment) {
        res.sendStatus(404);
        return;
    }
    if ((comment === null || comment === void 0 ? void 0 : comment.userId) !== ((_a = req.user) === null || _a === void 0 ? void 0 : _a.id)) {
        res.sendStatus(403);
        return;
    }
    const content = req.body.content;
    const isUpdated = yield comments_service_1.commentsService.updateCommentById(commentId, content);
    if (isUpdated) {
        res.sendStatus(204);
    }
    else
        res.sendStatus(404);
}));
exports.commentsRouter.delete('/:commentId', input_validation_middleware_1.bearerAuth, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _b;
    const commentId = req.params.commentId;
    if (!commentId) {
        res.send(404);
        return;
    }
    const comment = yield comments_service_1.commentsService.getComment(commentId);
    if (!comment) {
        res.sendStatus(404);
        return;
    }
    if ((comment === null || comment === void 0 ? void 0 : comment.userId) !== ((_b = req.user) === null || _b === void 0 ? void 0 : _b.id)) {
        res.sendStatus(403);
        return;
    }
    const isDeleted = yield comments_service_1.commentsService.deleteComment(commentId);
    if (isDeleted) {
        res.sendStatus(204);
    }
    else
        res.status(404);
}));
//# sourceMappingURL=comments-router.js.map