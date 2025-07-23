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
    username: string, 
    email: string, 
    post: { 
        postname: string, 
        postAuthor: string, 
        postComents: string, 
        postCommenter: string, 
    }[],
    postCreatedAt: string, 
}