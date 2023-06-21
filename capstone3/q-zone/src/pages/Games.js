import {useEffect, useContext, useState} from 'react';
import {Container, Row} from 'react-bootstrap';
import {Link, useNavigate, useParams} from 'react-router-dom';

import ProductCard from '../components/ProductCard.js';
import UserContext from '../AppContext.js';

export default function Games() {

	const {index} = useParams();
	const {user} = useContext(UserContext);
	const [games, setGames] = useState([]);

	const navigate = useNavigate();
	const indexOffset = 6;


	useEffect(() => {
		if (user.isAdmin == 'true' || user.isAdmin == true) {
			navigate('/notAccessible');
		}

		fetch(`${process.env.REACT_APP_API_URL}/products/getActiveProducts`, {
			method: 'GET',
			headers: {
				'Authorization': `Bearer ${localStorage.getItem('token')}`
			}
		}).then(result => result.json())
		.then(data => {
			if (data) {
				setGames([]);
				data.reverse().forEach(product => {
					product.index = index;
					if (product.category === 'Game') {
						setGames(oldArray => [...oldArray, <ProductCard key={product._id} productProp={product} />]);
					}
				});
			}
		}).catch(error => console.log(error));
	}, [index]);

	const PreviousLink = () => {
		return(
			Number(index) >= indexOffset ? 
			<Link to={'/games/' + (Number(index) - indexOffset)} className="text-warning fw-bolder mx-3">Previous</Link>
			:
			<></>
		);
	}

	const NextLink = () => {
		return(
			games.length > (Number(index) + indexOffset) ?
			<Link to={'/games/' + (Number(index) + indexOffset)} className="text-warning fw-bolder mx-3">Next</Link>
			:
			<></>
		);
	}

	return(
		<Container className="text-light">
			<h1 className="my-5 text-center">See all of our Games here!</h1>
			<p className="my-5 text-center">
				<i>** Please note that we are only selling physical copies for all of our games.</i>
			</p>
			<Row className="mt-5">
				{games.length > Number(index) ? games[Number(index)] : <></>}
				{games.length > (Number(index) + 1) ? games[Number(index) + 1] : <></>}
				{games.length > (Number(index) + 2) ? games[Number(index) + 2] : <></>}
			</Row>
			<Row className="mt-2">
				{games.length > (Number(index) + 3) ? games[Number(index) + 3] : <></>}
				{games.length > (Number(index) + 4) ? games[Number(index) + 4] : <></>}
				{games.length > (Number(index) + 5) ? games[Number(index) + 5] : <></>}
			</Row>
			<div className="d-flex justify-content-center my-5">
				<PreviousLink />
				<NextLink />
			</div>
		</Container>
	);
}
