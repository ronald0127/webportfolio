import {Container, Navbar, Nav} from 'react-bootstrap';
import {Link, NavLink} from 'react-router-dom';
import {useContext} from 'react';

import UserContext from '../AppContext.js';


export default function AppNavBar() {

	const {user} = useContext(UserContext);	
	let marginBrand = 'd-none d-md-flex flex-row text-dark';

	if (user.id != null) {
		marginBrand = 'd-none d-md-flex flex-row text-dark ms-4';
	}

	return(
		<Navbar bg="dark" data-bs-theme="dark">
			<Container>
				<Navbar.Brand as={Link} to="/" className={marginBrand}>
					<img className="img-fluid my-auto"
						src="https://img.freepik.com/premium-vector/joystick-controller-cartoon-vector-illustration_484148-198.jpg"
						alt="joystick-controller.jpg"
						style={{"height": "40px"}} />
					<h2 className="bg-warning px-1 my-auto ms-1">QUAKE-</h2>
					<h2 className="bg-danger px-1 my-auto">ZONE</h2>
				</Navbar.Brand>
			    <Nav className="text-light ms-auto mt-1">
			    	{
			    		user.isAdmin == 'true' || user.isAdmin == true ?
			    		<>
			    			<Nav.Link as={NavLink} to="/products/0"><h5>Products</h5></Nav.Link>
			    		</>
			    		:
			    		<>
			    			<Nav.Link as={NavLink} to="/"><h5>Home</h5></Nav.Link>
			    			<Nav.Link as={NavLink} to="/movies" className="d-none d-sm-flex"><h5>Movies</h5></Nav.Link>
			    			<Nav.Link as={NavLink} to="/series" className="d-none d-sm-flex"><h5>Series</h5></Nav.Link>
			    			<Nav.Link as={NavLink} to="/games" className="d-none d-sm-flex"><h5>Games</h5></Nav.Link>
			    		</>
			    	}
					{
						user.id === null ?
						<>
							<Nav.Link as={NavLink} to="/register" className="d-none d-sm-flex">
								<h5>Register</h5>
							</Nav.Link>
							<Nav.Link as={NavLink} to="/login">
								<h5>Login</h5>
							</Nav.Link>
						</>
						:
						<Nav.Link as={NavLink} to="/logout">
							<h5>Logout</h5>
						</Nav.Link>
					}
			    </Nav>
			</Container>
		</Navbar>
	);
}
