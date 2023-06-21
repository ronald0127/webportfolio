import {useEffect, useContext, useState} from 'react';
import {Container, Row} from 'react-bootstrap';
import {Link, useNavigate} from 'react-router-dom';

import ProductCard from '../components/ProductCard.js';
import UserContext from '../AppContext.js';


export default function Home() {

	const {user} = useContext(UserContext);
	const [movies, setMovies] = useState([]);
	const [series, setSeries] = useState([]);
	const [games, setGames] = useState([]);
	
	const navigate = useNavigate();

	useEffect(() => {
		if (user.isAdmin == 'true' || user.isAdmin == true) {
			navigate('/products/0');
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
				setSeries([]);
				setGames([]);
				let m = 0, s = 0, g = 0;
				data.reverse().forEach(product => {
					product.index = 0;
					if (product.category === 'Movie' && m < 3) {
						setMovies(oldArray => [...oldArray, <ProductCard key={product._id} productProp={product} />]);
						m++;
					}
					else if (product.category === 'Series' && s < 3) {
						setSeries(oldArray => [...oldArray, <ProductCard key={product._id} productProp={product} />]);
						s++;
					}
					else if (product.category === 'Game' && g < 3) {
						setGames(oldArray => [...oldArray, <ProductCard key={product._id} productProp={product} />]);
						g++;
					}
				});
			}
		}).catch(error => console.log(error));
	}, []);

	return(
		<Container className="text-light">
			<Row className="mt-5">
				<h1 className="mb-4 text-center">Latest Movies</h1>
				{movies}
				<Link to='/movies/0' className="mt-3 mb-2 text-warning"><h5>See More</h5></Link>
			</Row>
			<Row className="mt-5">
				<h1 className="mb-4 text-center">Latest Series</h1>
				{series}
				<Link to='/series/0' className="mt-3 text-warning"><h5>See More</h5></Link>
			</Row>
			<Row className="my-5">
				<h1 className="mb-4 text-center">Latest Games</h1>
				{games}
				<Link to='/games/0' className="mt-3 text-warning"><h5>See More</h5></Link>
			</Row>
		</Container>
	);
}
