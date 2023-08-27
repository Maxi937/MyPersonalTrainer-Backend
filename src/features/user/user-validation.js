import Joi from "joi";
import { MongooseDetailsSpec } from "../../database/mongo/mongo-validation.js";

// export const IdSpec = Joi.alternatives().try(Joi.string(), Joi.object()).description("a valid ID");

export const UserSpec = Joi.object()
  .keys({
    fname: Joi.string().required(),
    lname: Joi.string().required(),
    email: Joi.string().email().required(),
    password: Joi.string().required(),
    profilepicture: Joi.allow().optional(),
    role: Joi.string().optional(),
    MongooseDetailsSpec
  })
  .label("UserDetails");

export const UserArray = Joi.array().items(UserSpec).label("UserArray");

export const UserCredentialsSpec = {
  email: Joi.string().email().required(),
  password: Joi.string().required(),
};

export const ApiResponseSchema = Joi.object()
  .keys({
    status: Joi.string(),
    users: Joi.array().empty()
  })
  .pattern(Joi.string(), UserSpec)
  .pattern(Joi.string(), UserArray)

  
