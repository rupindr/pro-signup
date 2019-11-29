const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// for ensureIndex warning
mongoose.set('useCreateIndex', true);

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        lowercase: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        default: Date.now()
    }
});

UserSchema.pre('save', function(next){
    let user = this;
    bcrypt.hash(user.password, 8, (err, hash) => {
        if (err) return next(err);
        else {
            user.password = hash;
            next();
        }
    });
});

UserSchema.methods.comparePassword = function(password){
    return bcrypt.compareSync(password, this.password);
}

const User = mongoose.model('User', UserSchema);

module.exports = User;