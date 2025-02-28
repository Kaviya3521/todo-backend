import { Router } from "express";
import { createTodoValidator, getAllTodosQueryValidators, updateTodoValidator } from "../validation/todo.validation.js";
import { createTodo, deleteTodo, getAllTodos, getTodoById, toggleTodoDoneStatus, updateTodo } from "../controllers/todo.controller.js";


const router = Router();

router
  .route("/")
  .post(createTodoValidator(),  createTodo)
  .get(getAllTodosQueryValidators(), getAllTodos);
  

router
  .route("/:todoId")
  .get(getTodoById)
  .patch(
    updateTodoValidator(),
    updateTodo
  )
  .delete( deleteTodo);

router
  .route("/toggle/status/:todoId")
  .patch(
    toggleTodoDoneStatus
  );

export default router;
