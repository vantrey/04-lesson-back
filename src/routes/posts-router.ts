import {Request, Response, Router} from 'express'
import {bloggersRepository} from '../repositories/bloggers-db-repository'
import {
    basicAuth,
    bearerAuth,
    bloggerIdValidation,
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

export const postsRouter = Router({})

postsRouter.get('/', bearerAuth, async (req: Request, res: Response) => {
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
    bloggerIdValidation,
    inputValidationMiddleware, async (req: Request, res: Response) => {
        const title = req.body.title
        const shortDescription = req.body.shortDescription
        const content = req.body.content
        const bloggerId = req.body.bloggerId
        const blogger = await bloggersRepository.findBloggerById(bloggerId)
        if (!blogger) {
            res.status(400).send(getErrorResponse([{message: 'no blogger with this id', field: 'bloggerId'}]))
            return
        }
        const newPost = await postService.createPost(title, shortDescription, content, bloggerId)
        if (newPost) {
            res.status(201).send(newPost)
        } else {
            res.status(400).send(getErrorResponse([{message: 'post is not created', field: 'bloggerId'}]))
        }
    })

postsRouter.put('/:postId/like-status', bearerAuth,
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
postsRouter.get('/:id', bearerAuth, async (req: Request, res: Response) => {
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
    bloggerIdValidation,
    inputValidationMiddleware, async (req: Request, res: Response) => {
        const id = req.params.id
        if (!id) {
            res.sendStatus(400)
            return
        }
        const title = req.body.title
        const shortDescription = req.body.shortDescription
        const content = req.body.content
        const bloggerId = req.body.bloggerId

        const blogger = await bloggersRepository.findBloggerById(bloggerId)
        if (!blogger) {
            res.status(400).send(getErrorResponse([{message: 'blogger is not created', field: 'bloggerId'}]))
            return
        }
        const isUpdated = await postService.updatePost(id, title, shortDescription, content, bloggerId, blogger.name)
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