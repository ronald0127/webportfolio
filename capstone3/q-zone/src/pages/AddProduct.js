import {Container, Row, Col, Button, Form} from 'react-bootstrap';
import {useState, useEffect, useContext} from 'react';
import {useNavigate} from 'react-router-dom';

import Swal2 from 'sweetalert2';
import YoutubeEmbed from '../components/YoutubeEmbed.js';
import UserContext from '../AppContext.js';


export default function AddProduct() {

	const navigate = useNavigate();
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
			|| clip === '' || category === 'Select category') {
			setIsDisabled(true);
		}
		else {
			setIsDisabled(false);
		}
	}, [name, description, price, category, clip]);

	function addProduct(event) {
		event.preventDefault();

		fetch(`${process.env.REACT_APP_API_URL}/products/addProduct`, {
			method: 'POST',
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
					title: 'Add Product Successful!',
					icon: 'success',
					html: 'Product was added<br>successfully!',
					color: 'black',
					background: '#fff url(https://img.freepik.com/free-vector/hand-drawn-international-cat-day-background-with-cats_23-2149454620.jpg)'
				});
			}
			else {
				Swal2.fire({
					title: 'Add Product Failed!',
					icon: 'error',
					html: 'There seems to be a<br>problem right now.<br>Try again later.',
					color: 'black',
					background: '#fff url(https://img.freepik.com/free-vector/hand-drawn-international-cat-day-background-with-cats_23-2149454620.jpg)'
				})
			}
		}).catch(error => console.log(error));
	}

	return(
		<Container>
			<Row>
				<Col className="col-12 col-md-6 mx-auto mb-4 text-light">
					<h1 className="my-5 text-center text-info">Add Product</h1>
					<Form onSubmit={event => addProduct(event)}>
						<Form.Group className="mb-3" controlId="formBasicName">
					    	<Form.Label>Product Name</Form.Label>
					    	<Form.Control type="text" value={name} 
					        	onChange={event => setName(event.target.value)} 
					        	placeholder="Enter product name." />
						</Form.Group>

						<Form.Group className="mb-3" controlId="formBasicDescription">
					    	<Form.Label>Product Description</Form.Label>
					    	<Form.Control type="text" value={description} 
					        	onChange={event => setDescription(event.target.value)} 
					        	placeholder="Enter product description." />
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

						<Button variant="primary" type="submit" disabled={isDisabled} 
					    	className="my-5 px-4 bg-info text-dark">
					    		Add
					    </Button>
					</Form>
				</Col>
			</Row>
		</Container>
	);
}
