import { useDispatch, useSelector } from 'react-redux';
import { login, logout, register } from '../redux/authSlice';

export const useAuth = () => {
    const dispatch = useDispatch();
    const { user, status, token } = useSelector((state) => state.auth);

    return {
        user,
        status,
        isAuthenticated: status === 'authenticated',
        // A token exists but /users/me hasn't answered yet.
        isResolving: Boolean(token) && (status === 'idle' || status === 'loading'),
        login: (credentials) => dispatch(login(credentials)).unwrap(),
        register: (data) => dispatch(register(data)).unwrap(),
        logout: () => dispatch(logout()),
    };
};
