const express = require('express');
const User = require('../models/users');
const router = new express.Router();
const auth = require('../middleware/auth');

router.post('/users', async (req, res) => {
	const tempUser = new User(req.body);
	try {
		const userResult = await tempUser.save();
		const token = await tempUser.generateAuthToken();
		//tempUser.tokens.concat({ token });
		res.status(201).send({ userResult, token });
	} catch (e) {
		res.status(500).send();
	}
});

router.post('/users/login', async (req, res) => {
	try {
		const fetchedUser = await User.findByCredentials(
			req.body.email,
			req.body.password
		);
		//console.log(fetchedUser);
		const token = await fetchedUser.generateAuthToken();
		//console.log(token);

		res.send({ fetchedUser, token });
	} catch (e) {
		console.log(e);
		res.status(400).send();
	}
});

router.post('/users/logout', auth, async (req, res) => {
	try {
		req.user.tokens = req.user.tokens.filter(
			(token) => token.token !== req.token
		);
		await req.user.save();

		res.send();
	} catch (e) {
		res.status(500).send();
	}
});

router.post('/users/logoutAll', auth, async (req, res) => {
	try {
		req.user.tokens = [];
		await req.user.save();

		res.send();
	} catch (e) {
		res.status(500).send();
	}
});

router.get('/users/me', auth, async (req, res) => {
	res.send(req.user);
});

router.patch('/users/me', auth, async (req, res) => {
	const updates = Object.keys(req.body);
	const allowedUpdates = ['name', 'email', 'password', 'age'];
	const isValidOperation = updates.every((update) =>
		allowedUpdates.includes(update)
	);
	if (!isValidOperation) {
		return res.status(400).send({ error: 'Invalid Updates' });
	}

	try {
		const user = req.user;
		updates.forEach((update) => {
			user[update] = req.body[update];
		});
		await user.save();
		if (!user) {
			return res.status(404).send();
		}
		res.send(user);
	} catch (e) {
		res.status(400).send(e);
	}
});

router.delete('/users/me', auth, async (req, res) => {
	try {
		await req.user.remove();
		res.send(req.user);
	} catch (e) {
		res.status(500).send('Error Occured With the Server');
	}
});

module.exports = router;
