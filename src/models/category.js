import mongoose from "mongoose";

const categorySchema = mongoose.Schema({
        bannerImages:[{
                type:String,
        }
        ],
        slug:{
                type:String,
                required:true,
                unique:true
        },
        image:{
                type:String,
        },
        name:{
                type:String,
                required:true,
                maxlength:50
        },
        parentCategory:{
                type:String,
                required:true,
                enum: ['men','women'],
        },
    
})

const Category = mongoose.models.Category||mongoose.model("Category",categorySchema);
export default Category;