import authClient from './baseapi/AuthorAPI';

const BulkRankingAPI = {

    viewBulkHistory: async () => {
        const response = await authClient.get('/bulk-ranking-history');
        return response.data;
    }
};

export default BulkRankingAPI;
