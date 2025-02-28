import { Todo } from "../models/todo.model.js";

const getAllTodos = async (req, res) => {
  try {
    const { query, complete } = req.query;
    const todos = await Todo.aggregate([
      {
        $match:
          query?.length > 0
            ? {
                title: {
                  $regex: query.trim(),
                  $options: "i",
                },
              }
            : {},
      },
      {
        $match: complete
          ? {
              isComplete: JSON.parse(complete),
            }
          : {},
      },
      {
        $sort: {
          updatedAt: -1,
        },
      },
    ]);

    return res.status(200).json({
      success: true,
      data: todos,
      message: "Todos fetched successfully"
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch todos",
      error: error.message
    });
  }
};

const getTodoById = async (req, res) => {
  try {
    const { todoId } = req.params;
    const todo = await Todo.findById(todoId);
    
    if (!todo) {
      return res.status(404).json({
        success: false,
        message: "Todo does not exist"
      });
    }
    
    return res.status(200).json({
      success: true,
      data: todo,
      message: "Todo fetched successfully"
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch todo",
      error: error.message
    });
  }
};

const createTodo = async (req, res) => {
  try {
    const { title, description } = req.body;
    const todo = await Todo.create({
      title,
      description,
    });

    return res.status(201).json({
      success: true,
      data: todo,
      message: "Todo created successfully"
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to create todo",
      error: error.message
    });
  }
};

const updateTodo = async (req, res) => {
  try {
    const { todoId } = req.params;
    const { title, description } = req.body;
    const todo = await Todo.findByIdAndUpdate(
      todoId,
      {
        $set: {
          title,
          description,
        },
      },
      { new: true }
    );

    if (!todo) {
      return res.status(404).json({
        success: false,
        message: "Todo does not exist"
      });
    }

    return res.status(200).json({
      success: true,
      data: todo,
      message: "Todo updated successfully"
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to update todo",
      error: error.message
    });
  }
};

const toggleTodoDoneStatus = async (req, res) => {
  try {
    const { todoId } = req.params;
    const todo = await Todo.findById(todoId);

    if (!todo) {
      return res.status(404).json({
        success: false,
        message: "Todo does not exist"
      });
    }

    todo.isComplete = !todo.isComplete;
    await todo.save({ validateBeforeSave: false });

    return res.status(200).json({
      success: true,
      data: todo,
      message: `Todo marked ${todo.isComplete ? "done" : "undone"}`
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to toggle todo status",
      error: error.message
    });
  }
};

const deleteTodo = async (req, res) => {
  try {
    const { todoId } = req.params;
    const todo = await Todo.findByIdAndDelete(todoId);

    if (!todo) {
      return res.status(404).json({
        success: false,
        message: "Todo does not exist"
      });
    }
    
    return res.status(200).json({
      success: true,
      data: { deletedTodo: todo },
      message: "Todo deleted successfully"
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to delete todo",
      error: error.message
    });
  }
};

export {
  getAllTodos,
  getTodoById,
  createTodo,
  updateTodo,
  deleteTodo,
  toggleTodoDoneStatus,
};