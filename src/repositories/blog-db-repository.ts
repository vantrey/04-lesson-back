import {blogs} from './db'
import {blogType} from './blog-repository'
import {postRepository} from './posts-db-repository'

export const blogsRepository = {

    async findblogs(pageNumber:number, pageSize:number,SearchNameTerm: string | undefined) {
        let filter = {}
        if (SearchNameTerm) {
            filter = {name: {$regex: SearchNameTerm}}
        }
       return blogs.find(filter, {projection:{_id:0}}).skip(pageSize*(pageNumber-1)).limit(pageSize).toArray()
    },

    async getAllblogsCount(SearchNameTerm: string | undefined ): Promise<number> {
        let filter = {}
        if (SearchNameTerm) {
            filter = {name: {$regex: SearchNameTerm}}
        }
        return blogs.countDocuments(filter)

    },
    async createblog(newblog: blogType): Promise<blogType | null> {
        const created = await blogs.insertOne(newblog, {forceServerObjectId:true})
        if (created) {
            return newblog
        } else {
            return null
        }
    },

    async findblogById(id: string) {
        return  blogs.findOne({id},{projection:{_id:0}})
    },

    async updateblog(id: string, name: string, url: string) {
        const myblog = await blogs.findOneAndUpdate(
            {id},
            {$set: {name, youtubeUrl: url}},
            {upsert: true})
        const posts = await postRepository.getAllPostsByblogId(id)
        if (posts.length){
            await postRepository.updatePosts(id, name)
        }
        return !!myblog
    },

    async deleteblog(id: string) {
        await postRepository.deletePosts(id)
        const deleted = await blogs.deleteOne({id})
        return deleted.deletedCount > 0;
    }
}