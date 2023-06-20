import {Navigate} from 'react-router-dom';
import {useEffect, useContext} from 'react';

import UserContext from '../AppContext.js';

export default function Logout() {

	const {setUser, unsetUser} = useContext(UserContext);

	useEffect(() => {
		unsetUser();
		setUser({
			id: null,
			isAdmin: null
		});
	}, []);

	return (
		<Navigate to='/login' />
	);
}
