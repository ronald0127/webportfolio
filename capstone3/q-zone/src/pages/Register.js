import {Container, Row, Col, Button, Form} from 'react-bootstrap';
import {useEffect, useState, useContext} from 'react';
import {Link, useNavigate} from 'react-router-dom';
import {encryptData} from '../crypt.js';

import UserContext from '../AppContext.js';
import Swal2 from 'sweetalert2';


export default function Register() {

	const {user, setUser} = useContext(UserContext);

	const [email, setEmail] = useState('');
	const [password1, setPassword1] = useState('');
	const [password2, setPassword2] = useState('');
	const [passwordMsg, setPasswordMsg] = useState('');
	const [firstName, setFirstName] = useState('');
	const [lastName, setLastName] = useState('');
	const [number, setNumber] = useState('');
	const [isDisabled, setIsDisabled] = useState(true);

	const navigate = useNavigate();


	useEffect(() => {
		if (user.id !== null) {
			navigate('/notAccessible');
		}

		if (password1 != password2 && password2.length > 0) {
			setPasswordMsg('(Passwords not match!)');
		}
		else {
			setPasswordMsg('');
		}

		if (email === '' || password1 === '' || password2 === '' 
			|| password1.length < 7 || (password1 != password2)
			|| firstName === '' || lastName === '' || number === ''
			|| number.length != 11) {
			setIsDisabled(true);
		}
		else {
			setIsDisabled(false);
		}
	}, [email, password1, password2, firstName, lastName, number]);

	function register(event) {
		event.preventDefault();

		fetch(`${process.env.REACT_APP_API_URL}/users/register`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				email: email,
				password: password1,
				firstName: firstName,
				lastName: lastName,
				mobileNumber: number
			})
		}).then(result => result.json())
		.then(data => {
			if (data === false) {
				Swal2.fire({
					title: 'Register Failed!',
					icon: 'error',
					html: 'Email maybe taken.<br>Try logging in.<br>Or try another email. =P',
					color: 'black',
					background: '#fff url(https://img.freepik.com/free-vector/hand-drawn-international-cat-day-background-with-cats_23-2149454620.jpg)'
				})
			}
			else {
				Swal2.fire({
					title: 'Register Successful!',
					icon: 'success',
					text: `Welcome ${firstName}!`,
					color: 'black',
					background: '#fff url(https://img.freepik.com/free-vector/hand-drawn-international-cat-day-background-with-cats_23-2149454620.jpg)'
				});
				login();
				navigate('/');
			}
		}).catch(error => console.log(error));
	}

	function login() {
		fetch(`${process.env.REACT_APP_API_URL}/users/login`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				email: email,
				password: password1
			})
		}).then(result => result.json())
		.then(data => {
			if (data) {
				localStorage.setItem('token', data.auth);
				getUserDetails(localStorage.getItem('token'));
			}
			else {
				console.log(`Cannot Login! [Error]: ${data}`);
			}
		}).catch(error => console.log(error));
	}

	function getUserDetails(token) {
		fetch(`${process.env.REACT_APP_API_URL}/users/userDetails`, {
			method: 'GET',
			headers: {
				Authorization: `Bearer ${token}`
			}
		}).then(result => result.json())
		.then(data => {
			if (data) {
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
		<Container>
			<Row>
				<Col className="col-12 col-md-6 mx-auto mb-4 text-light">
					<h1 className="my-5 text-center text-info">Register</h1>
					<Form onSubmit={event => register(event)}>
						<Form.Group className="mb-3" controlId="formBasicEmail">
					    	<Form.Label>Email Address</Form.Label>
					        <Form.Control type="email" value={email} 
					        	onChange={event => setEmail(event.target.value)} 
					        	placeholder="Enter email" />
						</Form.Group>

					    <Form.Group className="mb-3" controlId="formBasicPassword1">
					    	<Form.Label>Password</Form.Label>
					        <Form.Control type="password" value={password1} 
					        	onChange={event => setPassword1(event.target.value)}
					        	placeholder="Password" />
					    </Form.Group>

					    <Form.Group className="mb-5" controlId="formBasicPassword2">
					    	<Form.Label>Confirm Password <a style={{color: 'red'}}>{passwordMsg}</a></Form.Label>
					        <Form.Control type="password" value={password2} 
					        	onChange={event => setPassword2(event.target.value)}
					        	placeholder="Re-type your nominated password." />
					    </Form.Group>

					    <Form.Group className="mb-3" controlId="formBasicFirstName">
					    	<Form.Label>First Name</Form.Label>
					        <Form.Control type="text" value={firstName} 
					        	onChange={event => setFirstName(event.target.value)}
					        	placeholder="Enter your first name." />
					    </Form.Group>

					    <Form.Group className="mb-3" controlId="formBasicLastName">
					    	<Form.Label>Last Name</Form.Label>
					        <Form.Control type="text" value={lastName} 
					        	onChange={event => setLastName(event.target.value)}
					        	placeholder="Enter your last name." />
					    </Form.Group>

					    <Form.Group className="mb-3" controlId="formBasicNumber">
					    	<Form.Label>Mobile Number</Form.Label>
					        <Form.Control type="number" value={number} 
					        	onChange={event => setNumber(event.target.value)}
					        	placeholder="Enter your mobile number." />
					    </Form.Group>

					    <p className="mt-5">Have an account already? <Link to='/login'>Login here.</Link></p>

					    <Button variant="primary" type="submit" disabled={isDisabled} 
					    	className="my-4 px-4 bg-info text-dark">
					    		Submit
					    </Button>
					</Form>
				</Col>
			</Row>
		</Container>
	);
}
