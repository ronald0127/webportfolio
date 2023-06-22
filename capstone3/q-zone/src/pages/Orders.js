import{Container, Table} from 'react-bootstrap';
import {useNavigate} from 'react-router-dom';
import {useEffect, useContext, useState} from 'react';

import UserContext from '../AppContext.js';


export default function Orders() {

	const navigate = useNavigate();
	const {user} = useContext(UserContext);

	const [orders, setOrders] = useState([]);

	useEffect(() => {
		if (user.isAdmin == 'true' || user.isAdmin == true || user.isAdmin == null) {
			navigate('/notAccessible');
		}

		fetch(`${process.env.REACT_APP_API_URL}/orders/seeMyOrders`, {
			method: 'GET',
			headers: {
				'Authorization': `Bearer ${localStorage.getItem('token')}`
			}
		}).then(result => result.json())
		.then(data => {
			if (data) {
				setOrders(data.reverse().map(order => {
					return(
						<Table striped bordered hover variant="dark" className="my-3">
			     			<thead>
			       				<tr>
			         				<th colSpan={2} className="text-warning">Order Reference ID</th>
			         				<th colSpan={3} className="text-warning">Purchased Date</th>
			         				<th colSpan={2} className="text-warning">Total Amount</th>
			       				</tr>
			     			</thead>
			  				<tbody>
			       				<tr>
			         				<td colSpan={2}>{order.orderId}</td>
			         				<td colSpan={3}>{order.purchasedOn}</td>
			         				<td colSpan={2} className="text-info fw-bold">{order.totalAmount}</td>
			       				</tr>
								<tr>
									<td className="text-warning">Product Name</td>
									<td className="text-warning">Category</td>
									<td className="text-warning">Order Type</td>
									<td className="text-warning">Orig. Price</td>
									<td className="text-warning">Quantity</td>
									<td className="text-warning">Sub-Total</td>
									<td className="text-warning">Status</td>
								</tr>
								{ShowProducts(order.products)}
			     			</tbody>
						</Table>
					);
				}));
			}
			else {
				console.log(`Error! Connection error - data: ${data}`);
			}
		}).catch(error => console.log(error));
	}, []);

	function ShowProducts(products) {
		const showProducts = products.map(product => {
			return(
				<tr>
					<td>{product.name}</td>
					<td>{product.category}</td>
					<td>{product.orderType}</td>
					<td>{product.price}</td>
					<td>{product.quantity}</td>
					<td>{product.subTotal}</td>
					<td className="text-info">Delivered</td>
				</tr>
			);
		});
		return showProducts;
	}

	return(
		<Container className="text-light">
			<h1 className="text-center text-info my-5">Order History</h1>
			{orders}
		</Container>
	);
}
