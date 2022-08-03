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
exports.commentsService = void 0;
const comments_db_repository_1 = require("../repositories/comments-db-repository");
exports.commentsService = {
    getComment(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield comments_db_repository_1.commentsRepository.getComment(id);
        });
    },
    getCommentsByPostId(postId, pageNumber, pageSize) {
        return __awaiter(this, void 0, void 0, function* () {
            return comments_db_repository_1.commentsRepository.getCommentsByPostId(postId, pageNumber, pageSize);
        });
    },
    getCommentsCountByPostId(postId) {
        return __awaiter(this, void 0, void 0, function* () {
            return comments_db_repository_1.commentsRepository.getCommentsCountByPostId(postId);
        });
    },
    updateCommentById(id, content) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield comments_db_repository_1.commentsRepository.updateComment(id, content);
        });
    },
    deleteComment(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield comments_db_repository_1.commentsRepository.deleteComment(id);
        });
    },
};
//# sourceMappingURL=comments-service.js.map