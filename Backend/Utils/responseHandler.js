export const sendResponse = (res, statusCode, success, message, data = null) => {
    const response = {
        success,
        message,
        timestamp: new Date().toISOString()
    };
    
    if (data) {
        response.data = data;
    }
    
    return res.status(statusCode).json(response);
};