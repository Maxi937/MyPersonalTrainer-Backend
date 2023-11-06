import Joi from "joi";
import { MongooseDetailsSpec, IdSpec } from "../../../database/mongo/mongo-validation.js";
import { ExerciseSpec } from "../exercise/exercise-validation.js";

export const WorkoutSpec = Joi.object()
  .keys({
    name: Joi.string().required(),
    exercises: Joi.array().items(ExerciseSpec),
    history: Joi.allow(),
    date: Joi.allow(),
    MongooseDetailsSpec,
  })
  .label("WorkoutDetails");

export const WorkoutArray = Joi.array().items(WorkoutSpec).label("WorkoutDetailsArray");

export const ApiResponseSchema = Joi.object()
  .keys({
    status: Joi.string(),
    wourkouts: Joi.array().empty(),
  })
  .pattern(Joi.string(), WorkoutSpec)
  .pattern(Joi.string(), WorkoutArray);
