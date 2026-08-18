export const successResponse = (res, message, statusCode = 200, content = null) => {
    return res.status(statusCode).json({ status: "success", message, content });
};
export const cookieResponse = (res, token) => {
    res.cookie("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
        maxAge: 1000 * 60 * 60 * 24 * 5 // 5 days
    });
};
