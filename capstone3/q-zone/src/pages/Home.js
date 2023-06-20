import {useEffect, useContext, useState} from 'react';
import {Container, Row} from 'react-bootstrap';
import {Link, useNavigate} from 'react-router-dom';

import ProductCard from '../components/ProductCard.js';
import UserContext from '../AppContext.js';


export default function Home() {

	const {user} = useContext(UserContext);
	const [products, setProducts] = useState([]);
	
	const navigate = useNavigate();

	useEffect(() => {
		if (user.isAdmin == 'true' || user.isAdmin == true) {
			navigate('/products');
		}

		fetch(`${process.env.REACT_APP_API_URL}/products/getActiveProducts`, {
			method: 'GET',
			headers: {
				'Authorization': `Bearer ${localStorage.getItem('token')}`
			}
		}).then(result => result.json())
		.then(data => {
			console.log(data);
			if (data) {
				setProducts(data.map(product => {
					return(
						<ProductCard key={product._id} productProp={product} />
					);
				}));
			}
		}).catch(error => console.log(error));
	}, []);

	return(
		<Container className="text-light">
			<Row className="mt-5">
				<h1 className="mb-3">Latest Movies</h1>
				{products}
				<Link to='/movies' className="mt-3 text-warning"><h5>See More</h5></Link>
			</Row>
			<Row className="mt-5">
				<h1 className="mb-3">Latest Series</h1>
				{products}
				<Link to='/series' className="mt-3 text-warning"><h5>See More</h5></Link>
			</Row>
			<Row className="my-5">
				<h1 className="mb-3">Latest Games</h1>
				{products}
				<Link to='/games' className="mt-3 text-warning"><h5>See More</h5></Link>
			</Row>
		</Container>
	);
}
