/**
 * Middleware untuk validasi input
 */
export const validateEmail = (req, res, next) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    
    if (req.body.email && !emailRegex.test(req.body.email)) {
        return res.status(400).json({
            success: false,
            message: 'Format email tidak valid'
        });
    }
    
    next();
};

export const validatePassword = (req, res, next) => {
    if (req.body.password && req.body.password.length < 6) {
        return res.status(400).json({
            success: false,
            message: 'Password minimal 6 karakter'
        });
    }
    
    next();
};

export const validateRequired = (fields = []) => {
    return (req, res, next) => {
        const missing = fields.filter(field => !req.body[field]);
        
        if (missing.length > 0) {
            return res.status(400).json({
                success: false,
                message: `Field wajib diisi: ${missing.join(', ')}`
            });
        }
        
        next();
    };
};
