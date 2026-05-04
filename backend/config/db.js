const mongoose = require('mongoose')


module.exports.connect = async () => {
   try {
        await mongoose.connect(process.env.MONGODB_URL);
        console.log("Connected MongoDB");
    } catch (error) {
        console.log("Error:", error);
        process.exit(1);
  }
}