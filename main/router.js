const express = require('express')
const router = express.Router()

router.get('/', (req, res) => {
	res.json({
		message: 'Welcome to the API for Module 2!',
	})
})

module.exports = router