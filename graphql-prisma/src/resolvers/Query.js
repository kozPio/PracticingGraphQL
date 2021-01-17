const Query ={
    comments(parent, args, {db}, info){
          return db.comments
      },
    users(parent, args, {db}, info){
        if(args.query){
          return db.users.filter((user)=>{
              return user.name.toLowerCase().includes(args.query.toLowerCase())
          })
        }
          return db.users
    },
    user(){
        return{
          id: '12234',
          name: 'Tadek',
          email: 'example@gmail.com',
          
        }
      
      },
      posts(parent, args, {db}, info){
          if(args.query){
              
              return db.posts.filter((post) =>{
                  const isTitleMatch = post.title.toLowerCase().includes(args.query.toLowerCase())
                  const isBodyMatch = post.body.toLowerCase().includes(args.query.toLowerCase())
                  return isBodyMatch || isTitleMatch
              })
          }

          return db.posts
      },
      post(){
        return {
            id: 'myId',
            title: 'Welcome',
            body: 'My post is here',
            published: true
        }
    }
  }


  export { Query as default}