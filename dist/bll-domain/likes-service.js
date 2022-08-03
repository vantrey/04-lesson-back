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
exports.likesService = void 0;
const likeTypes_1 = require("../types/likeTypes");
const likes_repository_1 = require("../repositories/likes-repository");
exports.likesService = {
    getLikeByParentAndUser(parentId, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            return likes_repository_1.likesRepository.getLikeByParentAndUser(parentId, userId);
        });
    },
    getNewestLikesByParent(parentId) {
        return __awaiter(this, void 0, void 0, function* () {
            return likes_repository_1.likesRepository.getNewestLikesDislikesByParent(parentId, likeTypes_1.LikeStatus.Like);
        });
    },
    createLike(parentId, userId, login) {
        return __awaiter(this, void 0, void 0, function* () {
            const existingLike = yield this.getLikeByParentAndUser(parentId, userId);
            //already created
            if ((existingLike === null || existingLike === void 0 ? void 0 : existingLike.status) === likeTypes_1.LikeStatus.Like) {
                return true;
            }
            yield this.removeLikeDislike(parentId, userId);
            const createdLikeId = likes_repository_1.likesRepository.createLikeDislike({
                userId,
                parentId,
                login,
                addedAt: new Date(),
                status: likeTypes_1.LikeStatus.Like
            });
            return !!createdLikeId;
        });
    },
    removeLikeDislike(parentId, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            return likes_repository_1.likesRepository.removeLikeDislike(parentId, userId);
        });
    },
    createDislike(parentId, userId, login) {
        return __awaiter(this, void 0, void 0, function* () {
            const existingLike = yield this.getLikeByParentAndUser(parentId, userId);
            //already created
            if ((existingLike === null || existingLike === void 0 ? void 0 : existingLike.status) === likeTypes_1.LikeStatus.Dislike) {
                return true;
            }
            yield this.removeLikeDislike(parentId, userId);
            const createdDislikeId = likes_repository_1.likesRepository.createLikeDislike({
                userId,
                parentId,
                login,
                addedAt: new Date(),
                status: likeTypes_1.LikeStatus.Dislike
            });
            return !!createdDislikeId;
        });
    },
    getLikesCountByParent(parentId) {
        return __awaiter(this, void 0, void 0, function* () {
            return likes_repository_1.likesRepository.getLikesDislikesCountByParent(parentId, likeTypes_1.LikeStatus.Like);
        });
    },
    getDislikesCountByParent(parentId) {
        return __awaiter(this, void 0, void 0, function* () {
            return likes_repository_1.likesRepository.getLikesDislikesCountByParent(parentId, likeTypes_1.LikeStatus.Dislike);
        });
    },
    getLikesDislikesByParents(parendIds) {
        return __awaiter(this, void 0, void 0, function* () {
            return likes_repository_1.likesRepository.getLikesDislikesByParents(parendIds);
        });
    }
};
//# sourceMappingURL=likes-service.js.map