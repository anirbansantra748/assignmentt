const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Task title is required'],
      trim: true,
      maxlength: [100, 'Title cannot exceed 100 characters'],
    },
    description: {
      type: String,
      trim: true,
      maxlength: [500, 'Description cannot exceed 500 characters'],
      default: '',
    },
    date: {
      type: Date,
      required: [true, 'Task date is required'],
    },
    startTime: {
      type: String,
      trim: true,
      validate: {
        validator: function (v) {
          // Allow empty string or valid HH:MM format
          return !v || /^([01]\d|2[0-3]):([0-5]\d)$/.test(v);
        },
        message: 'startTime must be in HH:MM format (24-hour)',
      },
      default: '',
    },
    endTime: {
      type: String,
      trim: true,
      validate: {
        validator: function (v) {
          return !v || /^([01]\d|2[0-3]):([0-5]\d)$/.test(v);
        },
        message: 'endTime must be in HH:MM format (24-hour)',
      },
      default: '',
    },
    priority: {
      type: String,
      enum: {
        values: ['low', 'medium', 'high'],
        message: 'Priority must be low, medium, or high',
      },
      default: 'medium',
    },
    status: {
      type: String,
      enum: {
        values: ['open', 'completed'],
        message: 'Status must be open or completed',
      },
      default: 'open',
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

/**
 * Virtual: weekStart
 * Computes the Monday (start of ISO week) for the task's date.
 */
taskSchema.virtual('weekStart').get(function () {
  if (!this.date) return null;

  const d = new Date(this.date);
  const day = d.getUTCDay(); // 0 = Sunday, 1 = Monday, ...
  // Calculate difference to Monday: if Sunday (0), go back 6 days; otherwise go back (day - 1) days
  const diff = day === 0 ? 6 : day - 1;
  const monday = new Date(d);
  monday.setUTCDate(d.getUTCDate() - diff);
  monday.setUTCHours(0, 0, 0, 0);
  return monday;
});

// Indexes for efficient querying
taskSchema.index({ date: 1 });
taskSchema.index({ status: 1 });
taskSchema.index({ date: 1, status: 1 });

const Task = mongoose.model('Task', taskSchema);

module.exports = Task;
