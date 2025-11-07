import React from 'react';
import {
    useNavigate,
} from 'react-router';
import useRouterStore from '~/hooks/use-router-store';

const RouterContextInjector = () => {
    const navigate = useNavigate();
    const { setRouterContext } = useRouterStore();

    React.useEffect(() => {
        setRouterContext({
            navigate,
        });
    }, [navigate]);

    return null;
};

export default RouterContextInjector