const mongoose = require('mongoose');
const ClayBalance = require('./models/ClayBalance'); // Ensure the path is correctly adjusted to where you've defined your model

// Assuming your .env is correctly set up and loaded at the beginning of your app's entry point
const mongoURI = process.env.MONGODB_URI;

mongoose.connect(mongoURI)
  .then(() => {
    console.log('MongoDB connection successful');
    testMongoDBConnection(); // Call the test function after a successful connection
  })
  .catch((err) => console.error('MongoDB connection error:', err));

async function testMongoDBConnection() {
    try {
        const balance = await ClayBalance.findOne({});
        if (balance) {
            console.log('Successfully found a ClayBalance document:', balance);
        } else {
            console.log('No ClayBalance document found, creating one...');
            const newBalance = new ClayBalance({ balance: 0 });
            const savedBalance = await newBalance.save();
            console.log('New ClayBalance document created:', savedBalance);
        }
    } catch (err) {
        console.log('Error in MongoDB operation:', err);
    }
}
