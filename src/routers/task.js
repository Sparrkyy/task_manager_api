const express = require('express');
const Task = require('../models/tasks');
const auth = require('../middleware/auth');
const router = new express.Router();

router.get('/tasks', auth, async (req, res) => {
	try {
		const allTasks = await Task.find({ owner: req.user._id });
		res.send(allTasks);
	} catch (e) {
		res.status(500).send('An Error Occured');
	}
});

router.get('/tasks/:id', auth, async (req, res) => {
	const _id = req.params.id;
	try {
		const fetchedTask = await Task.findOne({ _id, owner: req.user._id });
		if (!fetchedTask) {
			return res.status(404).send('Was not able to find that ID');
		}
		res.send(fetchedTask);
	} catch (e) {
		console.log(e);
		res.status(500).send('An Error Occured With the server');
	}
});

router.patch('/tasks/:id', auth, async (req, res) => {
	const validUpdateNames = ['description', 'completed'];
	const thingsToBeUpdates = Object.keys(req.body);
	const isValidUpdate = thingsToBeUpdates.every((element) => {
		return validUpdateNames.includes(element);
	});
	if (!isValidUpdate) {
		return res.status(404).send({ error: 'Not a valid update' });
	}

	try {
		const task = await Task.findOne({ _id, owner: req.user._id });
		// const task = await Task.findByIdAndUpdate(req.params.id, req.body, {
		// 	new: true,
		// 	runValidators: true,
		// 	useFindAndModify: false,
		// });
		if (!task) {
			return res.send(404).send();
		}
		res.send(task);
	} catch (e) {
		res.status(400).send(e);
	}
});

router.delete('/tasks/:id', auth, async (req, res) => {
	try {
		const deletedTask = await Task.findOneAndDelete({
			_id: req.params.id,
			owner: req.user._id,
		});

		if (!deletedTask) {
			return res.status(404).send('Counldnt find the id man');
		}
		res.send(deletedTask);
	} catch (e) {
		console.log(e);
		res.status(500).send('Error with the server bud, sorry');
	}
});

router.post('/tasks', auth, async (req, res) => {
	const tempTask = new Task({
		...req.body,
		owner: req.user._id,
	});
	try {
		const savedTask = await tempTask.save();
		res.status(201).send(savedTask);
	} catch (e) {
		res.status(400).send('Wasnt able to create a task');
	}
});

module.exports = router;
