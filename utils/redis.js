const { StatusCodes } = require("http-status-codes");
const client = require("../config/redis");
const CustomError = require("../error/custom");

const setCache = async (key, value, size) => {
   try {
      const newValue = JSON.stringify(value);
      return await client.set(key, newValue, "EX", 60 * size * 6);
   } catch (error) {
      throw new CustomError(error.message, StatusCodes.INTERNAL_SERVER_ERROR);
   }
};

const getCache = async (key) => {
   try {
      const data = await client.get(key);
      if (data) {
         const parsedData = JSON.parse(data);
         return parsedData;
      }
      return null;
   } catch (error) {
      throw new CustomError(error.message, StatusCodes.INTERNAL_SERVER_ERROR);
   }
};

module.exports = { setCache, getCache };
