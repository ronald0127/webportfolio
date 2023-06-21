import {useContext, useEffect, useState} from 'react';
import {Container, Row, Form, InputGroup} from 'react-bootstrap';
import {Link, useParams, useNavigate} from 'react-router-dom';

import ProductCard from '../components/ProductCard.js';
import UserContext from '../AppContext.js';


export default function Products() {

	const {user} = useContext(UserContext);
	const {index} = useParams();

	const navigate = useNavigate();

	const [products, setProducts] = useState([]);
	const [productsData, setProductsData] = useState([]);
	const [dataList, setDataList] = useState([])

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
			if (data) {
				setDataList([]);
				setProducts([]);
				setProductsData([]);

				setDataList(data);
				setProducts(data.reverse().map(product => {
					product.index = index;
					return(
						<ProductCard key={product._id} productProp={product} id={product._id}/>
					);
				}));
				setProductsData(data.map(product => {
					return(
						<option value={product._id}>{product.name}</option>
					);
				}));
			}
		}).catch(error => console.log(error));
	}, [index]);

	const PreviousLink = () => {
		let prevClassName = "text-warning fw-bolder mt-3";
		if (products.length > (Number(index) + 5)) {
			prevClassName = "text-warning fw-bolder mt-3 me-5";
		}

		return(
			Number(index) >= 5 ? 
			<Link to={'/products/' + (Number(index) - 5)} className={prevClassName}>Previous</Link>
			:
			<></>
		);
	}

	const NextLink = () => {
		return(
			products.length > (Number(index) + 5) ?
			<Link to={'/products/' + (Number(index) + 5)} className="text-warning fw-bolder mt-3">Next</Link>
			:
			<></>
		);
	}

	function searchProduct(event) {
		if (event.key === 'Enter') {
			const lookForID = event.target.value;
			let indexToNavigate = 0;
			for (let i = 0; i < dataList.length; i++) {
				if (lookForID == dataList[i]._id) {
					indexToNavigate = i;
					break;
				}
			}
			indexToNavigate = Math.floor(indexToNavigate / 5);
			console.log(indexToNavigate);
			navigate(`/products/${indexToNavigate*5}`);
			event.target.value = '';
		}
	}

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
				    	onKeyPress={event => searchProduct(event)}
				    	list="productNamesAndIds"
					/>
					<datalist id="productNamesAndIds">
						{productsData}
					</datalist>
				</InputGroup>
				{products.length > Number(index) ? products[Number(index)] : <></>}
				{products.length > (Number(index) + 1) ? products[Number(index) + 1] : <></>}
				{products.length > (Number(index) + 2) ? products[Number(index) + 2] : <></>}
				{products.length > (Number(index) + 3) ? products[Number(index) + 3] : <></>}
				{products.length > (Number(index) + 4) ? products[Number(index) + 4] : <></>}
				<div className="d-flex justify-content-end">
					<PreviousLink />
					<NextLink />
				</div>
			</Row>
		</Container>
	);
}
