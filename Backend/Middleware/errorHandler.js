/**
 * Global error handling middleware
 */
export const errorHandler = (err, req, res, next) => {
    console.error('Error:', err);
    
    // Default error
    let statusCode = 500;
    let message = 'Terjadi kesalahan pada server';
    
    // Handle specific errors
    if (err.message.includes('ER_DUP_ENTRY')) {
        statusCode = 409;
        message = 'Data sudah terdaftar';
    } else if (err.message.includes('ER_NO_REFERENCED_ROW')) {
        statusCode = 400;
        message = 'Data referensi tidak ditemukan';
    }
    
    res.status(statusCode).json({
        success: false,
        message: message,
        error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
};

export const notFoundHandler = (req, res) => {
    res.status(404).json({
        success: false,
        message: 'Route tidak ditemukan'
    });
};
