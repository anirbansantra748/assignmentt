const Task = require('../models/Task');

/**
 * @desc    Create a new task
 * @route   POST /api/tasks
 */
const createTask = async (req, res, next) => {
  try {
    const { title, description, date, startTime, endTime, priority, status } = req.body;

    // Validate required fields explicitly for clearer error messages
    if (!title || !title.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Title is required',
      });
    }

    if (!date) {
      return res.status(400).json({
        success: false,
        message: 'Date is required',
      });
    }

    // Validate that the date string is parseable
    const parsedDate = new Date(date);
    if (isNaN(parsedDate.getTime())) {
      return res.status(400).json({
        success: false,
        message: 'Invalid date format',
      });
    }

    const task = await Task.create({
      title: title.trim(),
      description: description ? description.trim() : '',
      date: parsedDate,
      startTime: startTime || '',
      endTime: endTime || '',
      priority: priority || 'medium',
      status: status || 'open',
    });

    res.status(201).json({
      success: true,
      message: 'Task created successfully',
      data: task,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get all tasks, sorted by date descending
 * @route   GET /api/tasks
 */
const getAllTasks = async (req, res, next) => {
  try {
    const tasks = await Task.find().sort({ date: -1, createdAt: -1 });

    res.status(200).json({
      success: true,
      count: tasks.length,
      data: tasks,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get a single task by ID
 * @route   GET /api/tasks/:id
 */
const getTaskById = async (req, res, next) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Task not found',
      });
    }

    res.status(200).json({
      success: true,
      data: task,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update a task by ID
 * @route   PUT /api/tasks/:id
 */
const updateTask = async (req, res, next) => {
  try {
    const { title, description, date, startTime, endTime, priority, status } = req.body;

    // Build update object with only provided fields
    const updateFields = {};
    if (title !== undefined) updateFields.title = title.trim();
    if (description !== undefined) updateFields.description = description.trim();
    if (date !== undefined) {
      const parsedDate = new Date(date);
      if (isNaN(parsedDate.getTime())) {
        return res.status(400).json({
          success: false,
          message: 'Invalid date format',
        });
      }
      updateFields.date = parsedDate;
    }
    if (startTime !== undefined) updateFields.startTime = startTime;
    if (endTime !== undefined) updateFields.endTime = endTime;
    if (priority !== undefined) updateFields.priority = priority;
    if (status !== undefined) updateFields.status = status;

    const task = await Task.findByIdAndUpdate(req.params.id, updateFields, {
      new: true,
      runValidators: true,
    });

    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Task not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Task updated successfully',
      data: task,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Delete a task by ID
 * @route   DELETE /api/tasks/:id
 */
const deleteTask = async (req, res, next) => {
  try {
    const task = await Task.findByIdAndDelete(req.params.id);

    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Task not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Task deleted successfully',
      data: task,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Search tasks by keyword in title or description (case-insensitive)
 * @route   GET /api/tasks/search?q=keyword
 */
const searchTasks = async (req, res, next) => {
  try {
    const { q } = req.query;

    if (!q || !q.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Search query parameter "q" is required',
      });
    }

    // Escape special regex characters in the search query
    const escapedQuery = q.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const regex = new RegExp(escapedQuery, 'i');

    const tasks = await Task.find({
      $or: [{ title: regex }, { description: regex }],
    }).sort({ date: -1 });

    res.status(200).json({
      success: true,
      count: tasks.length,
      query: q,
      data: tasks,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Helper: Compute the Monday (week start) for a given date in UTC.
 */
function getMonday(d) {
  const date = new Date(d);
  const day = date.getUTCDay(); // 0=Sun, 1=Mon, ...
  const diff = day === 0 ? 6 : day - 1;
  date.setUTCDate(date.getUTCDate() - diff);
  date.setUTCHours(0, 0, 0, 0);
  return date;
}

/**
 * @desc    Get weekly summary — tasks grouped by week with open/completed counts
 * @route   GET /api/tasks/weekly-summary
 */
const getWeeklySummary = async (req, res, next) => {
  try {
    const summary = await Task.aggregate([
      {
        // Compute the Monday of each task's week
        $addFields: {
          // dayOfWeek: 1=Sun, 2=Mon, ..., 7=Sat in Mongo $dayOfWeek
          dayOfWeekMongo: { $dayOfWeek: '$date' },
        },
      },
      {
        $addFields: {
          // Convert to ISO day offset from Monday: Mon=0, Tue=1, ..., Sun=6
          isoDayOffset: {
            $cond: {
              if: { $eq: ['$dayOfWeekMongo', 1] }, // Sunday
              then: 6,
              else: { $subtract: ['$dayOfWeekMongo', 2] },
            },
          },
        },
      },
      {
        $addFields: {
          weekStart: {
            $dateSubtract: {
              startDate: {
                // Strip time portion
                $dateTrunc: { date: '$date', unit: 'day' },
              },
              unit: 'day',
              amount: '$isoDayOffset',
            },
          },
        },
      },
      {
        $group: {
          _id: '$weekStart',
          openCount: {
            $sum: { $cond: [{ $eq: ['$status', 'open'] }, 1, 0] },
          },
          completedCount: {
            $sum: { $cond: [{ $eq: ['$status', 'completed'] }, 1, 0] },
          },
          totalCount: { $sum: 1 },
        },
      },
      {
        $project: {
          _id: 0,
          weekStart: '$_id',
          weekEnd: {
            $dateAdd: { startDate: '$_id', unit: 'day', amount: 6 },
          },
          openCount: 1,
          completedCount: 1,
          totalCount: 1,
        },
      },
      { $sort: { weekStart: -1 } },
    ]);

    res.status(200).json({
      success: true,
      count: summary.length,
      data: summary,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get tasks for a specific week (Monday to Sunday)
 * @route   GET /api/tasks/week?weekStart=2024-01-01
 */
const getTasksByWeek = async (req, res, next) => {
  try {
    const { weekStart } = req.query;

    if (!weekStart) {
      return res.status(400).json({
        success: false,
        message: 'Query parameter "weekStart" (ISO date of Monday) is required',
      });
    }

    const startDate = new Date(weekStart);
    if (isNaN(startDate.getTime())) {
      return res.status(400).json({
        success: false,
        message: 'Invalid date format for weekStart',
      });
    }

    // Normalize to start of day UTC
    startDate.setUTCHours(0, 0, 0, 0);

    // End of Sunday (6 days after Monday, end of day)
    const endDate = new Date(startDate);
    endDate.setUTCDate(startDate.getUTCDate() + 6);
    endDate.setUTCHours(23, 59, 59, 999);

    const tasks = await Task.find({
      date: { $gte: startDate, $lte: endDate },
    }).sort({ date: 1, startTime: 1 });

    // Calculate progress for this week
    const totalCount = tasks.length;
    const completedCount = tasks.filter((t) => t.status === 'completed').length;
    const progress = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

    res.status(200).json({
      success: true,
      count: totalCount,
      weekStart: startDate.toISOString(),
      weekEnd: endDate.toISOString(),
      progress,
      completedCount,
      openCount: totalCount - completedCount,
      data: tasks,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Toggle task status between open and completed
 * @route   PATCH /api/tasks/:id/toggle
 */
const toggleTaskStatus = async (req, res, next) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Task not found',
      });
    }

    // Toggle the status
    task.status = task.status === 'open' ? 'completed' : 'open';
    await task.save();

    res.status(200).json({
      success: true,
      message: `Task marked as ${task.status}`,
      data: task,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createTask,
  getAllTasks,
  getTaskById,
  updateTask,
  deleteTask,
  searchTasks,
  getWeeklySummary,
  getTasksByWeek,
  toggleTaskStatus,
};
