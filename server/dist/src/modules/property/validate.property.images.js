export const validatePropertyImages = (req, res, next) => {
    const files = req.files || [];
    const hasNewImages = files && files.length > 0;
    let existingImages = [];
    if (typeof req.body.existingImages === "string") {
        existingImages = JSON.parse(req.body.existingImages);
    }
    else {
        existingImages = req.body.existingImages;
    }
    const hasExistingImages = existingImages?.length > 0;
    if (!hasNewImages && !hasExistingImages) {
        return res.status(400).json({
            success: false,
            message: "At least one image is required",
        });
    }
    next();
};
