import {bloggersRepository} from './bloggers-repository'
import {PostType} from '../types/postTypes';

let posts: Array<PostType> = [
]
export const postRepository ={
    async getPosts(){
        const newPosts = posts.map(p => {
           let bloggerName =  bloggersRepository.findBloggerById(p.bloggerId)?.name
            return {...p, bloggerName}
        })
       return newPosts
    },
    async createPost(title:string, descr: string, content: string, bloggerId: string){
        const postsLength = posts.length
        const newPost: PostType = {
            id: new Date().getTime().toString(),
            title,
            shortDescription: descr,
            content,
            bloggerId,
            addedAt: new Date()
        }
        posts.push(newPost)
        if (postsLength < posts.length) {
            const blogger = await bloggersRepository.findBloggerById(newPost.bloggerId)
            return {...newPost, bloggerName: blogger?.name}
        } else return null
    },
    async getPostById(id:string){
        const post = posts.find(p => p.id === id)
        if (post) {
            const blogger = await bloggersRepository.findBloggerById(post.bloggerId)
            if(blogger){
                return {...post, bloggerName: blogger?.name}
            } else return null
        } else return null
    },
    async updatePost(id:string,title:string, descr: string, content: string, bloggerId: string){
        const post = posts.find(p => p.id === id)
        if (post) {
            posts = posts.map(p => {
                if (p.id === id) {
                    return {...p, title, bloggerId, content, shortDescription:descr}
                } else return p
            })
            return true
        } else return false
    },
    async deletePost(id:string){
        let newPosts = posts.filter(p => p.id !== id)
        if (newPosts.length < posts.length) {
            posts = newPosts
            return true
        } else {
            return false
        }
    }
}