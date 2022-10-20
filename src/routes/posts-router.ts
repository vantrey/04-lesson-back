import {Request, Response, Router} from 'express'
import {blogsRepository} from '../repositories/blog-db-repository'
import {
    basicAuth,
    bearerAuth,
    blogIdValidation, checkAuth,
    commentContentValidation,
    contentValidation,
    getQueryPaginationFromQueryString,
    inputValidationMiddleware,
    shortDescriptionValidation,
    titleValidation
} from '../middlewares/input-validation-middleware'
import {postService} from '../bll-domain/posts-service'
import {commentsRepository} from '../repositories/comments-db-repository'
import {commentsService} from '../bll-domain/comments-service'
import {getErrorResponse} from '../helpers/getErrorResponse';
import * as QueryString from 'querystring';
import {likesService} from '../bll-domain/likes-service';
import {IPostWithLikes} from '../types/postTypes';
import {body} from 'express-validator';

export const postsRouter = Router({})

postsRouter.get('/', checkAuth, async (req: Request, res: Response) => {
    const params = getQueryPaginationFromQueryString(req)
    const user = req.user
    const posts = await postService.getPosts(params.pageNumber, params.pageSize, user?._id)


    console.log('GET_POSTS__ ',posts)

    res.status(200).send(posts)
})

postsRouter.post('/', basicAuth,
    titleValidation,
    shortDescriptionValidation,
    contentValidation,
    blogIdValidation,
    inputValidationMiddleware, async (req: Request, res: Response) => {
        const title = req.body.title
        const shortDescription = req.body.shortDescription
        const content = req.body.content
        const blogId = req.body.blogId
        const blog = await blogsRepository.findblogById(blogId)
        if (!blog) {
            res.status(400).send(getErrorResponse([{message: 'no blog with this id', field: 'blogId'}]))
            return
        }
        const newPost = await postService.createPost(title, shortDescription, content, blogId)
        if (newPost) {
            res.status(201).send({...newPost, extendedLikesInfo: {
                    "likesCount": 0,
                    "dislikesCount": 0,
                    "myStatus": "None",
                    "newestLikes": []
                }})
        } else {
            res.status(400).send(getErrorResponse([{message: 'post is not created', field: 'blogId'}]))
        }
    })

postsRouter.put('/:postId/like-status', bearerAuth,
    body('likeStatus').matches(/^Like$|^Dislike$|^None$/),
    inputValidationMiddleware, async (req: Request, res: Response) => {
        const postId = req.params.postId
        const likeStatus = req.body.likeStatus
        console.log('LIKE_REQ = ', likeStatus)
        if (postId === undefined) {
            res.sendStatus(404)
            return
        }

        const post = await postService.getPostById(postId.toString())

        if (!post) {
            res.sendStatus(404)
            return
        }

        if (!req.user) {
            return res.status(500).send('NO USER')
        }

        const isLikeStatusUpdated = await postService.updateLikeStatus(postId, req.user, likeStatus)

        if (!isLikeStatusUpdated) {
            return res.status(500).send('SWW')
        }

        return res.sendStatus(204)
    })

postsRouter.post('/:postId/comments', bearerAuth, commentContentValidation,
    inputValidationMiddleware, async (req: Request, res: Response) => {
        const postId = req.params.postId
        if (postId === undefined) {
            res.sendStatus(404)
            return
        }
        const post = await postService.getPostById(postId.toString())
        if (!post) {
            res.sendStatus(404)
            return
        }
        const content = req.body.content
        const comment = await commentsRepository.createComment(content, req.user!, postId)
        res.status(201).send({
            id: comment.id,
            content: comment.content,
            userId: comment.userId,
            userLogin: comment.userLogin,
            addedAt: comment.addedAt
        })
    })
postsRouter.get('/:postId/comments', async (req: Request, res: Response) => {
    const params = getQueryPaginationFromQueryString(req)
    const postId = req.params.postId
    if (postId === undefined) {
        res.sendStatus(404)
        return
    }
    const post = await postService.getPostById(postId.toString())
    if (!post) {
        res.sendStatus(404)
        return
    }
    const comments = await commentsService.getCommentsByPostId(postId, params.pageNumber, params.pageSize)
    const commentsCount = await commentsService.getCommentsCountByPostId(postId)
    res.status(200).send({
        pagesCount: Math.ceil(commentsCount / params.pageSize),
        page: params.pageNumber,
        pageSize: params.pageSize,
        totalCount: commentsCount,
        items: comments
    })
})
postsRouter.get('/:id', checkAuth, async (req: Request, res: Response) => {
    const id = req.params.id
    if (!id) {
        res.sendStatus(400)
        return
    }
    console.log('REQ_POST_BY_ID')
    const user = req.user

    const post = await postService.getPostById(id, user?._id.toString())
    console.log(post)
    if (post) {
        res.send(post)
    } else {
        res.sendStatus(404)
    }
})
postsRouter.put('/:id', basicAuth,
    titleValidation,
    shortDescriptionValidation,
    contentValidation,
    blogIdValidation,
    inputValidationMiddleware, async (req: Request, res: Response) => {
        const id = req.params.id
        if (!id) {
            res.sendStatus(400)
            return
        }
        const title = req.body.title
        const shortDescription = req.body.shortDescription
        const content = req.body.content
        const blogId = req.body.blogId

        const blog = await blogsRepository.findblogById(blogId)
        if (!blog) {
            res.status(400).send(getErrorResponse([{message: 'blog is not created', field: 'blogId'}]))
            return
        }
        const isUpdated = await postService.updatePost(id, title, shortDescription, content, blogId, blog.name)
        if (isUpdated) {
            res.sendStatus(204)
        } else res.sendStatus(404)
    })
postsRouter.delete('/:id', basicAuth, async (req: Request, res: Response) => {
    const id = req.params.id
    if (!id) {
        res.sendStatus(400)
        return
    }
    const isDeleted = await postService.deletePost(id)
    if (isDeleted) {
        res.sendStatus(204)
    } else res.sendStatus(404)
})