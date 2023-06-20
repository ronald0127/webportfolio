import {React, useContext, useEffect} from 'react';
import {Col, Card, Button} from 'react-bootstrap';
import {Link} from 'react-router-dom';

import YoutubeEmbed from './YoutubeEmbed.js';
import UserContext from '../AppContext.js';

export default function ProductCard(props) {

	const {user} = useContext(UserContext);
	const {_id, name, description, price, category, clip, isActive} = props.productProp;

	let layout = 'col-12 col-md-4';
	if (user.isAdmin != null && (user.isAdmin == 'true' || user.isAdmin == true)) {
		layout = 'col-12';
	}

	const ButtonAdmin = () => {
		return(
			user.isAdmin == true || user.isAdmin == 'true' ?
			<div className="d-flex flex-row">
				<Button className="bg-success mx-2" onClick={() => activate()} disabled={isActive}>Activate</Button>
				<Button className="bg-danger mx-2" onClick={() => archive()} disabled={!isActive}>Archive</Button>
			</div>
			:
			<Button className="bg-success" as={Link} to='/games'>Details</Button>
		);
	}

	const Status = () => {
		return(
			isActive ? 
			<h6 style={{color: "#03fc39"}}>Active</h6>
			:
			<h6 className="text-danger">Inactive</h6>
		);
	}

	function activate() {

	}

	function archive() {
		
	}


	return(
		<Col className={layout}>
			<Card>
				<Card.Body className="bg-dark text-light">
					{
						(user.isAdmin == 'false' || user.isAdmin == false || user.isAdmin == null) ?
						<YoutubeEmbed embedId={clip} />
						:
						<Status />
					}
			    	<Card.Title className="my-3">{name}</Card.Title>
			    	<Card.Subtitle>Description:</Card.Subtitle>
			        <Card.Text>{description}</Card.Text>
			        <Card.Subtitle>Category:</Card.Subtitle>
			        <Card.Text>{category}</Card.Text>
			        <Card.Subtitle>Price:</Card.Subtitle>
			        <Card.Text>PHP {price}</Card.Text>
			        <div className="d-flex justify-content-end">
			        {
			        	user.id !== null ?
			        	<ButtonAdmin />
			        	:
			        	<Button className="bg-success" as={Link} to='/login'>Learn More</Button>
			        }
			        </div>
				</Card.Body>
			</Card>
		</Col>
	);
}
