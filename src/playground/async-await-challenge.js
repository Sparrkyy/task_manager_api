require('../db/mongoose');
const Task = require('../models/tasks');

const DeleteTaskAndCount = async (id) => {
	const findingTask = await Task.findByIdAndDelete(id);
	const count = await Task.countDocuments({ completed: false });
	return count;
};

DeleteTaskAndCount('60a12a48c06089eb70fb996f').then((count) => {
	console.log('The count is: ' + count);
});
