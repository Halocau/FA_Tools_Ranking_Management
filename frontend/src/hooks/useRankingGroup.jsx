import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import authClient from '../api/baseapi/AuthorAPI';

// Custom hook to manage interactions with the Ranking Group API
const useRankingGroup = () => {
    const navigate = useNavigate();
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [pageInfo, setPageInfo] = useState({
        page: 1, // Trang mặc định là 1
        size: 5, // Kích thước trang mặc định là 5
        total: 0, // Tổng số bản ghi
    });
    // Helper function to handle errors and optional navigation
    const handleError = (err, defaultMessage) => {
        if (err.response?.status === 403) {
            navigate('/403');
        } else {
            setError(err.response?.data || defaultMessage);
        }
    };

    // Fetch all ranking groups
    // const fetchAllRankingGroups = async () => {
    //     setLoading(true);
    //     setError(null);
    //     try {
    //         const response = await authClient.get('/ranking-group');
    //         setData(response.data);
    //         return response.data;
    //     } catch (err) {
    //         handleError(err, "An error occurred while fetching ranking groups.");
    //     } finally {
    //         setLoading(false);
    //     }
    // };
    // Hàm fetch dữ liệu theo page và size
    const fetchAllRankingGroups = async (page = 1, size = 5) => {
        setLoading(true);
        setError(null);
        try {
            // Gọi API với page và size làm tham số
            const response = await authClient.get('/ranking-group', {
                params: {
                    page,
                    size,
                },
            });

            // Cập nhật dữ liệu và thông tin phân trang
            setData(response.data); // Giả sử response.data.result chứa dữ liệu nhóm
            setPageInfo({
                page: response.data.pageInfo.page,
                size: response.data.pageInfo.size,
                total: response.data.pageInfo.total, // Tổng số bản ghi
            });

            return response.data;
        } catch (err) {
            setError(err);
            console.error("An error occurred while fetching ranking groups.", err);
        } finally {
            setLoading(false);
        }
    };
    // Fetch a ranking group by ID
    const fetchRankingGroupById = async (id) => {
        setLoading(true);
        setError(null);
        try {
            const response = await authClient.get(`/ranking-group/get/${id}`);
            return response.data;
        } catch (err) {
            handleError(err, "An error occurred while fetching the ranking group.");
        } finally {
            setLoading(false);
        }
    };

    // Add a new ranking group
    const addRankingGroup = async (newGroup) => {
        setLoading(true);
        setError(null);
        try {
            const response = await authClient.post(`/ranking-group/add`, newGroup);
            await fetchAllRankingGroups(); // Refresh list after adding
            return response.data;
        } catch (err) {
            handleError(err, "An error occurred while adding the ranking group.");
        } finally {
            setLoading(false);
        }
    };

    // Update a ranking group by ID
    const updateRankingGroup = async (id, updatedGroup) => {
        setLoading(true);
        setError(null);
        try {
            const response = await authClient.put(`/ranking-group/update/${id}`, updatedGroup);
            setData((prevData) =>
                prevData.map((group) =>
                    group.id === id ? { ...group, ...response.data } : group
                )
            );
            return response.data;
        } catch (err) {
            handleError(err, "An error occurred while updating the ranking group.");
        } finally {
            setLoading(false);
        }
    };

    // Delete a ranking group by ID
    const deleteRankingGroup = async (id) => {
        setLoading(true);
        setError(null);
        try {
            await authClient.delete(`/ranking-group/delete/${id}`);
            setData((prevData) => prevData.filter((group) => group.id !== id));
        } catch (err) {
            handleError(err, "An error occurred while deleting the ranking group.");
        } finally {
            setLoading(false);
        }
    };

    return {
        data,
        loading,
        error,
        pageInfo,
        fetchAllRankingGroups,
        fetchRankingGroupById,
        addRankingGroup,
        updateRankingGroup,
        deleteRankingGroup,
    };
};

export default useRankingGroup;
