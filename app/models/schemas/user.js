var mongoose = require('mongoose');
var bcrypt =require('bcrypt');
var SALT_WORK_FACTOR = 10;
var UserSchema = new mongoose.Schema({
    name: {
        unique: true,
        type: String
    },
    password: String,
    // 0 普通
    // 1 激活用户
    // 2 完善用户
    // >10 admin
    // >50 super admin
    role:{
        type:Number,
        default:0
    },
    meta: {
        creatAt: {
            type: Date,
            default: Date.now()
        },
        updateAt: {
            type: Date,
            default: Date.now()
        }
    },
})

UserSchema.pre('save', function(next) {
    var user=this; 
    if (this.isNew) {
        this.meta.creatAt = this.meta.updateAt = Date.now();
    } else {
        this.meta.updateAt = Date.now();
    }
    bcrypt.genSalt(SALT_WORK_FACTOR,function (err,salt) {
    	if (err) {return next(err)}
    	bcrypt.hash(user.password,salt,function (err,hash) {
    		if (err) {return next(err)}
    		user.password=hash;
            console.log(user.password);
    		next()
    	})
    })
    
})

UserSchema.methods={
    comparePassword:function (_password,cb) {
        bcrypt.compare(_password,this.password,function (err,isMatch) {
            if (err) {return cb(err)}
            cb(null,isMatch)
        })
    }
}

UserSchema.statics = {
    fetch(cb) {
        return this.find({}).sort('meta.updateAt')
            .exec(cb);
    },
    findById(id, cb) {
        return this.findOne({ _id: id }).sort('meta.updateAt')
            .exec(cb);
    }
}

module.exports = UserSchema;