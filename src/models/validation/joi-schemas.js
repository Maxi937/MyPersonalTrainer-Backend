import Joi from "joi";

// If Value is County return err
const countyValidator = (value, helpers) => {
  if (value === "County") {
    return helpers.error("any.invalid");
  }
  return value;
};

export const IdSpec = Joi.alternatives().try(Joi.string(), Joi.object()).description("a valid ID");

export const UserSpec = Joi.object().keys({
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
}).label("UserDetails");

export const UserArray = Joi.array().items(UserSpec).label("UserArray");

export const UserUpdateSpec = {
  fname: Joi.string().allow(""),
  lname: Joi.string().allow(""),
  email: Joi.string().email().allow(""),
  password: Joi.string().allow(""),
  profilepicture: Joi.allow(),
};

export const PlaceSpec = Joi.object().keys({
  placeName: Joi.string().required(),
  placeAddress: Joi.string().required(),
  serves: Joi.array(),
  description: Joi.string(),
  lat: Joi.string().required(),
  lng: Joi.string().required(),
  _id: IdSpec,
  __v: Joi.number(),
  createdAt: Joi.date(),
  updatedAt: Joi.date(),
}).label("PlaceDetails");

export const PlaceArray = Joi.array().items(PlaceSpec).label("PlaceArray");

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

export const ReviewSpec = Joi.object().keys({
  date: Joi.date().required(),
  content: Joi.string().required(),
  user: IdSpec,
  place: IdSpec,
  rating: Joi.number().required(),
  _id: IdSpec,
  __v: Joi.number(),
  createdAt: Joi.date(),
  updatedAt: Joi.date(),
}).label("ReviewDetails");

export const ReviewArray = Joi.array().items(ReviewSpec).label("ReviewArray");

export const UserCredentialsSpec = {
  email: Joi.string().email().required(),
  password: Joi.string().required()
};
