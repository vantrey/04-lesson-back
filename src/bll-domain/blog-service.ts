import {blogsRepository} from '../repositories/blog-db-repository'
import {blogType} from '../repositories/blog-repository'

export const blogService = {
    async findblogs(pageNumber:number, pageSize:number,SearchNameTerm: string | undefined) {
        const foundblogs = await blogsRepository.findblogs(pageNumber,pageSize,SearchNameTerm)
        const allblogsCount = await blogsRepository.getAllblogsCount(SearchNameTerm)
        return {
            pagesCount: Math.ceil(allblogsCount / pageSize),
            page: pageNumber,
            pageSize: pageSize,
            totalCount: allblogsCount,
            items: foundblogs
        }
    },

    async createblog(name: string, url: string): Promise<blogType | null> {
        const newblog: blogType = {
            id: new Date().getTime().toString(),
            name: name,
            youtubeUrl: url,
        }
        return  blogsRepository.createblog(newblog)
    },

    async findblogById(id: string):Promise<blogType | null> {
      return blogsRepository.findblogById(id)
    },

    async updateblog(id: string, name: string, url: string): Promise<boolean> {
        const isblog = await blogsRepository.findblogById(id)
        if(!isblog){
            return false
        }
        return blogsRepository.updateblog(id, name,url)
    },

    async deleteblog(id: string) {
        return blogsRepository.deleteblog(id)
    }

}