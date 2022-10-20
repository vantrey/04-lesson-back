import {blogType} from '../repositories/blog-repository';
import {IExpectedLikeInfo} from './likeTypes';

export interface IPostWithLikes extends PostType {
    extendedLikesInfo: IExpectedLikeInfo
}

export type PostType = {
    createdAt: string,
    id: string,
    title: string,
    shortDescription: string,
    content: string,
    blogId: blogType['id'],
    blogName?: string
}