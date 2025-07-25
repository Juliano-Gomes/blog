export type userRowAtributes = {
    id: string,
    name: string,
    email: string,
    passwd: string,
    created_at: string,
    title: string,
    author: string,
    imagepost: string,
    commenter: string,
    post_id: string,
    comment: string
}

export type betterResponse={ 
    postname: string, 
    postID:string,
    postAuthor: string, 
    postimage: string, 
    postComents: string, 
    postCommenter: string, 
    postCreatedAt: string, 
}

export type getPostType ={
    id: string,
    title: string,
    author: string,
    imagepost: string,
    created_at: string,
    commenter: string,
    post_id: string,
    comment: string
}