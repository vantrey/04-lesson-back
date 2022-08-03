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
exports.likesRepository = void 0;
const db_1 = require("./db");
const NEWEST_LIKES_COUNT = 3;
exports.likesRepository = {
    getLikeByParentAndUser(parentId, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            return db_1.likesCollection.findOne({ parentId, userId });
        });
    },
    getNewestLikesDislikesByParent(parentId, status) {
        return __awaiter(this, void 0, void 0, function* () {
            return db_1.likesCollection.find({ parentId, status }).limit(NEWEST_LIKES_COUNT).sort({ _id: -1 }).toArray();
        });
    },
    createLikeDislike(newLike) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield db_1.likesCollection.insertOne(newLike);
            if (result.acknowledged) {
                return result.insertedId;
            }
            return null;
        });
    },
    removeLikeDislike(parentId, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield db_1.likesCollection.deleteOne({ parentId, userId });
            return !!result.deletedCount;
        });
    },
    getLikesDislikesCountByParent(parentId, status) {
        return __awaiter(this, void 0, void 0, function* () {
            return db_1.likesCollection.countDocuments({ parentId, status });
        });
    },
    getLikesDislikesByParents(parentIds) {
        return __awaiter(this, void 0, void 0, function* () {
            return db_1.likesCollection.find({ parentId: { $in: parentIds } }).toArray();
        });
    }
};
/*
export const dislikesRepository = {
    async getLikeByParentAndUser(parentId: ObjectId, userId: ObjectId): Promise<WithId<IRepositoryLike> | null> {
        return dislikeCollection.findOne({parentId, userId})
    },

    async createDislike(newLike: IRepositoryLike): Promise<ObjectId | null> {
        const result = await dislikeCollection.insertOne(newLike)

        if (result.acknowledged) {
            return result.insertedId
        }

        return null
    },

    async removeLike(parentId: ObjectId, userId: ObjectId): Promise<boolean> {
        const result = await dislikeCollection.deleteOne({parentId, userId})
        return !!result.deletedCount
    }
}*/
//# sourceMappingURL=likes-repository.js.map