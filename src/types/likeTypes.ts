import {ObjectId} from 'mongodb';

export enum LikeStatus {
    None = 'None',
    Like = 'Like',
    Dislike = 'Dislike',
}

export interface ILikeInfo {
    likesCount: number,
    dislikesCount: number,
    myStatus: LikeStatus,
}

export interface IExpectedLikeInfo {
    likesCount: number,
    dislikesCount: number,
    myStatus: LikeStatus,
    newestLikes: INewestLike[]
}

export interface INewestLike {
    addedAt: Date,
    userId: string,
    login: string
}

export interface IRepositoryLike {
    addedAt: Date,
    userId: ObjectId,
    login: string,
    parentId: ObjectId
    status: LikeStatus.Like | LikeStatus.Dislike
}