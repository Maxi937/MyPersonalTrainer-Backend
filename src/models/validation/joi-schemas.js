import Joi from "joi";

// If Value is County return err
const countyValidator = (value, helpers) => {
  if (value === "County") {
    return helpers.error("any.invalid");
  }
  return value;
};

export const IdSpec = Joi.alternatives().try(Joi.string(), Joi.object()).description("a valid ID");

export const UserSpec = {
  fname: Joi.string().required(),
  lname: Joi.string().required(),
  email: Joi.string().email().required(),
  password: Joi.string().required(),
  profilepicture: Joi.allow()
};

export const UserArray = Joi.array().items(UserSpec).label("UserArray");

export const UserUpdateSpec = {
  fname: Joi.string().allow(""),
  lname: Joi.string().allow(""),
  email: Joi.string().email().allow(""),
  password: Joi.string().allow(""),
  profilepicture: Joi.allow()
};

export const PlaceSpec = {
  placeName: Joi.string().required(),
  address1: Joi.string().required(),
  address2: Joi.string().required(),
  address3: Joi.string().required(),
  county: countyValidator,
};

export const BeerSpec = {
  beerName: Joi.string().required(),
  beerType: Joi.string().required(),
  beerAvgPrice: Joi.number().precision(2),
  beerImage: Joi.allow()
};

export const BeerUpdateSpec = {
  beerName: Joi.string().optional().allow(""),
  beerType: Joi.string().optional().allow("larger","cider"),
  beerAvgPrice: Joi.number().precision(2).optional().allow(""),
  beerImage: Joi.allow().optional()
};

export const UserCredentialsSpec = {
  email: Joi.string().email().required(),
  password: Joi.string().required()
};
