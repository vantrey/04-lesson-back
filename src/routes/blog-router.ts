import {Request, Response, Router} from 'express'
import {
    basicAuth, bearerAuth,
    contentValidation,
    getQueryPaginationFromQueryString,
    inputValidationMiddleware,
    nameValueValidation,
    shortDescriptionValidation,
    titleValidation,
    youtubeUrlValidation1,
    youtubeUrlValidation2
} from '../middlewares/input-validation-middleware'
import {blogService} from '../bll-domain/blog-service'
import {postService} from '../bll-domain/posts-service'
import {getErrorResponse} from '../helpers/getErrorResponse';

export const blogRouter = Router({})

blogRouter.get('/', async (req: Request, res: Response) => {
    const searchName = req.query.SearchNameTerm?.toString()
    const params = getQueryPaginationFromQueryString(req)
    const blogs = await blogService.findblogs(params.pageNumber, params.pageSize, searchName)
    res.status(200).send(blogs)
})
blogRouter.get('/:id', async (req: Request, res: Response) => {
    const id = req.params.id
    if (!id) {
        res.sendStatus(400)
        return
    }
    const blog = await blogService.findblogById(id)
    if (blog) {
        res.send(blog)
    } else {
        res.sendStatus(404)
    }

})
blogRouter.get('/:blogId/posts', bearerAuth, async (req: Request, res: Response) => {
    const blogId = req.params.blogId
    const params = getQueryPaginationFromQueryString(req)
    const blog = await blogService.findblogById(blogId)
    if (!blog) {
        res.sendStatus(404)
        return
    }
    const postsByblogId = await postService.getPostsByblogId(
        params.pageNumber,
        params.pageSize,
        blogId,
        req.user?._id
    )
    res.status(200).send(postsByblogId)
})

blogRouter.post('/', basicAuth,
    nameValueValidation,
    youtubeUrlValidation1,
    youtubeUrlValidation2,
    inputValidationMiddleware, async (req: Request, res: Response) => {
        const name = req.body.name
        const youtubeUrl = req.body.youtubeUrl
        const blog = await blogService.createblog(name, youtubeUrl)

        if (blog) {
            res.status(201).send(blog)
        } else {
            res.status(400).send(getErrorResponse([{message: 'blog is not created', field: 'blogId'}]))
        }
    })

blogRouter.post('/:blogId/posts', basicAuth,
    titleValidation,
    shortDescriptionValidation,
    contentValidation,
    inputValidationMiddleware, async (req: Request, res: Response) => {
        const blogId = req.params.blogId
        const title = req.body.title
        const shortDescription = req.body.shortDescription
        const content = req.body.content

        const blog = await blogService.findblogById(blogId)
        if (!blog) {
            res.sendStatus(404)
            return
        }

        if (blog) {
            const post = await postService.createPost(title, shortDescription, content, blogId)
            res.status(201).send(post)
        } else {
            res.status(400).send(getErrorResponse([{message: 'post is not created', field: 'postId'}]))
        }
    })

blogRouter.put('/:id', basicAuth,
    nameValueValidation,
    youtubeUrlValidation1,
    youtubeUrlValidation2,
    inputValidationMiddleware, async (req: Request, res: Response) => {
        const id = req.params.id
        if (!id) {
            res.sendStatus(400)
            return
        }
        const name = req.body.name
        const youtubeUrl = req.body.youtubeUrl

        const isUpdated = await blogService.updateblog(id, name, youtubeUrl)
        if (isUpdated) {
            res.sendStatus(204)
        } else res.sendStatus(404)
    })

blogRouter.delete('/:id', basicAuth, async (req: Request, res: Response) => {
    const id = req.params.id
    if (!id) {
        res.sendStatus(400)
        return
    }
    const isDeleted = await blogService.deleteblog(id)
    if (isDeleted) {
        res.sendStatus(204)
    } else res.sendStatus(404)
})

