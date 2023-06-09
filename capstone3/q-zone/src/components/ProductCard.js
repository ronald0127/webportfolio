import {React, useContext, useState, useEffect} from 'react';
import {Col, Card, Button} from 'react-bootstrap';
import {Link, useNavigate} from 'react-router-dom';

import YoutubeEmbed from './YoutubeEmbed.js';
import UserContext from '../AppContext.js';
import Swal2 from 'sweetalert2';

export default function ProductCard(props) {

	const navigate = useNavigate();	

	const {user} = useContext(UserContext);
	const {index, _id, name, description, price, category, clip, isActive} = props.productProp;

	const [isActiveLocal, setIsActiveLocal] = useState(isActive);


	let layout = 'my-2 col-12 col-lg-4';
	let cardHeight = 'my-2 bg-dark h-100';
	if (user.isAdmin != null && (user.isAdmin == 'true' || user.isAdmin == true)) {
		layout = 'col-12';
		cardHeight = 'my-2 bg-dark';
	}

	const ButtonAdmin = () => {
		return(
			user.isAdmin == true || user.isAdmin == 'true' ?
			<div className="d-flex flex-row">
				<Button className="bg-info text-dark px-3" onClick={() => update()}>Update</Button>
				<div className="ms-auto">
					<Button className="bg-success me-3 px-3" onClick={() => activate()} disabled={isActiveLocal}>Activate</Button>
					<Button className="bg-danger px-3" onClick={() => archive()} disabled={!isActiveLocal}>Archive</Button>
				</div>
			</div>
			:
			<div className="d-flex justify-content-end">
				<Button className="bg-success fw-bold" as={Link} to={`/prodView/${index}/${_id}`}>Details</Button>
			</div>
		);
	}

	const Status = () => {
		return(
			isActiveLocal ? 
			<h6 style={{color: "#03fc39"}}>Active</h6>
			:
			<h6 className="text-danger">Inactive</h6>
		);
	}

	function update() {
		navigate(`/updateProduct/${index}/${_id}`);
	}

	function activate() {
		fetch(`${process.env.REACT_APP_API_URL}/products/${_id}/activate`, {
			method: 'PATCH',
			headers: {
				'Authorization': `Bearer ${localStorage.getItem('token')}`
			}
		}).then(result => result.json())
		.then(data => {
			if (data) {
				Swal2.fire({
					title: 'Activate Product<br>Successful!',
					icon: 'success',
					html: 'Product was activated<br>successfully!',
					color: 'black',
					background: '#fff url(https://img.freepik.com/free-vector/hand-drawn-international-cat-day-background-with-cats_23-2149454620.jpg)'
				});
				setIsActiveLocal(true);
			}
			else {
				Swal2.fire({
					title: 'Activate Product<br>Failed!',
					icon: 'error',
					html: 'There seems to be a<br>problem right now.<br>Try again later.',
					color: 'black',
					background: '#fff url(https://img.freepik.com/free-vector/hand-drawn-international-cat-day-background-with-cats_23-2149454620.jpg)'
				});
			}
		}).catch(error => console.log(error));
	}

	function archive() {
		fetch(`${process.env.REACT_APP_API_URL}/products/${_id}/archive`, {
			method: 'PATCH',
			headers: {
				'Authorization': `Bearer ${localStorage.getItem('token')}`
			}
		}).then(result => result.json())
		.then(data => {
			if (data) {
				Swal2.fire({
					title: 'Archive Product<br>Successful!',
					icon: 'success',
					html: 'Product was archived<br>successfully!',
					color: 'black',
					background: '#fff url(https://img.freepik.com/free-vector/hand-drawn-international-cat-day-background-with-cats_23-2149454620.jpg)'
				});
				setIsActiveLocal(false);
			}
			else {
				Swal2.fire({
					title: 'Archive Product<br>Failed!',
					icon: 'error',
					html: 'There seems to be a<br>problem right now.<br>Try again later.',
					color: 'black',
					background: '#fff url(https://img.freepik.com/free-vector/hand-drawn-international-cat-day-background-with-cats_23-2149454620.jpg)'
				});
			}
		}).catch(error => console.log(error));
	}

	return(
		<Col className={layout}>
			<Card className={cardHeight}>
				<Card.Body className="text-light">
					{
						(user.isAdmin == 'false' || user.isAdmin == false || user.isAdmin == null) ?
						<YoutubeEmbed embedId={clip} />
						:
						<Status />
					}
			    	<Card.Title className="my-3 text-info border-bottom">{name}</Card.Title>
			    	<Card.Subtitle>Description:</Card.Subtitle>
			        <Card.Text>{description}</Card.Text>
			        <Card.Subtitle>Category:</Card.Subtitle>
			        <Card.Text>{category}</Card.Text>
			        <Card.Subtitle>Price:</Card.Subtitle>
			        <Card.Text>PHP {price}</Card.Text>
				</Card.Body>
				<div className="m-3">
				{
					user.id !== null ?
					<ButtonAdmin />
					:
					<div className="d-flex justify-content-end">
						<Button className="bg-success fw-bold" as={Link} to='/login'>Learn More</Button>
					</div>
				}
				</div>
			</Card>
		</Col>
	);
}
