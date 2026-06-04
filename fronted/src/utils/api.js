import { client } from "./helper";

export const fetchRooms = async () => {
    try {
        const response = await client.get("room-type");

        return {
            success: response.data.success,
            data: response.data.data || [],
            message: response.data.message
        };

    } catch (error) {
        return {
            success: false,
            data: [],
            message: error.response?.data?.message || "Internal Server Error"
        };
    }
};

export const fetchRoomsById = async (id) => {
    try {
        const response = await client.get(`room-type/${id}`);

        return {
            success: response.data.success,
            data: response.data.data || null,
            message: response.data.message
        };

    } catch (error) {
        return {
            success: false,
            data: null,
            message: error.response?.data?.message || "Internal Server Error"
        };
    }
};

export const addRoomType = async (roomData) => {
    try {
        const response = await client.post("room-type/create", roomData);
        return {
            success: response.data.success,
            message: response.data.message
        };
    } catch (error) {
        return {
            success: false,
            message: error.response?.data?.message || "Internal Server Error"
        };
    }
};

export const deleteRoomType = async (id) => {
    try {
        const response = await client.delete(`room-type/delete/${id}`);
        return {
            success: response.data.success,
            message: response.data.message
        };
    } catch (error) {
        return {
            success: false,
            message: error.response?.data?.message || "Internal Server Error"
        };
    }
};

export const toggleRoomTypeStatus = async (id) => {
    try {
        const response = await client.put(`room-type/status-update/${id}`);
        return {
            success: response.data.success,
            message: response.data.message
        };
    } catch (error) {
        return {
            success: false,
            message: error.response?.data?.message || "Internal Server Error"
        };
    }
};

export const fetchCategories = async () => {
    try {
        const response = await client.get("category");
        return {
            success: response.data.success,
            data: response.data.data || [],
            message: response.data.message
        };
    } catch (error) {
        return {
            success: false,
            data: [],
            message: error.response?.data?.message || "Internal Server Error"
        };
    }
};

export const addCategory = async (categoryData) => {
    try {
        const response = await client.post("category/create", categoryData);
        return {
            success: response.data.success,
            message: response.data.message
        };
    } catch (error) {
        return {
            success: false,
            message: error.response?.data?.message || "Internal Server Error"
        };
    }
};

export const deleteCategory = async (id) => {
    try {
        const response = await client.delete(`category/delete/${id}`);
        return {
            success: response.data.success,
            message: response.data.message
        };
    } catch (error) {
        return {
            success: false,
            message: error.response?.data?.message || "Internal Server Error"
        };
    }
};

export const toggleCategoryStatus = async (id) => {
    try {
        const response = await client.put(`category/status-update/${id}`);
        return {
            success: response.data.success,
            message: response.data.message
        };
    } catch (error) {
        return {
            success: false,
            message: error.response?.data?.message || "Internal Server Error"
        };
    }
};

export const updateRoomType = async (id, roomData) => {
    try {
        const response = await client.put(`room-type/update/${id}`, roomData);
        return {
            success: response.data.success,
            message: response.data.message
        };
    } catch (error) {
        return {
            success: false,
            message: error.response?.data?.message || "Internal Server Error"
        };
    }
};

export const fetchCategoryById = async (id) => {
    try {
        const response = await client.get(`category/${id}`);
        return {
            success: response.data.success,
            data: response.data.data || null,
            message: response.data.message
        };
    } catch (error) {
        return {
            success: false,
            data: null,
            message: error.response?.data?.message || "Internal Server Error"
        };
    }
};

export const updateCategory = async (id, categoryData) => {
    try {
        const response = await client.put(`category/update/${id}`, categoryData);
        return {
            success: response.data.success,
            message: response.data.message
        };
    } catch (error) {
        return {
            success: false,
            message: error.response?.data?.message || "Internal Server Error"
        };
    }
};



