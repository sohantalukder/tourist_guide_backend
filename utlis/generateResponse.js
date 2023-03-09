export const response = ({ code, message = "ok", records = [] }) => {
    return {
        response: {
            status: {
                code: code,
                message: message,
            },
            records: records,
        },
    };
};
