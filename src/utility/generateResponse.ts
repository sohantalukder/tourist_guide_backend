import { ApiResponse } from "../types/utility/responseInterface";

export const response = ({ code, message = "ok", data = [] }: ApiResponse) => {
    return {
        code,
        message,
        data,
    };
};
