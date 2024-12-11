import UnauthorAPI from './baseapi/UnauthorAPI';

const auth_api = '/auth';

const AuthAPI = {

    refreshToken: async () => {
        try {
            const response = await UnauthorAPI.post(`${auth_api}/refresh-token`, { "refreshToken": localStorage.getItem("refreshToken") });
            localStorage.setItem("accessToken", response.data.accessToken);
            localStorage.setItem("refreshToken", response.data.refreshToken);
            return response.data;
        } catch (error) {
            // refresh token is expired
            localStorage.clear();
            throw error;
        }
    }
};

export default AuthAPI;
