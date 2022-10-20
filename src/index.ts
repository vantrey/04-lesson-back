import express, {Request, Response} from 'express'
import cors from 'cors'
import bodyParser from 'body-parser'
import {blogRouter} from './routes/blog-router'
import {postsRouter} from './routes/posts-router'
import {blogs, comments, dislikeCollection, likesCollection, posts, runDb, users} from './repositories/db'
import {authRouter} from './routes/auth-router'
import {usersRouter} from './routes/users-router'
import {commentsRouter} from './routes/comments-router'
//create express app
const app = express()

app.use(cors())
app.use(bodyParser.json())


const port = process.env.PORT || 5005

app.get('/', (req: Request, res: Response) => {
    res.send('Hello, World!!!! 4 HW')
})

app.use('/auth', authRouter)
app.use('/blogs', blogRouter)
app.use('/posts', postsRouter)
app.use('/users', usersRouter)
app.use('/comments', commentsRouter)

app.delete('/testing/all-data', async (req, res) => {
    await likesCollection.deleteMany({})
    await dislikeCollection.deleteMany({})
    await posts.deleteMany({})
    await blogs.deleteMany({})
    await users.deleteMany({})
    await comments.deleteMany({})

    res.sendStatus(204)
})
//start app

const startApp = async () => {
    await runDb()
    app.listen(port, () => {
        console.log(`Example app listening on port: ${port}`)
    })
}
startApp()