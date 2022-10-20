import {blogRepository} from './blog-repository'
import {PostType} from '../types/postTypes';

let posts: Array<PostType> = [
]
export const postRepository ={
    async getPosts(){
        const newPosts = posts.map(p => {
           let blogName =  blogRepository.findblogById(p.blogId)?.name
            return {...p, blogName}
        })
       return newPosts
    },
    async createPost(title:string, descr: string, content: string, blogId: string){
        const postsLength = posts.length
        const newPost: PostType = {
            id: new Date().getTime().toString(),
            title,
            shortDescription: descr,
            content,
            blogId,
            createdAt: new Date().toISOString()
        }
        posts.push(newPost)
        if (postsLength < posts.length) {
            const blog = await blogRepository.findblogById(newPost.blogId)
            return {...newPost, blogName: blog?.name}
        } else return null
    },
    async getPostById(id:string){
        const post = posts.find(p => p.id === id)
        if (post) {
            const blog = await blogRepository.findblogById(post.blogId)
            if(blog){
                return {...post, blogName: blog?.name}
            } else return null
        } else return null
    },
    async updatePost(id:string,title:string, descr: string, content: string, blogId: string){
        const post = posts.find(p => p.id === id)
        if (post) {
            posts = posts.map(p => {
                if (p.id === id) {
                    return {...p, title, blogId, content, shortDescription:descr}
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