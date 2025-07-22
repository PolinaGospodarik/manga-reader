import axios from 'axios';
import { refreshAccessToken } from '@/redux/slice/users';
import { getTokensFromLocalStorage, saveTokensToLocalStorage } from './authUtils';
import store from '../redux/store/store';

axios.interceptors.response.use(
    (response) => response,
    async (error) => {
        if (error.response.status === 401) {
            try {
                const { accessToken, refreshToken } = getTokensFromLocalStorage();
                if (refreshToken) {
                    const dispatch = store.dispatch;
                    const resultAction = await dispatch(refreshAccessToken({ refresh_token: refreshToken }))
                    if (refreshAccessToken.fulfilled.match(resultAction)) {
                        const { access_token, refresh_token: new_refresh_token } = resultAction.payload;
                        error.config.headers['Authorization'] = `Bearer ${access_token}`;
                        saveTokensToLocalStorage(access_token, new_refresh_token);
                        return axios.request(error.config);
                    } else {
                        return Promise.reject(resultAction.payload);
                    }
                }
            } catch (err) {
                return Promise.reject(err);
            }
        }
        return Promise.reject(error);
    }
);
