var mongoose =  require('mongoose');
var Schema= mongoose.Schema;
var ObjectId = Schema.Types.ObjectId;
var CatetorySchema = new mongoose.Schema({

	name:String,
	movies:[{type:ObjectId,ref:'Movie'}],
	meta:{
		creatAt:{
			type:Date,
			default:Date.now()
		},
		updateAt:{
			type:Date,
			default:Date.now()
		}
	},
})

CatetorySchema.pre('save',function (next) {
	
	if (this.isNew) {
		this.meta.creatAt=this.meta.updateAt=Date.now();
	}else{
		this.meta.updateAt=Date.now();
	}
	next();
})

CatetorySchema.statics={
	fetch(cb){
		return this.find({}).sort('meta.updateAt')
		.exec(cb);
	},
	findById(id,cb){
		return this.findOne({_id:id}).sort('meta.updateAt')
		.exec(cb);
	}
}

module.exports = CatetorySchema;