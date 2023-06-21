import {Container, Row, Col, Button, Form} from 'react-bootstrap';
import {useState, useEffect, useContext} from 'react';
import {useNavigate, useParams, Link} from 'react-router-dom';
import {HashLink} from 'react-router-hash-link';

import Swal2 from 'sweetalert2';
import YoutubeEmbed from '../components/YoutubeEmbed.js';
import UserContext from '../AppContext.js';

export default function UpdateProduct() {

	const navigate = useNavigate();
	const {index, prodId} = useParams();
	const {user} = useContext(UserContext);

	const [isDisabled, setIsDisabled] = useState(true);
	const [name, setName] = useState('');
	const [description, setDescription] = useState('');
	const [price, setPrice] = useState('');
	const [category, setCategory] = useState('');
	const [clip, setClip] = useState('');

	useEffect(() => {
		if (user.isAdmin == false || user.isAdmin == 'false' || user.isAdmin == null) {
			navigate('/notAccessible');
		}

		if (name === '' || description === '' || price === ''
			|| clip === '' || category === 'Select category'
			|| price > 999999) {
			setIsDisabled(true);
		}
		else {
			setIsDisabled(false);
		}
	}, [name, description, price, category, clip]);

	useEffect(() => {
		getProdDetails();
	}, []);

	function getProdDetails() {
		fetch(`${process.env.REACT_APP_API_URL}/products/getProduct/${prodId}`)
		.then(result => result.json())
		.then(data => {
			if (data) {
				setName(data.productDetails.name);
				setDescription(data.productDetails.description);
				setPrice(data.productDetails.price);
				setCategory(data.productDetails.category);
				setClip(data.productDetails.clip);
			}
			else {
				console.log(`Error! Connection problem: ${data}`);
			}
		}).catch(error => console.log(error));
	}

	function updateProduct(event) {
		event.preventDefault();

		fetch(`${process.env.REACT_APP_API_URL}/products/updateProduct/${prodId}`, {
			method: 'PATCH',
			headers: {
				'Authorization': `Bearer ${localStorage.getItem('token')}`,
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				name: name,
				description: description,
				price: price,
				category: category,
				clip: clip
			})
		}).then(result => result.json())
		.then(data => {
			if (data) {
				Swal2.fire({
					title: 'Update Product<br>Successful!',
					icon: 'success',
					html: 'Product was updated<br>successfully!',
					color: 'black',
					background: '#fff url(https://img.freepik.com/free-vector/hand-drawn-international-cat-day-background-with-cats_23-2149454620.jpg)'
				});
				navigate(`/products/${index}`);
			}
			else {
				Swal2.fire({
					title: 'Update Product<br>Failed!',
					icon: 'error',
					html: 'There seems to be a<br>problem right now.<br>Try again later.',
					color: 'black',
					background: '#fff url(https://img.freepik.com/free-vector/hand-drawn-international-cat-day-background-with-cats_23-2149454620.jpg)'
				});
			}
		}).catch(error => console.log(error));
	}

	return(
		<Container>
			<Row>
				<Col className="col-12 col-md-6 mx-auto mb-4 text-light">
					<h1 className="my-5 text-center text-info">Update Product</h1>
					<Form onSubmit={event => updateProduct(event)} id="add-product-form">
						<Form.Group className="mb-3" controlId="formBasicName">
					    	<Form.Label>Product Name</Form.Label>
					    	<Form.Control type="text" value={name} 
					        	onChange={event => setName(event.target.value)} 
					        	placeholder="Enter product name." 
					        	maxLength={50} />
						</Form.Group>

						<Form.Group className="mb-3" controlId="formBasicDescription">
					    	<Form.Label>Product Description (Max 100 chars.)</Form.Label>
					    	<Form.Control type="text" value={description} 
					        	onChange={event => setDescription(event.target.value)} 
					        	placeholder="Enter product description." 
					        	maxLength={200} />
						</Form.Group>

						<Form.Group className="mb-3" controlId="formBasicPrice">
					    	<Form.Label>Price</Form.Label>
					    	<Form.Control type="number" value={price} 
					        	onChange={event => setPrice(event.target.value)} 
					        	placeholder="Enter product price." />
						</Form.Group>

						<Form.Group className="mb-3" controlId="formBasicCategory">
					    	<Form.Label>Category</Form.Label>
					    	<Form.Select aria-label="Default select example"
					    		value={category}
					    		onChange={event => setCategory(event.target.value)} >
					    		<option>Select category</option>
								<option>Movie</option>
					    		<option>Series</option>
					    		<option>Game</option>
					    	</Form.Select>
						</Form.Group>

						<Form.Group className="mb-3" controlId="formBasicClip">
					    	<Form.Label>Product Video Clip</Form.Label>
					    	<Form.Control type="text" value={clip} 
					        	onChange={event => setClip(event.target.value)} 
					        	placeholder="Enter youtube code here." />
					        <YoutubeEmbed embedId={clip} />
						</Form.Group>

						<div className="d-flex flex-row">
							<Button variant="primary" type="submit" disabled={isDisabled} 
					    		className="my-5 px-4 bg-info text-dark fw-bold">
					    			Update
					    	</Button>
					    	<Button as={HashLink} smooth to={`/products/${index}/#${prodId}`}
					        	className="ms-auto my-5 px-4 bg-info text-dark fw-bold">
					        		Go Back
					    	</Button>
					    </div>
					</Form>
				</Col>
			</Row>
		</Container>
	);
}
