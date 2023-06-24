import {Container, Row, Col, InputGroup, Form} from 'react-bootstrap';
import {useNavigate, useLocation} from 'react-router-dom';
import {useEffect, useState, useContext} from 'react';

import UserContext from '../AppContext.js';


export default function SearchBar() {

	const location = useLocation();
	const navigate = useNavigate();

	const {user} = useContext(UserContext);
	const [isSearchBarVisible, setIsSearchBarVisible] = useState(false);

	useEffect(() => {
		const currentPath = location.pathname;

		if (user.isAdmin == 'true' || user.isAdmin == true) {
			setIsSearchBarVisible(false);
		}
		else if (currentPath == '/' || currentPath.substring(0,7) == '/movies' 
			|| currentPath.substring(0,7) == '/series' || currentPath.substring(0,6) == '/games') {
				setIsSearchBarVisible(true);
		}
		else {
			setIsSearchBarVisible(false);
		}
	}, [location]);

	return(
		isSearchBarVisible ?
		<Container>
			<Row>
				<Col className="col-12 col-lg-6 mx-auto mt-5">
					<InputGroup>
						<Form.Control
							placeholder="Search here..."
							aria-label="Search here..."
							aria-describedby="basic-addon2"
						/>
						<InputGroup.Text id="basic-addon2" className="bg-dark text-info">Search</InputGroup.Text>
					</InputGroup>
				</Col>
			</Row>
		</Container>
		:
		<></>
	);
}
