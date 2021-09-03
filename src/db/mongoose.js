const mongoose = require('mongoose');

// mongoose.connect('mongodb://127.0.0.1:27017/task-manager-api', {
// 	useNewUrlParser: true,
// 	useCreateIndex: true,
// 	useUnifiedTopology: true,
// });

mongoose.connect(
	'mongodb+srv://Ethan:POkSdc0s8UWsHx47@task-app-node-course.rlcrw.mongodb.net/Task-App-Node-Course?retryWrites=true&w=majority',
	{
		useNewUrlParser: true,
		useCreateIndex: true,
		useUnifiedTopology: true,
	}
);

// const ENV = process.env.NODE_ENV || 'development';

// mongoose
// 	.connect(
// 		'mongodb+srv://Ethan:POkSdc0s8UWsHx47@task-app-node-course.rlcrw.mongodb.net/Task-App-Node-Course?retryWrites=true&w=majority',
// 		{ useNewUrlParser: true, useUnifiedTopology: true }
// 	)
// 	.then(() => console.info(`Mongo [${ENV}] connection successfully.`))
// 	.catch((err) => {
// 		console.error(`Mongo [${ENV}] connection ERROR! `, err);
// 	});
