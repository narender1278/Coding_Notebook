    import rateLimit from "../config/upstash.js"

    const ratelimiter = async (req,res,next) => {
        try {
            const { success } = await rateLimit.limit("my-limit-key");
            if(!success) return res.status(429).json({message:"too many requests"});
            next();
        } catch (error) {
            console.log("RateLimit error");
            next(error);
        }
    };

    export default ratelimiter;