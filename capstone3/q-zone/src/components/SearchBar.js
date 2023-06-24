import {Container, Row, Col, InputGroup, Form, Button} from 'react-bootstrap';
import {useNavigate, useLocation} from 'react-router-dom';
import {useEffect, useState, useContext} from 'react';

import UserContext from '../AppContext.js';


export default function SearchBar() {

	const location = useLocation();
	const navigate = useNavigate();

	const {user} = useContext(UserContext);
	const [isSearchBarVisible, setIsSearchBarVisible] = useState(false);
	const [dataList, setDataList] = useState([]);
	const [rawData, setRawData] = useState([]);


	useEffect(() => {
		const currentPath = location.pathname;

		if (user.isAdmin == 'true' || user.isAdmin == true) {
			setIsSearchBarVisible(false);
		}
		else if (currentPath == '/' || currentPath.substring(0,7) == '/movies' 
			|| currentPath.substring(0,7) == '/series' || currentPath.substring(0,6) == '/games'
			|| currentPath.substring(0,7) == '/search') {
				setIsSearchBarVisible(true);
		}
		else {
			setIsSearchBarVisible(false);
		}
	}, [location]);

	useEffect(() => {
		fetch(`${process.env.REACT_APP_API_URL}/products/getActiveProducts`)
		.then(result => result.json())
		.then(data => {
			if (data) {
				setDataList([]);
				setRawData(data);
				setDataList(data.reverse().map(product => {
					return(
						<option key={product._id} value={product.name} />
					);
				}));
			}
		}).catch(error => console.log(error));
	}, []);

	function searchProduct(event) {
		if (event.key === 'Enter') {
			let searchIndex = -1;
			let category = '';
			let prodId = '';

			rawData.forEach(product => {
				if (product.name == event.target.value) {
					prodId = product._id;
					category = product.category;
				}
			});

			for (let i = 0; i < rawData.length; i++) {
				if (category == rawData[i].category) {
					searchIndex++;
				}
				if (prodId == rawData[i]._id) {
					break;
				}
			}

			prodId = prodId === '' ? 'notFound' : prodId;
			if (searchIndex >= 0) {
				navigate(`/search/${searchIndex}/${prodId}`);
			}
		}
	}

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
							list="prodData"
							onKeyPress={event => searchProduct(event)}
						/>
						<InputGroup.Text id="basic-addon2" className="bg-dark text-info">
							Search
						</InputGroup.Text>
						<datalist id="prodData">
							{dataList}
						</datalist>
					</InputGroup>
				</Col>
			</Row>
		</Container>
		:
		<></>
	);
}
