import {dislikeCollection, likesCollection} from './db';
import {ILikeInfo, IRepositoryLike, LikeStatus} from '../types/likeTypes';
import {ObjectId, WithId} from 'mongodb';

const NEWEST_LIKES_COUNT = 3

export const likesRepository = {
    async getLikeByParentAndUser(
        parentId: ObjectId,
        userId: ObjectId,
    ): Promise<WithId<IRepositoryLike> | null> {
        return likesCollection.findOne({parentId, userId})
    },

    async getNewestLikesDislikesByParent(
        parentId: ObjectId,
        status: LikeStatus.Like | LikeStatus.Dislike
    ): Promise<IRepositoryLike[]> {
        return likesCollection.find({parentId, status}).limit(NEWEST_LIKES_COUNT).sort({_id: -1}).toArray()
    },

    async createLikeDislike(newLike: IRepositoryLike): Promise<ObjectId | null> {
        const result = await likesCollection.insertOne(newLike)

        if (result.acknowledged) {
            return result.insertedId
        }

        return null
    },

    async removeLikeDislike(parentId: ObjectId, userId: ObjectId) {
        const result = await likesCollection.deleteOne({parentId, userId})
        return !!result.deletedCount
    },

    async getLikesDislikesCountByParent(
        parentId: ObjectId,
        status: LikeStatus.Like | LikeStatus.Dislike
    ): Promise<number> {
        return likesCollection.countDocuments({parentId, status})
    },

    async getLikesDislikesByParents(
        parentIds: ObjectId[],
    ): Promise<IRepositoryLike[]> {
        return likesCollection.find({parentId: {$in: parentIds}}).toArray()
    }
}

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
