import {Container, Row, Col, Button, ListGroup, ListGroupItem} from 'react-bootstrap';
import {useContext, useEffect, useState} from 'react';
import {useNavigate} from 'react-router-dom';

import UserContext from '../AppContext.js';
import Swal2 from 'sweetalert2';


export default function SetUserAsAdmin() {

	const navigate = useNavigate();
	const {user} = useContext(UserContext);

	const [userAdmins, setUserAdmins] = useState([]);
	const [users, setUsers] = useState([]);
	const [rawData, setRawData] = useState([]);

	const [clickActive, setClickActive] = useState('');
	const [isAdminButtonDisabled, setIsAdminButtonDisabled] = useState(true);
	const [isUserButtonDisabled, setIsUserButtonDisabled] = useState(true);
	const [fetchNewFlag, setFetchNewFlag] = useState(false);


	useEffect(() => {
		if (user.isAdmin == false || user.isAdmin == 'false' || user.isAdmin == null) {
			navigate('/notAccessible');
		}

		fetch(`${process.env.REACT_APP_API_URL}/users/allUsers`, {
			method: 'GET',
			headers: {
				'Authorization': `Bearer ${localStorage.getItem('token')}`
			}
		}).then(result => result.json())
		.then(data => {
			if (data) {
				setClickActive('');
				setIsAdminButtonDisabled(true);
				setIsUserButtonDisabled(true);
				setFetchNewFlag(false);
				setUserAdmins([]);
				setUsers([]);

				data.forEach(user => {
					const userListItem = (<ListGroupItem key={user._id} active={clickActive === user.email}
						onClick={() => activeOnCLick(user.email)}>
							{`${user.lastName}, ${user.firstName} | ${user.mobileNumber} | ${user.email}`}
						</ListGroupItem>
					);

					if (user.isAdmin) {
						setUserAdmins(oldArray => [...oldArray, userListItem]);
					}
					else {
						setUsers(oldArray => [...oldArray, userListItem]);
					}
				});

				setRawData(data);
			}
		}).catch(error => console.log(error));
	}, [fetchNewFlag]);

	useEffect(() => {
		setUserAdmins([]);
		setUsers([]);
		rawData.forEach(user => {
			const userListItem = (<ListGroupItem key={user._id} active={clickActive === user.email}
				onClick={() => activeOnCLick(user.email)}>
					{`${user.lastName}, ${user.firstName} | ${user.mobileNumber} | ${user.email}`}
				</ListGroupItem>
			);

			if (user.isAdmin) {
				setUserAdmins(oldArray => [...oldArray, userListItem]);
			}
			else {
				setUsers(oldArray => [...oldArray, userListItem]);
			}
		});
	}, [clickActive])

	function activeOnCLick(clickedValue) {
		if (clickedValue !== clickActive) {
			setClickActive(clickedValue);

			for (let i = 0; i < rawData.length; i++) {
				if (rawData[i].email == clickedValue) {
					if (rawData[i].isAdmin) {
						setIsAdminButtonDisabled(false);
						setIsUserButtonDisabled(true);
					}
					else {
						setIsAdminButtonDisabled(true);
						setIsUserButtonDisabled(false);
					}
				}
			}
		}
	}

	function setUserAsAdmin() {
		fetch(`${process.env.REACT_APP_API_URL}/users/setAsAdmin`, {
			method: 'PATCH',
			headers: {
				'Authorization': `Bearer ${localStorage.getItem('token')}`,
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				email: clickActive
			})
		}).then(result => result.json())
		.then(data => {
			if (data) {
				Swal2.fire({
					title: 'Set User as Admin<br>Successful!',
					icon: 'success',
					html: `${clickActive} is now an<br>Admin!`,
					color: 'black',
					background: '#fff url(https://img.freepik.com/free-vector/hand-drawn-international-cat-day-background-with-cats_23-2149454620.jpg)'
				});
				setFetchNewFlag(true);
			}
			else {
				Swal2.fire({
					title: 'Set User as Admin<br>Failed!',
					icon: 'error',
					html: 'There seems to be a<br>problem right now.<br>Try again later.',
					color: 'black',
					background: '#fff url(https://img.freepik.com/free-vector/hand-drawn-international-cat-day-background-with-cats_23-2149454620.jpg)'
				});
			}
		}).catch(error => console.log(error));
	}

	function setAdminAsUser() {
		fetch(`${process.env.REACT_APP_API_URL}/users/setAsUser`, {
			method: 'PATCH',
			headers: {
				'Authorization': `Bearer ${localStorage.getItem('token')}`,
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				email: clickActive
			})
		}).then(result => result.json())
		.then(data => {
			if (data) {
				Swal2.fire({
					title: 'Set Admin as User<br>Successful!',
					icon: 'success',
					html: `${clickActive} is now a<br>User!`,
					color: 'black',
					background: '#fff url(https://img.freepik.com/free-vector/hand-drawn-international-cat-day-background-with-cats_23-2149454620.jpg)'
				});
				setFetchNewFlag(true);
			}
			else {
				Swal2.fire({
					title: 'Set Admin as User<br>Failed!',
					icon: 'error',
					html: 'There seems to be a<br>problem right now.<br>Try again later.',
					color: 'black',
					background: '#fff url(https://img.freepik.com/free-vector/hand-drawn-international-cat-day-background-with-cats_23-2149454620.jpg)'
				});
			}
		}).catch(error => console.log(error));
	}


	return(
		<Container className="min-vh-100 text-light">
			<h1 className="my-5 text-center text-info">Set User as Admin</h1>
			<Row>
				<Col className="col-5">
					<h4 className="text-center my-4">Users List</h4>
					<p className="text-warning mt-5">Name (Last Name, First Name) | Mobile No. | Email</p>
					<ListGroup>
						{users}
					</ListGroup>
					<Button className="my-3 bg-info text-dark fw-bold" disabled={isUserButtonDisabled}
						onClick={() => setUserAsAdmin()}>
							Set Admin
					</Button>
				</Col>
				<Col className="col-5 offset-2">
					<h4 className="text-center my-4">Admin List</h4>
					<p className="text-warning mt-5">Name (Last Name, First Name) | Mobile No. | Email</p>
					<ListGroup>
						{userAdmins}
					</ListGroup>
					<Button className="my-3 bg-info text-dark fw-bold" disabled={isAdminButtonDisabled}
						onClick={() => setAdminAsUser()}>
							Set as User
					</Button>
				</Col>
			</Row>
		</Container>
	);
}
