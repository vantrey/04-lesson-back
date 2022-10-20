import {postRepository} from '../repositories/posts-db-repository'
import {blogsRepository} from '../repositories/blog-db-repository'
import {IPostWithLikes, PostType} from '../types/postTypes';
import {INewestLike, LikeStatus} from '../types/likeTypes';
import {likesService} from './likes-service';
import {ObjectId} from 'mongodb';
import {UserType} from '../repositories/users-db-repository';

export const postService = {
    async getPosts(pageNumber: number, pageSize: number, userId?: ObjectId) {
        const foundPosts = await postRepository.getPosts(pageNumber, pageSize)
        const allPostsCount = await postRepository.getAllPostsCount()

        const postsIds = foundPosts.map((post) => new ObjectId(post.id))

        const likesByPosts = await likesService.getLikesDislikesByParents(postsIds);

        console.log('likesByPosts = ', likesByPosts)

        const postsWithLikes: IPostWithLikes[] = foundPosts.map((post) => {
            const accordingLikes = likesByPosts.filter((like) =>
                (like.status === LikeStatus.Like) && (like.parentId.toString() === post.id)).reverse()

            const accordingDislikes = likesByPosts.filter((like) =>
                (like.status === LikeStatus.Dislike) && (like.parentId.toString() === post.id))

            const newestLikes: INewestLike[] = accordingLikes.slice(0, 3).map((like) => ({
                addedAt: like.addedAt,
                userId: like.userId.toString(),
                login: like.login,
            }))

            let myStatus = LikeStatus.None

            if (userId) {
                const myStatusLike = accordingLikes.find(
                    (like) => like.userId.toString() === userId.toString()
                )?.status

                const myStatusDislike = accordingDislikes.find(
                    (like) => like.userId.toString() === userId.toString()
                )?.status

                myStatus = myStatusLike || myStatusDislike || LikeStatus.None
            }

            return {
                ...post,
                extendedLikesInfo: {
                    likesCount: accordingLikes.length,
                    dislikesCount: accordingDislikes.length,
                    myStatus,
                    newestLikes
                }
            }
        })

        console.log('postsWithLikes', postsWithLikes)

        return {
            pagesCount: Math.ceil(allPostsCount / pageSize),
            page: pageNumber,
            pageSize: pageSize,
            totalCount: allPostsCount,
            items: postsWithLikes
        }
    },
    async getPostsByblogId(pageNumber: number, pageSize: number, blogId: string, userId?: ObjectId): Promise<any> {
        const allPostsByblogId = await postRepository.getAllPostsByblogId(blogId)
        const foundPosts = await postRepository.getPostsByblogId(pageNumber, pageSize, blogId)
        const postsIds = foundPosts.map((post: any) => new ObjectId(post.id))

        const likesByPosts = await likesService.getLikesDislikesByParents(postsIds);

        console.log('likesByPosts = ', likesByPosts)

        const postsWithLikes: IPostWithLikes[] = foundPosts.map((post: any) => {
            const accordingLikes = likesByPosts.filter((like) =>
                (like.status === LikeStatus.Like) && (like.parentId.toString() === post.id)).reverse()

            const accordingDislikes = likesByPosts.filter((like) =>
                (like.status === LikeStatus.Dislike) && (like.parentId.toString() === post.id))

            const newestLikes: INewestLike[] = accordingLikes.slice(0, 3).map((like) => ({
                addedAt: like.addedAt,
                userId: like.userId.toString(),
                login: like.login,
            }))

            let myStatus = LikeStatus.None

            if (userId) {
                const myStatusLike = accordingLikes.find(
                    (like) => like.userId.toString() === userId.toString()
                )?.status

                const myStatusDislike = accordingDislikes.find(
                    (like) => like.userId.toString() === userId.toString()
                )?.status

                myStatus = myStatusLike || myStatusDislike || LikeStatus.None
            }

            return {
                ...post,
                extendedLikesInfo: {
                    likesCount: accordingLikes.length,
                    dislikesCount: accordingDislikes.length,
                    myStatus,
                    newestLikes
                }
            }
        })

        console.log('postsWithLikes', postsWithLikes)

        return {
            pagesCount: Math.ceil(allPostsByblogId.length / pageSize),
            page: pageNumber,
            pageSize: pageSize,
            totalCount: allPostsByblogId.length,
            items: postsWithLikes
        }

    },
    async getAllPostsByblogId(blogId: string): Promise<PostType[]> {
        return await postRepository.getAllPostsByblogId(blogId)
    },
    async createPost(title: string, descr: string, content: string, blogId: string): Promise<IPostWithLikes | null> {
        const blog = await blogsRepository.findblogById(blogId)
        const newPost: PostType = {
            id: new ObjectId().toString(),
            createdAt: new Date().toISOString(),
            title,
            shortDescription: descr,
            content,
            blogId,
            blogName: blog?.name
        }

        const createdPost: PostType | null = await postRepository.createPost(newPost)

        if (createdPost) {
            return {
                ...createdPost,
                extendedLikesInfo: {
                    likesCount: 0,
                    dislikesCount: 0,
                    myStatus: LikeStatus.None,
                    newestLikes: [],
                }
            }
        }

        return null
    },

    async getPostById(postId: string, userId?: string): Promise<IPostWithLikes | null> {
        const post = await postRepository.getPostById(postId)

        if (!post) {
            return null
        }

        const likesCount = await likesService.getLikesCountByParent(new ObjectId(postId))
        const dislikesCount = await likesService.getDislikesCountByParent(new ObjectId(postId))
        const newestRepositoryLikes = await likesService.getNewestLikesByParent(new ObjectId(postId))
        console.log(likesCount, dislikesCount)
        const newestLikes: INewestLike[] = newestRepositoryLikes.map((like) => ({
            userId: like.userId.toString(),
            addedAt: like.addedAt,
            login: like.login
        }))

        let myStatus = LikeStatus.None

        if (userId) {
            const userLike = await likesService.getLikeByParentAndUser(new ObjectId(postId), new ObjectId(userId))
            myStatus = userLike?.status || LikeStatus.None
        }

        return {
            ...post,
            extendedLikesInfo: {
                likesCount,
                dislikesCount,
                myStatus,
                newestLikes
            }
        }
    },

    async updateLikeStatus(postId: string, user: UserType, status: LikeStatus): Promise<boolean> {
        if (!user) {
            return false
        }

        switch (status) {
            case LikeStatus.Like:
                return await likesService.createLike(new ObjectId(postId), user._id, user.login)

            case LikeStatus.Dislike:
                return likesService.createDislike(new ObjectId(postId), user._id, user.login)

            case LikeStatus.None:
                return likesService.removeLikeDislike(new ObjectId(postId), user._id)

            default:
                return false

        }
    },

    async updatePost(id: string, title: string, descr: string, content: string, blogId: string, blogName: string) {
        const post = await postRepository.getPostById(id)
        if (!post) {
            return false
        }
        return await postRepository.updatePost(id, title, descr, content, blogId, blogName)
    },

    async deletePost(id: string) {
        const res = await postRepository.deletePost(id)
        // console.log(res.value) //null or object
        // console.log(res.ok) // always 1
        return res.value !== null
    }
}