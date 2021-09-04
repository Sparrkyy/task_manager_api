const express = require('express');
const dotenv = require('dotenv')
dotenv.config()
require('./db/mongoose');
const User = require('./models/users');
const Task = require('./models/tasks');
const userRouter = require('./routers/user');
const taskRouter = require('./routers/task');

const app = express();
const PORT = process.env.PORT || 3000;

// app.use((req, res, next) => {
// 	if (req.method === 'GET'){

// 	}
// 	console.log(req.method, req.path);
// 	next();
// });
// app.use((req, res, next) => {
// 	res.status(503).send('The server is down for maintence');
// });

app.use(express.json());
app.use(userRouter);
app.use(taskRouter);

app.listen(PORT, () => {
	console.log('server is up on port ' + PORT);
});
