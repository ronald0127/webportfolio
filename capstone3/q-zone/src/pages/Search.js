import {useEffect, useContext, useState} from 'react';
import {Container, Row} from 'react-bootstrap';
import {useParams, useNavigate} from 'react-router-dom';

import ProductCard from '../components/ProductCard.js';
import UserContext from '../AppContext.js';


export default function Search() {

	const {index, prodId} = useParams();
	const {user} = useContext(UserContext);
	const [searchedProdCard, setSearchedProdCard] = useState('');

	const navigate = useNavigate();

	useEffect(() => {
		if (user.isAdmin == 'true' || user.isAdmin == true) {
			navigate('/notAccessible');
		}

		fetch(`${process.env.REACT_APP_API_URL}/products/getProduct/${prodId}`)
		.then(result => result.json())
		.then(data => {
			if (data) {
				const indexToNavigate = Math.floor(index / 6);
				data.productDetails.index = indexToNavigate * 6;
				setSearchedProdCard(<ProductCard key={data.productDetails._id} productProp={data.productDetails} />);
			}
		}).catch(error => console.log(error));
	}, [index, prodId]);

	function SearchFoundorNot() {
		return(
			index == -1 && prodId == 'notFound' ?
			<h3 className="my-5 text-center">Item not Found!</h3>
			:
			<>{searchedProdCard}</>
		);
	}

	return(
		<Container className="text-light min-vh-100">
			<h1 className="my-5 text-center">Search Result</h1>
			<Row className="mt-5">
				<SearchFoundorNot />
			</Row>
		</Container>
	);
}
