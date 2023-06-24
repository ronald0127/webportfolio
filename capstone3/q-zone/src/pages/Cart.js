import {Container, Row, Col, Table, Button, Form} from 'react-bootstrap';
import {useNavigate} from 'react-router-dom';
import {useEffect, useContext, useState} from 'react';

import Swal2 from 'sweetalert2';
import UserContext from '../AppContext.js';


export default function Cart() {

	const navigate = useNavigate();
	const {user} = useContext(UserContext);

	const [cartItems, setCartItems] = useState([]);
	const [orderItems, setOrderItems] = useState([]);

	const [total, setTotal] = useState('');
	const [isCheckOutItems, setIsCheckOutItems] = useState(false);

	const [cardNum, setCardNum] = useState('');
	const [cardName, setCardName] = useState('');
	const [cardExp, setCardExp] = useState('');
	const [cardCvv, setCardCvv] = useState('');
	const [isDisabled, setIsDisabled] = useState(true);


	const ColoredLine = ({ color }) => (
	    <hr
	    	style={{
	            color: color,
	            backgroundColor: color,
	            height: 5
	        }}
	    />
	);

	useEffect(() => {
		if (user.isAdmin == 'true' || user.isAdmin == true || user.isAdmin == null) {
			navigate('/notAccessible');
		}

		fetch(`${process.env.REACT_APP_API_URL}/products/getActiveProducts`)
		.then(result => result.json())
		.then(data => {
			if (data) {
				setCartItems([]);
				setOrderItems([]);
				setTotal('');
				let total = 0;
				data.forEach(product => {
					let item = localStorage.getItem(product._id);
					if (item != null && item != undefined) {
						let itemArr = item.split(',');
						let subTotal = itemArr[0] == 'rent' ? (product.price/5) : (product.price*Number(itemArr[1]));
						total += subTotal;
						const tableItem = (
							<tr>
								<td>{product.name}</td>
								<td>{product._id}</td>
								<td>{product.category}</td>
								<td>{itemArr[0].toUpperCase()}</td>
								<td>{product.price}</td>
								<td>{itemArr[1]}</td>
								<td>{(Math.round(subTotal * 100) / 100).toFixed(2)}</td>
								<td>
									<Button className="bg-danger ms-5 px-3" onClick={() => deleteItemInCart(product._id)}>
										Remove
									</Button>
								</td>
							</tr>
						);
						setCartItems(oldArray => [...oldArray, tableItem]);

						const orderedProduct = {
							'productId': product._id,
							'quantity': itemArr[1],
							'orderType': itemArr[0],
							'subTotal': subTotal
						}
						setOrderItems(oldArray => [...oldArray, orderedProduct]);
					}
				});
				total = (Math.round(total * 100) / 100).toFixed(2);
				if (total.toString().length > 9) {
					total = [total.slice(0, total.toString().length - 9), ',', 
						total.slice(total.toString().length - 9)].join('');
				}
				if (total.toString().length > 6) {
					total = [total.slice(0, total.toString().length - 6), ',', 
						total.slice(total.toString().length - 6)].join('');
				}
				setTotal(total);
			}
		}).catch(error => console.log(error));
	}, [total]);

	useEffect(() => {
		if (cardNum === '' || cardName === ''
			|| cardExp === '' || cardCvv === '' || cardNum.length != 16) {
			setIsDisabled(true);
		}
		else {
			setIsDisabled(false);
		}
	}, [cardNum, cardName, cardExp, cardCvv]);

	function order() {
		// console.log(total);
		// console.log(orderItems);
		fetch(`${process.env.REACT_APP_API_URL}/orders/checkout`, {
			method: 'POST',
			headers: {
				'Authorization': `Bearer ${localStorage.getItem('token')}`,
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				totalAmount: total,
				orderedProducts: orderItems
			})
		}).then(result => result.json())
		.then(data => {
			if (data) {
				Swal2.fire({
					title: 'Order<br>Successful!',
					icon: 'success',
					html: 'Your products are ordered<br>successfully!',
					color: 'black',
					background: '#fff url(https://img.freepik.com/free-vector/hand-drawn-international-cat-day-background-with-cats_23-2149454620.jpg)'
				});
				orderItems.forEach(item => {
					localStorage.removeItem(item.productId);
				});
				navigate('/orders');
			}
			else {
				Swal2.fire({
					title: 'Order<br>Failed!',
					icon: 'error',
					html: 'There seems to be a<br>problem right now.<br>Try again later.',
					color: 'black',
					background: '#fff url(https://img.freepik.com/free-vector/hand-drawn-international-cat-day-background-with-cats_23-2149454620.jpg)'
				});
			}
		}).catch(error => console.log(error));
	}

	function deleteItemInCart(deleteItem) {
		localStorage.removeItem(deleteItem);
		setIsCheckOutItems(false);
		setTotal('');
	}

	function checkOut() {
		if (total != 0 && total != '0' && total != '') {
			setIsCheckOutItems(true);
		}
	}

	return(
		<Container className="min-vh-100 text-light">
			<h1 className="text-center text-info my-5">Items for Checkout</h1>
			<Table striped bordered hover variant="dark">
				<thead>
					<tr>
					    <th className="text-warning">Product Name</th>
					    <th className="text-warning">Reference ID</th>
						<th className="text-warning">Category</th>
						<th className="text-warning">Order Type</th>
						<th className="text-warning">Orig. Price</th>
						<th className="text-warning">Quantity</th>
						<th className="text-warning">Sub-Total</th>
						<th className="text-warning">Remove Item</th>
					</tr>
				</thead>
				<tbody>
					{cartItems}
				</tbody>
			</Table>
			<h4 className="my-5">Orders Total Amount: <a className="text-info">{total}</a></h4>
			<Button className="bg-success fw-bold p-3 my-5" onClick={() => checkOut()}>
				Checkout
			</Button>
			{
				isCheckOutItems ?
				<form className="my-5">
					<ColoredLine color="red" />
					<h3 className="my-5 text-warning fw-bold">CHECKOUT</h3>
					<p className="my-3">Select Payment Mode</p>
					<div className="cc-selector">
				    	<input id="visa" type="radio" name="credit-card" value="visa" />
						<label className="drinkcard-cc visa" for="visa"></label>
				    	<input id="mastercard" type="radio" name="credit-card" value="mastercard" />
				    	<label className="drinkcard-cc mastercard"for="mastercard"></label>
					</div>
					<Form.Group className="my-3 col-6" controlId="formBasicNumber">
					    <Form.Label className="mt-2">Enter Your Card Number</Form.Label>
					    <Form.Control type="number" value={cardNum} 
					        onChange={event => setCardNum(event.target.value)} 
					        placeholder="Enter 16 digit card number." 
					        maxLength={16} />
					</Form.Group>
					<Form.Group className="my-3 col-6" controlId="formBasicName">
					    <Form.Label>Enter Your Card Holder's Name</Form.Label>
					    <Form.Control type="text" value={cardName} 
					        onChange={event => setCardName(event.target.value)} 
					        placeholder="Enter the name that appears in the card." 
					        maxLength={100} />
					</Form.Group>
					<Form.Group className="my-3 col-3" controlId="formBasicExp">
					    <Form.Label>Expiration</Form.Label>
					    <Form.Control type="text" value={cardExp} 
					        onChange={event => setCardExp(event.target.value)} 
					        placeholder="MM/YY" 
					        maxLength={5} />
					</Form.Group>
					<Form.Group className="my-3 col-3" controlId="formBasicCVV">
					    <Form.Label>Card CVV</Form.Label>
					    <Form.Control type="text" value={cardCvv} 
					        onChange={event => setCardCvv(event.target.value)} 
					        placeholder="Enter CVV code at the back of your card." 
					        maxLength={5} />
					</Form.Group>
					<Button className="my-4 p-3 fw-bolder bg-success" disabled={isDisabled}
						onClick={() => order()}>
							Submit Order
					</Button>
					<p className="mb-5"><i>*Note: Please review your order carefully before submitting.</i></p>
				</form>
				:
				<></>
			}
		</Container>
	);
}
