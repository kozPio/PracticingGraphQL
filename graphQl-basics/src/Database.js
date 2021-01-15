const users =[
    {
        id: '1',
        name: 'Andrew',
        email: 'andrew@example.com',
        age: 27
    },
    {
        id: '2',
        name: 'Jason',
        email: 'jasonw@example.com',
        age: 21
    },
    {
        id: '3',
        name: 'Thomas',
        email: 'thomas@example.com',
        age: 12
    },
    {
        id: '4',
        name: 'Stew',
        email: 'steww@example.com',
        age: 30
    }]


const posts =[
        {
            id: '1',
            title: 'the Post',
            body: 'body 1',
            published: true,
            author: '1'
        },
        {
            id: '2',
            title: 'btha posti',
            body: 'body 2',
            published: true,
            author: '1'
        },
        {
            id: '3',
            title: 'thus post',
            body: 'body 3',
            published: false,
            author: '2'
        },
        {
            id: '4',
            title: 'le post',
            body: 'body 4',
            published: false,
            author: '3'
        }]



const comments = [
    {
        id: '1',
        text: "My first comment",
        author: '3',
        post: '2'
    },
    {
        id: '2',
        text: "This is great",
        author: '3',
        post: '3'

    },
    {
        id: '3',
        text: "Not bad for a comment",
        author: '4',
        post: '1'
    },
    {
        id: '4',
        text: "Come on you can do better",
        author: '1',
        post: '1'
    },
    
]


const db = {
    posts,
    users,
    comments
}

export {db as default}