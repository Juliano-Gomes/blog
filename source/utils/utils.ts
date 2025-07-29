import { betterResponse, getPostType} from "../types/user.auth";

export const ORDER_BY_ID=(data:betterResponse[],ids:string[])=>{
    const res :any[] = []
    ids.forEach((element,index)=>{
        const i = data.filter(n=>n.postID === element)
        const comments = i.map(e=>{
            return{
                commenter:e.postCommenter,
                comment:e.postComents
            }
        })
        res.push({
            post:{
                description:i[0].postname,
                id:i[0].postID,
                author:i[0].postAuthor,
                image:i[0].postimage
            },
            comments:[...comments]
        })
    })
    return res
}


export const ORDER_BY_ID_Post=(data:getPostType[],ids:string[])=>{
    const res :any[] = []
    ids.forEach((element,index)=>{
        const i = data.filter(n=>n.post_id === element)
        const comments = i.map(e=>{
            return{
                commenter:e.commenter,
                comment:e.comment
            }
        })
        res.push({
            post:{
                description:i[0].description,
                id:i[0].post_id,
                author:i[0].author,
                image:i[0].imagepost
            },
            comments:[...comments]
        })
    })
    return res
}