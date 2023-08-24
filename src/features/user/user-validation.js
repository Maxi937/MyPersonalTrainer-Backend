import Joi from "joi";

export const IdSpec = Joi.alternatives().try(Joi.string(), Joi.object()).description("a valid ID");

export const UserSpec = Joi.object()
  .keys({
    fname: Joi.string().required(),
    lname: Joi.string().required(),
    email: Joi.string().email().required(),
    password: Joi.string().required(),
    profilepicture: Joi.allow().optional(),
    role: Joi.string().optional(),
    _id: IdSpec,
    __v: Joi.number(),
    createdAt: Joi.date(),
    updatedAt: Joi.date(),
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

  
