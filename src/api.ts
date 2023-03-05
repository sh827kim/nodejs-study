import fs from 'fs'
interface Post {
  id: string
  title: string
  content: string
}

export interface RequestBody {
  title: string
  content: string
}
interface ApiResponse {
  statusCode: number
  body: string | object
}
interface Route {
  url: RegExp
  method: 'GET' | 'POST'
  callback: (
    matches: string[],
    reqBody: RequestBody | undefined
  ) => Promise<ApiResponse>
}

async function getPosts(): Promise<Post[]> {
  const json = await fs.promises.readFile('database.json', 'utf-8')

  return JSON.parse(json).data
}

async function savePosts(data: Post[]) {
  const content = {
    data,
  }
  return fs.promises.writeFile(
    'database.json',
    JSON.stringify(content),
    'utf-8'
  )
}

const routes: Route[] = [
  {
    url: /^\/posts$/,
    method: 'GET',
    callback: async () => ({
      statusCode: 200,
      body: await getPosts(),
    }),
  },
  {
    url: /^\/posts\/([a-zA-Z0-9-_]+)$/,
    method: 'GET',
    callback: async (matches) => {
      const posts = await getPosts()
      if (matches) {
        const found = posts.find((post) => post.id === matches[1])
        return {
          statusCode: found ? 200 : 404,
          body: found ? found : 'Not Found',
        }
      } else {
        return {
          statusCode: 404,
          body: 'Not Found',
        }
      }
    },
  },
  {
    url: /^\/posts$/,
    method: 'POST',
    callback: async (_matched, reqBody) => {
      if (reqBody) {
        const { title, content } = reqBody
        const posts = await getPosts()
        const newPost = {
          id: reqBody.title.toLowerCase().replace(/\s/g, '_'),
          title: title,
          content: content,
        }

        posts.push(newPost)

        savePosts(posts)

        return {
          statusCode: 200,
          body: newPost,
        }
      }
      return {
        statusCode: 400,
        body: 'Illegal Body',
      }
    },
  },
]

export default function createRouter() {
  return routes
}
