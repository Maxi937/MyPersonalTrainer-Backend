import Joi from "joi";
import { MongooseDetailsSpec, IdSpec } from "../../../database/mongo/mongo-validation.js";

export const ExerciseSpec = Joi.object()
  .keys({
    name: Joi.string().required(),
    description: Joi.string().required(),
    bodyPart: Joi.string().required(),
    meta: Joi.object(),
    sets: Joi.array(),
    createdBy: IdSpec,
    MongooseDetailsSpec,
  })
  .label("ExerciseDetails");

export const ExerciseArray = Joi.array().items(ExerciseSpec).label("ExerciseDetailsArray");

export const ApiResponseSchema = Joi.object()
  .keys({
    status: Joi.string(),
    exercises: Joi.array().empty(),
  })
  .pattern(Joi.string(), ExerciseSpec)
  .pattern(Joi.string(), ExerciseArray);
