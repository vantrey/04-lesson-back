import {IRepositoryLike, LikeStatus} from '../types/likeTypes';
import {ObjectId, WithId} from 'mongodb';
import {likesRepository} from '../repositories/likes-repository';

export const likesService = {
    async getLikeByParentAndUser(parentId: ObjectId, userId: ObjectId): Promise<WithId<IRepositoryLike> | null> {
        return likesRepository.getLikeByParentAndUser(parentId, userId)
    },

    async getNewestLikesByParent(parentId: ObjectId): Promise<IRepositoryLike[]> {
        return likesRepository.getNewestLikesDislikesByParent(parentId, LikeStatus.Like)
    },

    async createLike(parentId: ObjectId, userId: ObjectId, login: string): Promise<boolean> {
        const existingLike = await this.getLikeByParentAndUser(parentId, userId)
        //already created
        if (existingLike?.status === LikeStatus.Like) {
            return true
        }

        await this.removeLikeDislike(parentId, userId);

        const createdLikeId = likesRepository.createLikeDislike({
            userId,
            parentId,
            login,
            addedAt: new Date(),
            status: LikeStatus.Like
        })

        return !!createdLikeId
    },

    async removeLikeDislike(parentId: ObjectId, userId: ObjectId): Promise<boolean> {
        return likesRepository.removeLikeDislike(parentId, userId)
    },

    async createDislike(parentId: ObjectId, userId: ObjectId, login: string): Promise<boolean> {
        const existingLike = await this.getLikeByParentAndUser(parentId, userId)
        //already created
        if (existingLike?.status === LikeStatus.Dislike) {
            return true
        }

        await this.removeLikeDislike(parentId, userId);

        const createdDislikeId = likesRepository.createLikeDislike({
            userId,
            parentId,
            login,
            addedAt: new Date(),
            status: LikeStatus.Dislike
        })

        return !!createdDislikeId
    },

    async getLikesCountByParent(parentId: ObjectId): Promise<number> {
        return likesRepository.getLikesDislikesCountByParent(parentId, LikeStatus.Like)
    },

    async getDislikesCountByParent(parentId: ObjectId): Promise<number> {
        return likesRepository.getLikesDislikesCountByParent(parentId, LikeStatus.Dislike)
    },

    async getLikesDislikesByParents(parendIds: ObjectId[]) {
        return likesRepository.getLikesDislikesByParents(parendIds)
    }
}