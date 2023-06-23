import {React, useContext} from 'react';
import {slide as Menu} from 'react-burger-menu';
import {Link} from 'react-router-dom';

import {FaBell} from 'react-icons/fa';
import {toast} from 'react-toastify';

import UserContext from '../AppContext.js';


export default function SideBar() {

	const {user} = useContext(UserContext);

	const FinalSideBar = () => {
		return (
			user.isAdmin == 'false' || user.isAdmin == false ?
			<Menu>
				{/*<Link className="menu-item" to="/profile">
					My Profile
				</Link>
				<Link className="menu-item" to="/watchlist">
					My Watchlist
				</Link>*/}
				<Link className="menu-item notification-icon" to="/cart">
					Cart
					<FaBell className="ms-2 bg-danger"/>
				</Link>
				<Link className="menu-item" to="/orders">
					Orders
				</Link>
			</Menu>
			:
			<Menu>
				<Link className="menu-item" to="/addProduct">
					Add Products
				</Link>
				<Link className="menu-item" to="/setAdmin">
					Set User as Admin
				</Link>
			</Menu>
		);
	}

	return(
		user.isAdmin === null ? 
		<>
		</>
		:
		<FinalSideBar />
	);
}
