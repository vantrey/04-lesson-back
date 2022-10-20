import {posts} from './db'
import {PostType} from '../types/postTypes';

export const postRepository = {
    async getPosts(pageNumber:number, pageSize:number,) {
        return posts.find({},
            {projection:{_id:0}})
            .sort({createdAt: -1})
            .skip(pageSize*(pageNumber-1))
            .limit(pageSize)
            .toArray()
    },
    async getAllPostsCount(): Promise<number> {
        return posts.countDocuments()
    },
    async getPostsByblogId(pageNumber:number, pageSize:number,blogId: string): Promise<any> {
        return posts.find({blogId}, {projection:{_id:0}})
            .skip(pageSize*(pageNumber-1))
            .limit(pageSize)
            .sort({createdAt: -1})
            .toArray()
    },
    async getAllPostsByblogId(blogId: string): Promise<PostType[]> {
        return posts.find({blogId}, {projection:{_id:0}}).toArray()
    },
    async createPost(newPost: PostType) {
        const created = await posts.insertOne(newPost,{forceServerObjectId:true})
        if (created) {
            return newPost
        } else return null
    },
    async getPostById(id: string) {
        const post = await posts.findOne({id}, {projection:{_id:0}})
        if (post) {
            return post
        } else return null
    },

    async updatePost(id: string, title: string, descr: string, content: string, blogId: string, blogName: string) {
        await posts.findOneAndUpdate(
            {id},
            {$set: {title, shortDescription: descr, content, blogId, blogName}},
            {upsert: true}
        )
        return true
    },
    async updatePosts(blogId: string, blogName: string) {
        await posts.updateMany(
            {blogId},
            {$set: {blogName}},
            {upsert: true}
        )
        return true
    },

    async deletePost(id: string) {
       return posts.findOneAndDelete({id})
    },
    async deletePosts(blogId: string) {
        await posts.deleteMany({blogId})
    }
}