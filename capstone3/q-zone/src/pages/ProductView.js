import {Container, Row, Col, Card, Button} from 'react-bootstrap';
import {Link, useNavigate, useParams} from 'react-router-dom';
import {useEffect, useContext, useState} from 'react';

import React from 'react';
import {ToastContainer, toast} from 'react-toastify';

import UserContext from '../AppContext.js';
import YoutubeEmbed from '../components/YoutubeEmbed.js';


export default function ProductView() {

	const navigate = useNavigate();
	const {user} = useContext(UserContext);
	const {index, prodId} = useParams();

	const [name, setName] = useState('');
	const [description, setDescription] = useState('');
	const [price, setPrice] = useState('');
	const [category, setCategory] = useState('');
	const [clip, setClip] = useState('');
	const [goBackLink, setGoBackLink] = useState('');
	const [quantity, setQuantity] = useState(1);

	const buy = 'buy';
	const rent = 'rent';


	useEffect(() => {
		if (user.isAdmin == 'true' || user.isAdmin == true) {
			navigate('/notAccessible');
		}

		fetch(`${process.env.REACT_APP_API_URL}/products/getProduct/${prodId}`)
		.then(result => result.json())
		.then(data => {
			if (data) {
				setName(data.productDetails.name);
				setDescription(data.productDetails.description);
				setPrice(data.productDetails.price);
				setCategory(data.productDetails.category);
				setClip(data.productDetails.clip);
				setQuantity(1);

				switch(data.productDetails.category) {
					case 'Movie':
						setGoBackLink(`/movies/${index}`);
						break;
					case 'Series':
						setGoBackLink(`/series/${index}`);
						break;
					case 'Game':
						setGoBackLink(`/games/${index}`);
						break;
				}
			}
			else {
				console.log(`Error! Connection problem: ${data}`);
			}
		}).catch(error => console.log(error));
	}, []);

	function sendToCart(orderType) {
		const orderMsg = orderType == 'buy' ? 'purchase' : 'rent';
		const order = [orderType, quantity];
		localStorage.setItem(prodId, order);

		toast.success(`${category}: ${name} was successfully added to your cart for ${orderMsg}. Thank you!`, {
      		position: toast.POSITION.TOP_RIGHT,
      		autoClose: 10000,
      		className: 'toast-message'
    	});
    	toast.info('New item found in cart!');
	}

	return(
		<Container>
			<Row>
				<Col className="col-12 mb-5">
					<h1 className="text-center text-info my-5">{name}</h1>
					<Card className="bg-dark border border-5 border-danger mb-5">
					 	<YoutubeEmbed embedId={clip} />
						<Card.Body className="text-light">
					    	<Card.Title>Description:</Card.Title>
					    	<Card.Text>{description}</Card.Text>
					    	<Card.Title>Category:</Card.Title>
					    	<Card.Text className="border-bottom border-2 border-danger pb-4">{category}</Card.Text>
					    	<div className="d-flex flex-row py-3">
					    	{
					    		category === 'Movie' || category === 'Series' ?
					    		<>
					    			<Button className="bg-info text-dark fw-bold p-3" 
					    				onClick={() => sendToCart(buy)}>
					    					Buy for PhP {price}
					    			</Button>
					    			<Button className="bg-info text-dark fw-bold p-3 ms-4" 
					    				onClick={() => sendToCart(rent)}>
					    					Rent for PhP {price/5}
					    			</Button>
					    		</>
					    		:
					    		<>
					    			<Button className="bg-info text-dark fw-bold p-3" onClick={() => sendToCart(buy)}>
					    				Buy for PhP {price}
					    			</Button>
					    			<select onChange={event => setQuantity(event.target.value)}
					    				className="fw-bold ms-1 ms-md-3 border border-5 border-success">
					    				<option defaultValue disabled className="fw-bold">Select Quantity</option>
					    				<option value="1">1 Pc.</option>
					    			    <option value="2">2 Pcs.</option>
					    				<option value="3">3 Pcs.</option>
					    				<option value="4">4 Pcs.</option>
					    			    <option value="5">5 Pcs.</option>
					    			    <option value="6">6 Pcs.</option>
					    			    <option value="7">7 Pcs.</option>
					    			    <option value="8">8 Pcs.</option>
					    			    <option value="9">9 Pcs.</option>
					    			    <option value="10">10 Pcs.</option>
									</select>
					    		</>
					    	}
					    	</div>
						</Card.Body>
					</Card>
					<div className="d-flex flex-row justify-content-center">
						<Link to={goBackLink} className="text-warning fw-bolder">Go Back</Link>
					</div>
					<ToastContainer />
				</Col>
			</Row>
		</Container>
	);
}
