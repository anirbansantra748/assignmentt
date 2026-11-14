const mongoose = require('mongoose');

/**
 * Connect to MongoDB using the connection string from environment variables.
 * Cleans surrounding whitespace, quotes, and common copy-paste artifacts.
 */
const connectDB = async () => {
  try {
    let mongoURI = (process.env.MONGODB_URI || '').trim();

    // Strip wrapping quotes if user pasted with quotes (e.g. "mongodb+srv://...")
    if (
      (mongoURI.startsWith('"') && mongoURI.endsWith('"')) ||
      (mongoURI.startsWith("'") && mongoURI.endsWith("'"))
    ) {
      mongoURI = mongoURI.slice(1, -1).trim();
    }

    // Strip key prefix if user pasted "MONGODB_URI=mongodb+srv://..."
    if (mongoURI.startsWith('MONGODB_URI=')) {
      mongoURI = mongoURI.replace(/^MONGODB_URI=\s*/, '').trim();
    }

    // Default fallback if unset
    if (!mongoURI) {
      mongoURI = 'mongodb://localhost:27017/todoApp';
    }

    // Validate protocol scheme
    if (!mongoURI.startsWith('mongodb://') && !mongoURI.startsWith('mongodb+srv://')) {
      throw new Error(
        `Invalid scheme in MONGODB_URI. Expected string to start with "mongodb+srv://" or "mongodb://", but received "${mongoURI.substring(0, 15)}..."`
      );
    }

    // Fix missing '?' before query parameters (e.g. ...mongodb.net/assignmentretryWrites=true -> ...mongodb.net/assignment?retryWrites=true)
    if (!mongoURI.includes('?') && mongoURI.includes('retryWrites=')) {
      mongoURI = mongoURI.replace('retryWrites=', '?retryWrites=');
    }

    const conn = await mongoose.connect(mongoURI);

    console.log(`✅ MongoDB Connected: ${conn.connection.host}/${conn.connection.name}`);
  } catch (error) {
    console.error(`❌ MongoDB Connection Error: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;
