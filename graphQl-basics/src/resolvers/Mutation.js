import uuidv4 from 'uuid/v4'

const Mutation = {
    createUser(parent,args, {db}, info){
        const emailTaken = db.users.some(user=>  user.email === args.data.email)
        if(emailTaken){
            throw new Error('Email taken.')
        }

        const user = {
            id: uuidv4(),
            ...args.data
        }

        db.users.push(user)

        return user
    },
    deleteUser(parent, args, {db}, info){
        const userIndex = db.users.findIndex(user=> user.id === args.id)

        if(userIndex === -1){
            throw new Error('User not found')
        }

        const deletedUser = db.users.splice(userIndex, 1)

        db.posts = db.posts.filter(post =>{
            const match = post.author === args.id

            if (match){
                db.comments = db.comments.filter( comment =>comment.post != post.id)
            }

            return !match
        })
        db.comments = db.comments.filter(comment => comment.author !== args.id)

        return deletedUser[0]
    },
    updateUser(parent, args, {db}, info){
        const {id, data} = args
        const user = db.users.find(user => user.id === id)

        if(!user){
            throw new Error('User not found')
        }

        if (typeof data.email === 'string'){
            const emailTaken = db.users.some(user => user.email === data.email)

            if(emailTaken){
                throw new Error('Email already taken')
            }

            user.email = data.email
        }

        if(typeof data.name === 'string'){
             user.name = data.name
        }

        if (typeof data.age !== 'undefined'){
            user.age = data.age
        }

        return user

    },
    createPost(parent, args, {db, pubsub}, info){
        const userExists = db.users.some(user => user.id === args.data.author)

        if(!userExists){
            throw new Error('User not found')
        }

        const user = db.users.find(user => user.id === args.data.author)
        const post = {
            id: uuidv4(),
            ...args.data
        }

        db.posts.push(post)
        if(post.published){
            pubsub.publish(`post`, {
                post: {
                    mutation: 'CREATED',
                    data: post
                }
            })
        }
        

        return post
    },
    deletePost(parent, args, {db, pubsub}, info){
        const postIndex = db.posts.findIndex(post => post.id == args.id)

        if(postIndex === -1){
            throw new Error('Post was not found')
        }

        const [post] = db.posts.splice(postIndex, 1)

        db.comments = db.comments.filter(comment => comment.post !== args.id)

        if(post.published){
            pubsub.publish('post', {
                post: {
                    mutation: 'DELETED',
                    data: post
                }
            })
        }

        return post

    },
    updatePost(parent, args, {db, pubsub}, info){
        const post = db.posts.find( post => post.id === args.id)
        const originalPost = { ...post}

        if(!post) {
            throw new Error('post does not exists')
        }
         if(typeof args.data.title === "string"){
             post.title = args.data.title
         }
         if(typeof args.data.body === 'string'){
             post.body = args.data.body
         }

         if(typeof args.data.published === 'boolean'){
            post.published = args.data.published

            if(originalPost.published && !post.published){
                pubsub.publish('post', {
                    post:{
                        mutation: 'DELETED',
                        data: originalPost
                    }
                })
            }else if (!originalPost.published && post.published){
                pubsub.publish('post', {
                    post:{
                        mutation: 'CREATED',
                        data: post
                    }
                })
            }
        } else if (post.published){
            pubsub.publish('post', {
                post:{
                    mutation: 'UPDATED',
                    data: post
                }
            })
        }

        return post

    },
    createComment(parent, args, {db, pubsub}, info){
        const postExsist =  db.posts.some( post => post.id === args.data.post && post.published)
        const userExists = db.users.some(user => user.id === args.data.author)
        if(!postExsist){
            throw new Error('Post does not exsist')
        }
        if(!userExists){
            throw new Error('User does not exsist')
        }

        const comment = {
            id: uuidv4(),
            ...args.data
        }

        db.comments.push(comment)

        pubsub.publish(`comment ${args.data.post}`, {
            comment: {
                mutation: 'CREATED',
                data: comment
            }
        })

        return comment
    },
    deleteComment(parent, args, {db, pubsub}, info){
        const commentIndex = db.comments.findIndex(comment => comment.id === args.id)

        if( commentIndex === -1){
            throw new Error('Coment not found')  
        }

        const [deletedComment] = db.comments.splice(commentIndex,1)

        pubsub.publish(`comment ${args.id}`, {
            comment: {
                mutation: 'DELETED',
                data: deletedComment
            }
        })

        return deletedComment
    },
    updateComment(parent, args, {db, pubsub}, info){
        const comment = db.comments.find( comment => comment.id === args.id)

        if(!comment) {
            throw new Error('comment does not exists')
        }
         if(typeof args.data.text === "string"){
             comment.text = args.data.text

             pubsub.publish(`comment ${args.id}`, {
                comment: {
                    mutation: 'UPDATED',
                    data: comment
                }
            })
         }
        

        return comment

    },
}

export { Mutation as default}