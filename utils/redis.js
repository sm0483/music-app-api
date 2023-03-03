const redisClient=require('../config/redis');

const redisGet=async(query,prefix)=>{
    try {
        const key=`${prefix}+${query}`
        const data=await redisClient.get(key);
        if(data) return JSON.parse(data);
    } catch (error) {
        return null;
    }
}

const redisSet = async (query,prefix,data,ex) => {
    try {
        const key=`${prefix}+${query}`
        const reply = await redisClient.set(key, JSON.stringify(data), 'EX', ex);
        return reply;
    } catch (error) {
        return null;
    }
  };
  
module.exports = {
    redisGet,
    redisSet
}