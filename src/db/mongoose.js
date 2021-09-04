const mongoose = require('mongoose');




mongoose.connect(
	process.env.CONNECTION_STRING,
	{
		useNewUrlParser: true,
		useCreateIndex: true,
		useUnifiedTopology: true,
	}
);

