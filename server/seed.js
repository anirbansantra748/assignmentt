const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Task = require('./models/Task');

dotenv.config();

const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/todoApp';

/**
 * Seed script to populate sample tasks that match the Figma design reference.
 * Usage: node seed.js
 */
const seedData = async () => {
  try {
    await mongoose.connect(mongoURI);
    console.log('Connected to MongoDB for seeding...');

    // Clear existing tasks
    await Task.deleteMany({});
    console.log('Cleared existing tasks.');

    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);
    const inTwoDays = new Date(today);
    inTwoDays.setDate(today.getDate() + 2);

    const sampleTasks = [
      {
        title: 'Finishing Wireframe',
        description: 'Complete mobile app wireframes in Figma',
        date: today,
        startTime: '09:00',
        endTime: '11:00',
        priority: 'high',
        status: 'open',
      },
      {
        title: 'Meeting with team',
        description: 'Daily standup and sprint backlog review',
        date: today,
        startTime: '11:30',
        endTime: '12:30',
        priority: 'medium',
        status: 'open',
      },
      {
        title: 'Buy a cat food',
        description: 'Get wet food and treats from pet store',
        date: today,
        startTime: '14:00',
        endTime: '14:30',
        priority: 'low',
        status: 'completed',
      },
      {
        title: 'Finishing daily commission',
        description: 'Deliver the client illustrations and send invoice',
        date: today,
        startTime: '16:00',
        endTime: '18:00',
        priority: 'high',
        status: 'completed',
      },
      {
        title: 'Doing Homework',
        description: 'Prepare MERN stack architecture documentation',
        date: tomorrow,
        startTime: '10:00',
        endTime: '12:00',
        priority: 'medium',
        status: 'open',
      },
      {
        title: 'Review pull requests',
        description: 'Review frontend React components and backend routes',
        date: inTwoDays,
        startTime: '15:00',
        endTime: '16:00',
        priority: 'high',
        status: 'open',
      },
      {
        title: 'Weekly grocery run',
        description: 'Vegetables, fruits, and household supplies',
        date: yesterday,
        startTime: '08:00',
        endTime: '09:00',
        priority: 'low',
        status: 'completed',
      },
    ];

    await Task.insertMany(sampleTasks);
    console.log(`Successfully seeded ${sampleTasks.length} sample tasks!`);

    await mongoose.disconnect();
    console.log('Database disconnected. Seeding complete.');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding data:', error.message);
    process.exit(1);
  }
};

seedData();
