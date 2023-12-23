import Joi from "joi";
import { MongooseDetailsSpec, IdSpec } from "../../../database/mongo/mongo-validation.js";

export const ExerciseSpec = Joi.object()
  .keys({
    name: Joi.string().required(),
    description: Joi.string(),
    bodyPart: Joi.string(),
    meta: Joi.object(),
    sets: Joi.object().required(),
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
