import {useEffect, useContext, useState} from 'react';
import {Container, Row} from 'react-bootstrap';
import {Link, useNavigate, useParams} from 'react-router-dom';

import ProductCard from '../components/ProductCard.js';
import UserContext from '../AppContext.js';

export default function Movies() {

	const {index} = useParams();
	const {user} = useContext(UserContext);
	const [movies, setMovies] = useState([]);

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
				setMovies([]);
				data.reverse().forEach(product => {
					product.index = index;
					if (product.category === 'Movie') {
						setMovies(oldArray => [...oldArray, <ProductCard key={product._id} productProp={product} />]);
					}
				});
			}
		}).catch(error => console.log(error));
	}, []);

	const PreviousLink = () => {
		return(
			Number(index) >= indexOffset ? 
			<Link to={'/movies/' + (Number(index) - indexOffset)} className="text-warning fw-bolder mx-3">Previous</Link>
			:
			<></>
		);
	}

	const NextLink = () => {
		return(
			movies.length > (Number(index) + indexOffset) ?
			<Link to={'/movies/' + (Number(index) + indexOffset)} className="text-warning fw-bolder mx-3">Next</Link>
			:
			<></>
		);
	}

	return(
		<Container className="text-light">
			<h1 className="my-5 text-center">Watch Movies Here</h1>
			<Row className="mt-5">
				{movies.length > Number(index) ? movies[Number(index)] : <></>}
				{movies.length > (Number(index) + 1) ? movies[Number(index) + 1] : <></>}
				{movies.length > (Number(index) + 2) ? movies[Number(index) + 2] : <></>}
			</Row>
			<Row className="mt-2">
				{movies.length > (Number(index) + 3) ? movies[Number(index) + 3] : <></>}
				{movies.length > (Number(index) + 4) ? movies[Number(index) + 4] : <></>}
				{movies.length > (Number(index) + 5) ? movies[Number(index) + 5] : <></>}
			</Row>
			<div className="d-flex justify-content-center my-5">
				<PreviousLink />
				<NextLink />
			</div>
		</Container>
	);
}
