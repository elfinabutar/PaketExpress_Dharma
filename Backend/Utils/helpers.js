/**
 * Format response API
 */
export const response = (success, message, data = null, statusCode = 200) => {
    return {
        statusCode,
        body: {
            success,
            message,
            ...(data && { data })
        }
    };
};

/**
 * Generate nomor resi
 */
export const generateNoResi = () => {
    const timestamp = Date.now().toString();
    const random = Math.floor(Math.random() * 10000);
    return `PE${timestamp}${random}`;
};

/**
 * Format tanggal
 */
export const formatDate = (date) => {
    return new Date(date).toLocaleDateString('id-ID', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
};
