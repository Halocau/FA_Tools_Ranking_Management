import authClient from './baseapi/AuthorAPI';

const bulk_ranking_api = '/bulk-ranking-history';

const BulkRankingAPI = {

    viewBulkHistory: async (filter = "", page = 1, size = 5) => {
        const response = await authClient.get(`${bulk_ranking_api}`,
            {
                params: {
                    filter: filter,
                    page: page,
                    size: size
                }
            });
        return response.data;
    },
    addNewBulkRanking: async (data) => {
        const response = await authClient.post(`${bulk_ranking_api}/add`, data);
        return response.data;
    }
};

export default BulkRankingAPI;
