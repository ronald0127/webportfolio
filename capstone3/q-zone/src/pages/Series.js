import {useEffect, useContext, useState} from 'react';
import {Container, Row} from 'react-bootstrap';
import {Link, useNavigate, useParams} from 'react-router-dom';

import ProductCard from '../components/ProductCard.js';
import UserContext from '../AppContext.js';

export default function Series() {

	const {index} = useParams();
	const {user} = useContext(UserContext);
	const [series, setSeries] = useState([]);

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
				setSeries([]);
				data.reverse().forEach(product => {
					product.index = index;
					if (product.category === 'Series') {
						setSeries(oldArray => [...oldArray, <ProductCard key={product._id} productProp={product} />]);
					}
				});
			}
		}).catch(error => console.log(error));
	}, [index]);

	const PreviousLink = () => {
		return(
			Number(index) >= indexOffset ? 
			<Link to={'/series/' + (Number(index) - indexOffset)} className="text-warning fw-bolder mx-3">Previous</Link>
			:
			<></>
		);
	}

	const NextLink = () => {
		return(
			series.length > (Number(index) + indexOffset) ?
			<Link to={'/series/' + (Number(index) + indexOffset)} className="text-warning fw-bolder mx-3">Next</Link>
			:
			<></>
		);
	}

	return(
		<Container className="text-light min-vh-100">
			<h1 className="my-5 text-center">Watch Series Here</h1>
			<Row className="mt-5">
				{series.length > Number(index) ? series[Number(index)] : <></>}
				{series.length > (Number(index) + 1) ? series[Number(index) + 1] : <></>}
				{series.length > (Number(index) + 2) ? series[Number(index) + 2] : <></>}
			</Row>
			<Row className="mt-2">
				{series.length > (Number(index) + 3) ? series[Number(index) + 3] : <></>}
				{series.length > (Number(index) + 4) ? series[Number(index) + 4] : <></>}
				{series.length > (Number(index) + 5) ? series[Number(index) + 5] : <></>}
			</Row>
			<div className="d-flex justify-content-center my-5">
				<PreviousLink />
				<NextLink />
			</div>
		</Container>
	);
}
