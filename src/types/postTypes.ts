import {BloggerType} from '../repositories/bloggers-repository';
import {IExpectedLikeInfo} from './likeTypes';

export interface IPostWithLikes extends PostType {
    extendedLikesInfo: IExpectedLikeInfo
}

export type PostType = {
    addedAt: Date,
    id: string,
    title: string,
    shortDescription: string,
    content: string,
    bloggerId: BloggerType['id'],
    bloggerName?: string
}