import {useContext, useEffect, useState} from 'react';
import {Container, Row, Form, InputGroup} from 'react-bootstrap';
import {Link, useNavigate} from 'react-router-dom';

import ProductCard from '../components/ProductCard.js';
import UserContext from '../AppContext.js';


export default function Products() {

	const {user} = useContext(UserContext);
	const [products, setProducts] = useState([]);
	const [productsData, setProductsData] = useState([]);

	useEffect(() => {
		if (user.isAdmin == false || user.isAdmin == 'false' || user.isAdmin == null) {
			navigate('/notAccessible');
		}

		fetch(`${process.env.REACT_APP_API_URL}/products/getAllProducts`, {
			method: 'GET',
			headers: {
				'Authorization': `Bearer ${localStorage.getItem('token')}`
			}
		}).then(result => result.json())
		.then(data => {
			console.log(data);
			if (data) {
				setProductsData(data);
				setProducts(data.map(product => {
					return(
						<ProductCard key={product._id} productProp={product} />
					);
				}));
			}
		}).catch(error => console.log(error));
	}, []);

	return(
		<Container>
			<Row className="my-5 text-light">
				<h1 className="text-center my-3 text-info">Products</h1>
				<InputGroup className="mb-4 mt-3">
					<InputGroup.Text id="inputGroup-sizing-default" className="bg-dark text-light">
				    	Search Product
					</InputGroup.Text>
					<Form.Control
				    	aria-label="Default"
				    	aria-describedby="inputGroup-sizing-default"
				    	placeholder="Type product ID or name to search product."
					/>
				</InputGroup>
				{products}
			</Row>
		</Container>
	);
}
