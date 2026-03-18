import mongoose from 'mongoose';

const uri = 'mongodb://chandangust7999_db_user:7BzyLXtsIjmGOIVN@ac-izov6s7-shard-00-00.ecrc3se.mongodb.net:27017,ac-izov6s7-shard-00-01.ecrc3se.mongodb.net:27017,ac-izov6s7-shard-00-02.ecrc3se.mongodb.net:27017/quickshow?ssl=true&authSource=admin&replicaSet=atlas-gdf063-shard-0&retryWrites=true&w=majority&appName=Cluster0';

console.log('Testing direct connection to MongoDB...');

mongoose.connect(uri, { serverSelectionTimeoutMS: 5000 })
  .then(() => {
      console.log('Successfully connected to MongoDB!');
      process.exit(0);
  })
  .catch((err) => {
      console.error('MongoDB connection error:', err);
      process.exit(1);
  });
