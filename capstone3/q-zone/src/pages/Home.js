import {useEffect, useContext} from 'react';
import {Container, Row} from 'react-bootstrap';
import {Link, useNavigate} from 'react-router-dom';

import ProductCard from '../components/ProductCard.js';
import UserContext from '../AppContext.js';


export default function Home() {

	const {user} = useContext(UserContext);
	const navigate = useNavigate();

	useEffect(() => {
		if (user.isAdmin == 'true' || user.isAdmin == true) {
			navigate('/products');
		}
	}, []);

	return(
		<Container className="text-light">
			<Row className="mt-5">
				<h1 className="mb-3">Latest Movies</h1>
				<ProductCard />
				<Link to='/movies' className="mt-3 text-warning">See More</Link>
			</Row>
			<Row className="mt-5">
				<h1 className="mb-3">Latest Series</h1>
				<ProductCard />
				<Link to='/series' className="mt-3 text-warning">See More</Link>
			</Row>
			<Row className="my-5">
				<h1 className="mb-3">Latest Games</h1>
				<ProductCard />
				<Link to='/games' className="mt-3 text-warning">See More</Link>
			</Row>
		</Container>
	);
}
