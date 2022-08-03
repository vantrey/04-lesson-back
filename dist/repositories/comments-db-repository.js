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
exports.commentsRepository = void 0;
const db_1 = require("./db");
const mongodb_1 = require("mongodb");
exports.commentsRepository = {
    getComment(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return db_1.comments.findOne({ id }, { projection: { _id: 0, postId: 0 } });
        });
    },
    getCommentsByPostId(postId, pageNumber, pageSize) {
        return __awaiter(this, void 0, void 0, function* () {
            return db_1.comments.find({ postId }, { projection: { _id: 0, postId: 0 } }).skip(pageSize * (pageNumber - 1)).limit(pageSize).toArray();
        });
    },
    getCommentsCountByPostId(postId) {
        return __awaiter(this, void 0, void 0, function* () {
            return db_1.comments.countDocuments({ postId });
        });
    },
    createComment(content, user, postId) {
        return __awaiter(this, void 0, void 0, function* () {
            const comment = {
                _id: new mongodb_1.ObjectId(),
                id: new Date().getTime().toString(),
                content,
                userId: user.id,
                userLogin: user.login,
                addedAt: new Date().toISOString(),
                postId
            };
            yield db_1.comments.insertOne(comment, { forceServerObjectId: true });
            return comment;
        });
    },
    updateComment(id, content) {
        return __awaiter(this, void 0, void 0, function* () {
            const isUpdated = yield db_1.comments.findOneAndUpdate({ id }, { $set: { content } }, { upsert: true });
            return isUpdated.value !== null;
        });
    },
    deleteComment(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const isDeleted = yield db_1.comments.findOneAndDelete({ id });
            return isDeleted.value !== null;
        });
    },
};
//# sourceMappingURL=comments-db-repository.js.map