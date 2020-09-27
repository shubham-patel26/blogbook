const mongoose=require('mongoose');
const Schema=mongoose.Schema;


const commmentSchema=new Schema({
    
    comment:{
        type:String,
        // required:true
    },
   commentauthor:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User'
    }
},{
    timestamps:true
});

const blogSchema= new Schema({
    name:{
        type:String,
        required:true,
        unique:true
    },
    description:{
        type:String,
        required:true,
    },
    author:{
        type: mongoose.Schema.Types.ObjectId,
        ref:'User',
        
    },
    like:{
        type : [mongoose.Schema.Types.ObjectId],
        ref : 'User'
    },
    image: {
        type: String,
        // required: true
    },
    category: {
        type: String,
        required: true
    },
    comments:[commmentSchema]
},{
    timestamps:true
});

var Blogs=mongoose.model('Blogs',blogSchema);

module.exports=Blogs;