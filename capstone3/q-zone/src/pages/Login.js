import {Container, Row, Col, Button, Form} from 'react-bootstrap';
import {useEffect, useState, useContext} from 'react';
import {Link, Navigate, useNavigate} from 'react-router-dom';
import {encryptData} from '../crypt.js';

import UserContext from '../AppContext.js';
import Swal2 from 'sweetalert2';


export default function Login() {

	const {user, setUser} = useContext(UserContext);

	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [isDisabled, setIsDisabled] = useState(true);

	const navigate = useNavigate();


	useEffect(() => {
		if (user.id !== null) {
			navigate('/notAccessible');
		}

		if (email !== '' && password !=='') {
			setIsDisabled(false);
		}
		else {
			setIsDisabled(true);
		}
	}, [email, password]);

	function login(event) {
		event.preventDefault();

		fetch(`${process.env.REACT_APP_API_URL}/users/login`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				email: email,
				password: password
			})
		}).then(result => result.json())
		.then(data => {
			if (data === false) {
				Swal2.fire({
					title: 'Authentication failed!',
					icon: 'error',
					text: 'Check details and try again.',
					color: 'black',
					background: '#fff url(https://img.freepik.com/free-vector/hand-drawn-international-cat-day-background-with-cats_23-2149454620.jpg)'
				});
			}
			else {
				localStorage.setItem('token', data.auth);
				getUserDetails(localStorage.getItem('token'));
			}
		}).catch(error => console.log(error));
	}

	function getUserDetails(token) {
		fetch(`${process.env.REACT_APP_API_URL}/users/userDetails`, {
			method: 'GET',
			headers: {
				Authorization: `Bearer ${token}`
			}
		})
		.then(result => result.json())
		.then(data => {
			if (data) {
				Swal2.fire({
					title: 'Login Successful!',
					icon: 'success',
					text: `Welcome ${data.userDetails.firstName}!`,
					color: 'black',
					background: '#fff url(https://img.freepik.com/free-vector/hand-drawn-international-cat-day-background-with-cats_23-2149454620.jpg)'
				});
				setUser({
					id: data.userDetails._id,
					isAdmin: data.userDetails.isAdmin
				});
				localStorage.setItem('tokenU', encryptData(data.userDetails._id));
				localStorage.setItem('tokenA', encryptData(data.userDetails.isAdmin.toString()));
			}
			else {
				console.log(`${data} - Connection error!`);
			}
		}).catch(error => console.log(error));
	}

	return(
		user.id === null ?
		<Container className="min-vh-100">
			<Row>
				<Col className="col-12 col-md-4 mx-auto text-light">
					<h1 className="my-5 text-center text-info">Login</h1>
					<Form onSubmit={event => login(event)}>
						<Form.Group className="mb-4" controlId="formBasicEmail">
					    	<Form.Label>Email Address</Form.Label>
					        <Form.Control type="email" value={email} 
					        	onChange={event => setEmail(event.target.value)} 
					        	placeholder="Enter email" />
						</Form.Group>

					    <Form.Group className="mb-4" controlId="formBasicPassword">
					    	<Form.Label>Password</Form.Label>
					        <Form.Control type="password" value={password} 
					        	onChange={event => setPassword(event.target.value)}
					        	placeholder="Enter password" />
					    </Form.Group>

					    <p className="mt-5">No account yet? <Link to='/register'>Sign up here.</Link></p>

					    <Button variant="primary" type="submit" disabled={isDisabled}
					    	className="mt-4 px-4 bg-info text-dark">
					    		Login
					    </Button>
					</Form>
				</Col>
			</Row>
		</Container>
		:
		<Navigate to='/' />
	);
}
