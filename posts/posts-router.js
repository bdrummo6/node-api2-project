const express = require('express')
const db = require('../data/db.js')
const router = express.Router()

router.get('/posts', (req, res) => {
	db.find()
		.then((posts) => {
			res.status(200).json(posts)
		})
		.catch((error) => {
			console.log(error)
			res.status(500).json({
				error: 'The posts information could not be retrieved.'
			})
		})
})

router.get('/posts/:id', (req, res) => {
	db.findById(req.params.id)
		.then((post) => {
			if (post[0]) {
				res.status(200).json(post[0])
			} else {
				res.status(404).json({
					message: 'The post with the specified ID does not exist.'
				})
			}
		})
		.catch((error) => {
			console.log(error)
			res.status(500).json({
				error: 'The post information could not be retrieved.'
			})
		})
})

router.post('/posts', (req, res) => {
	if (!req.body.title || !req.body.contents) {
		return res.status(400).json({
      errorMessage: 'Please provide title and contents for the post.'
    })
	}

	db.insert(req.body)
		.then((postId) => {
      return db.findById(postId.id)
    })
    .then((post) => {
			res.status(201).json(post)
		})
		.catch((error) => {
			console.log(error)
			res.status(500).json({
				error: 'There was an error while saving the post to the database'
			})
		})
})

router.put('/posts/:id', (req, res) => {
	if (!req.body.title || !req.body.contents) {
		return res.status(400).json({
			errorMessage: 'Please provide title and contents for the post.'
		})
	}

	db.update(req.params.id, req.body)
    .then((postId) => {
      return db.findById(postId.id)
    })
    .then((post) => {
      if (post) {
				res.status(200).json(post)
			} else {
				res.status(404).json({
					message: 'The post with the specified ID does not exist.'
				})
			}
    })
		.catch((error) => {
			console.log(error)
			res.status(500).json({
				error: 'The post information could not be modified.'
      })
		})
})

router.delete('/posts/:id', (req, res) => {
	db.remove(req.params.id)
		.then((count) => {
			if (count > 0) {
				res.status(200).json({
					message: 'The post has been removed',
				})
			} else {
				res.status(404).json({
					message: 'The post with the specified ID does not exist.'
				})
			}
		})
		.catch((error) => {
			console.log(error)
			res.status(500).json({
				error: 'The post could not be removed'
			})
		})
})

router.get('/posts/:id/comments', (req, res)=> {
  db.findById(req.params.id)
    .then((post)=> {
      if (!post) {
        res.status(404).json({
          message: 'The post with the specified ID does not exist.'
        })
      } else {
        return db.findPostComments(req.params.id)
      }
    })
    .then((comments)=>{
      res.status(200).json(comments)
    })
    .catch((error) => {
			console.log(error)
			res.status(500).json({
				error: 'The comments information could not be retrieved.'
			})
		})
})

router.get('/posts/:id/comments/:commentId', (req, res)=> {
  db.findCommentById(req.params.commentId)
    .then((comment)=> {
      if (!comment) {
        res.status(404).json({
          errorMessage: 'Comment not found'
        })
      } else {
        res.status(200).json(comment)
      }
    })
    .catch((error) => {
			console.log(error)
			res.status(500).json({
				errorMessage: 'Error collecting the post comment',
			})
		})
})

router.post('/posts/:id/comments', (req, res)=> {
  db.findById(req.params.id)
    .then((post)=> {
      if (!post) {
        res.status(404).json({
          message: 'The post with the specified ID does not exist.'
        })
      } else if (req.body.text) {
        if (req.body.post_id === req.params.id) {
          return db.insertComment(req.body)
        } else {
          req.body.post_id = req.params.id
					return db.insertComment(req.body)
        }
      } else {
        res.status(400).json({ errorMessage: 'Please provide text for the comment.' })
      }
    })
    .then((commentId)=>{
      return db.findCommentById(commentId.id)
    })
    .then((comment)=>{
      res.status(200).json(comment)
    })
    .catch((error) => {
			console.log(error)
			res.status(500).json({
				error: 'There was an error while saving the comment to the database'
			})
		})
})

module.exports = router