const cookieOption = () => {
    return {
        httpOnly: true, // prevents client-side JS from accessing the cookie
        secure: process.env.NODE_ENV === "production", // sends cookie only over HTTPS in production
        sameSite: "Strict", // helps prevent CSRF
        maxAge: 24 * 60 * 60 * 1000, // 1 day in milliseconds
    };
};


module.exports = cookieOption