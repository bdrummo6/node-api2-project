
const express = require('express')

const postsRouter = require('./posts/posts-router')
const mainRouter = require('./main/router.js')

const port = process.env.PORT || 8000;

const server = express()

server.use(express.json())
server.use(postsRouter)
server.use(mainRouter)

server.listen(port, () => {
	console.log(`Server running at http://localhost:${port}`)
})