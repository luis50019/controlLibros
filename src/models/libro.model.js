import mongoose from "mongoose";

const libroSchema = new mongoose.Schema({
  title:{
    type:String,
    required:true
  },
  id:{
    type:Number,
    required:true
  },
  author:{
    type:String,
    required:true
  },
  yearReleased:{
    type:Number,
    required:true
  },
  editionNumber:{
    type:Number,
    required:true
  },
  genre:{
    type:String,
    required:true
  },
  description:{
    type:String,
    required:true
  }
})

export default mongoose.model('libros', libroSchema);