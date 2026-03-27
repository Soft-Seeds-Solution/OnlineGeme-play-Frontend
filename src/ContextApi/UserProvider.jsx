import { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import UserContext from './UserContext';

function UserProvider({ children }) {
    const [catHover, setCatHover] = useState("Close")
    const [signUser, setSignUser] = useState(() => {
        return JSON.parse(sessionStorage.getItem("userData")) || null;
    });

    useEffect(() => {
        const getSignUser = sessionStorage.getItem("userData");
        if (getSignUser) {
            setSignUser(JSON.parse(getSignUser));
        }
    }, []);

    return (
        <UserContext.Provider value={{ signUser, setSignUser, catHover, setCatHover }}>
            {children}
        </UserContext.Provider>
    )
}

UserProvider.propTypes = {
    children: PropTypes.node.isRequired
}

export default UserProvider;