import Joi from "joi";

export const IdSpec = Joi.alternatives().try(Joi.string(), Joi.object()).description("a valid ID");

export const MongooseDetailsSpec = Joi.object().keys({
  _id: IdSpec,
  __v: Joi.allow(),
  createdAt: Joi.date(),
  updatedAt: Joi.date(),
});
