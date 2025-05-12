import mongoose from "mongoose";

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.URL_BASE,);
    console.log(`MongoDB conectado`);
  }catch (err) {
    console.log(err);
    process.exit(1);
  }

}

export default connectDB;
