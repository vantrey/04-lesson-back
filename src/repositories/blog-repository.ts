export type blogType = { id: string, name: string, youtubeUrl: string }
let blogs = [
    {id: '1', name: 'blog1', youtubeUrl: 'youtube1.com'},
    {id: '2', name: 'blog2', youtubeUrl: 'youtube2.com'},
    {id: '3', name: 'blog3', youtubeUrl: 'youtube3.com'}
]

export const blogRepository = {
    async findblogs(searchTerm: string|undefined): Promise<Array<blogType>>{
        if (searchTerm) {
            return blogs.filter(b => b.name.indexOf(searchTerm)> -1 )
        }else {
            return blogs
        }
    },
    createblog(name: string, url: string) {
        const blogLength = blogs.length
        const newblog: blogType = {
            id: new Date().getTime().toString(),
            name: name,
            youtubeUrl:url,
        }
        blogs.push(newblog)
        if (blogLength < blogs.length) {
           return newblog
        } else {
           return null
        }
    },
    findblogById(id: string){
        const blog = blogs.find(b => b.id === id)
        if (blog) {
            return blog
        } else {
            return null
        }
    },
    updateblog(id: string, name: string, url: string){
        const blog = blogs.find(b => b.id === id)
        if (blog) {
            blogs = blogs.map(b => {
                if (b.id === id) {
                    return {...b, name: name, youtubeUrl:url}
                } else return b
            })
            return true
        } else return false
    },
    deleteblog (id: string) {
        if (id) {
            let newblogs = blogs.filter(b => b.id !== id)
            if (newblogs.length < blogs.length) {
                blogs = newblogs
                return true
            }
        } else return false
    }
}