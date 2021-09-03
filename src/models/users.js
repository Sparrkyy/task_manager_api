const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Task = require('./tasks');

const userSchema = mongoose.Schema({
	name: {
		type: String,
		required: true,
		trim: true,
	},
	email: {
		type: String,
		required: true,
		trim: true,
		validate(value) {
			if (!validator.isEmail(value)) {
				throw new Error('');
			}
		},
		unique: true,
	},
	password: {
		type: String,
		trim: true,
		required: true,
		minLength: 7,
		validate(value) {
			if (value.toLowerCase().includes('password')) {
				throw new Error(
					'Not a good password boss, cannot not include password'
				);
			}
		},
	},
	tokens: [
		{
			token: {
				type: String,
				required: true,
			},
		},
	],
});

//not stored in databse, just to establish a relationship between two fields
userSchema.virtual('tasks', {
	ref: 'Task',
	localField: '_id',
	foreignField: 'owner',
});

//working on sending back a token based on a method that is done on an instance of user as seen through methods
userSchema.methods.generateAuthToken = async function () {
	const user = this;
	const token = jwt.sign({ _id: user._id.toString() }, 'thisismynewcourse');

	user.tokens = user.tokens.concat({ token });
	await user.save();

	return token;
};

/**
 * some node special shit that runs before every time that a user is returned to hide password and tokens
 *
 * @returns the updated user object
 */
userSchema.methods.toJSON = function () {
	const user = this;
	const userObject = user.toObject();

	delete userObject.password;
	delete userObject.tokens;

	return userObject;
};

//Allows a user to login with a static method
userSchema.statics.findByCredentials = async (email, password) => {
	const user = await User.findOne({ email });

	if (!user) {
		throw new Error('unable to log in');
	}

	const isMatch = await bcrypt.compare(password, user.password);

	if (!isMatch) {
		throw new Error('Unable to log in');
	}

	return user;
};

//Hash password before saving
userSchema.pre('save', async function (next) {
	const user = this;

	if (user.isModified('password')) {
		user.password = await bcrypt.hash(user.password, 8);
	}

	next();
});

// Delete user tasks when user is removed
userSchema.pre('remove', async function (next) {
	const user = this;
	await Task.deleteMany({ owner: user._id });

	next();
});

const User = mongoose.model('User', userSchema);

module.exports = User;
