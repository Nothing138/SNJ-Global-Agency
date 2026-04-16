const authorize = (allowedRoles = []) => {
    return (req, res, next) => {
        // Token chere amra ekhon ekti static security key check korbo
        const adminSecret = req.headers['admin-secret-key'];

        // Ei key-ti backend ar frontend-e match korlei access pabe
        if (adminSecret === 'JM_IT_GLOBAL_SECURE_KEY_2024') {
            // Mock user data set kora jeno controller-e req.user.id pay
            // dhore niche superadmin-er ID = 1
            req.user = { id: 1, role: 'superadmin' }; 
            return next();
        }

        return res.status(401).json({ 
            success: false, 
            message: "Unauthorized: Invalid Security Key!" 
        });
    };
};

module.exports = authorize;