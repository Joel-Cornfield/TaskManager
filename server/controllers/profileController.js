import pool from "../config/db";

export const imageUpload = async (req, res, next) => {
    try {
        const imagePath = `/uploads/${req.file.fileName}`

        await pool.query(
            'UPDATE users SET profile_image = $1 WHERE id = $2',
            [imagePath, req.user.id]
        );

        res.json({ profile_image, imagePath });
    } catch (error) {
        next(error)
    }
};