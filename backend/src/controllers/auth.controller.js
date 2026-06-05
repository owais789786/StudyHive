const authController = async (req, res) => {
    return res.status(200).json({
        message: 'Authenticated successfully',
        success: true,
        data: req.user
    })
}

module.exports = authController;