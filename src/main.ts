import * as http from 'http'
import createRouter, { RequestBody } from './api'

const routes = createRouter()

const server = http.createServer((req, res) => {
  async function main() {
    const matchedRoute = routes.find((route) => {
      if (
        req.url &&
        req.method &&
        route.url.test(req.url) &&
        req.method === route.method
      ) {
        return route
      }
      return
    })

    if (!req.url || !matchedRoute) {
      res.statusCode = 404
      res.end('Not Found')
      return
    }

    const regexResult = matchedRoute.url.exec(req.url)

    if (!regexResult) {
      res.statusCode = 404
      res.end('Not Found')
      return
    }

    const reqBody =
      ((req.headers['content-type'] === 'application/json' &&
        (await new Promise((resolve, reject) => {
          req.setEncoding('utf-8')
          req.on('data', (data) => {
            try {
              resolve(JSON.parse(data))
            } catch {
              reject(new Error('Illegal Request'))
            }
          })
        }))) as RequestBody) || undefined

    console.log(reqBody)

    const result = await matchedRoute.callback(regexResult, reqBody)
    res.statusCode = result.statusCode
    if (typeof result.body === 'string') {
      res.end(result.body)
    } else {
      res.end(JSON.stringify(result.body))
    }
  }

  main()
})

const PORT = 4000
server.listen(PORT, () => {
  console.log('Server listening')
})
