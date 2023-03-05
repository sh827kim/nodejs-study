import * as http from 'http'

interface Post {
  id: string
  title: string
  content: string
}

const posts: Post[] = [
  {
    id: '1',
    title: 'def',
    content: 'fes',
  },
  {
    id: '2',
    title: 'sdfqer',
    content: 'dfserrtr',
  },
]

console.log(posts)

const server = http.createServer((req, res) => {
  const POSTS_ID_REGEX = /^\/posts\/([a-zA-Z0-9-_]+)$/

  const postIdReqexResult =
    (req.url && POSTS_ID_REGEX.exec(req.url)) || undefined

  if (req.url === '/posts' && req.method === 'GET') {
    const result = {
      posts: posts.map((post) => {
        const { id, title } = post
        return { id, title }
      }),
      totalCounts: posts.length,
    }

    res.statusCode = 200
    res.setHeader('Content-Type', 'application/json; charset=utf-8')
    res.end(JSON.stringify(result))
  } else if (postIdReqexResult && req.method === 'GET') {
    const postId = postIdReqexResult[1]

    const post = posts.find((_post) => _post.id === postId)

    if (post) {
      res.statusCode = 200
      res.setHeader('Content-Type', 'application/json; charset=utf-8')
      res.end(JSON.stringify(post))
    } else {
      res.statusCode = 404
      res.end('Not Found')
    }
  } else if (req.url === '/posts' && req.method === 'POST') {
    res.statusCode = 200
    res.end('Create post')
  } else {
    res.statusCode = 404
    res.end('Not found')
  }
})

const PORT = 4000

server.listen(PORT, () => {
  console.log('Server listening')
})
