// import mongoose from "mongoose";

// export const connectDB = async () => {
//   const { connection } = await mongoose.connect(process.env.MONGO_URI);
//   console.log(`Mongodb is connected with ${connection.host}`);
// };


import { Sequelize } from 'sequelize';

// Hardcoded Database Configuration
const sequelize = new Sequelize(
  '',      
  '',        
  '',         
  {
    // user: '',
    // password: '',
    // database:'',
    host: 'localhost', 
    port: 5432,         
    dialect: 'postgres',
    logging: false,
  }
);

export default sequelize;
