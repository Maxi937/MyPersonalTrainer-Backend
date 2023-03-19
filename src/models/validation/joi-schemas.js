import Joi from "joi";
import createlogger from "../../../config/logger.js";

const logger = createlogger()

// If Value is County return err
const countyValidator = (value, helpers) => {
  if (value === "County") {
    return helpers.error("any.invalid");
  }
  return value;
};

export const UserSpec = {
  fname: Joi.string().required(),
  lname: Joi.string().required(),
  email: Joi.string().email().required(),
  password: Joi.string().required(),
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
