import authClient from './baseapi/AuthorAPI';

const BulkRankingAPI = {

    viewBulkHistory: async (filter = "", page = 1, size = 5) => {
        const response = await authClient.get('/bulk-ranking-history',
            {
                params: {
                    filter: filter,
                    page: page,
                    size: size
                }
            });
        // console.log(response.data);
        return response.data;
    }
};

export default BulkRankingAPI;
