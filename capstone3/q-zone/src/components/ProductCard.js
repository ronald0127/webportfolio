import {React, useContext} from 'react';
import {Col, Card, Button} from 'react-bootstrap';
import {Link} from 'react-router-dom';

import YoutubeEmbed from './YoutubeEmbed.js';
import UserContext from '../AppContext.js';

export default function ProductCard() {

	const {user} = useContext(UserContext);

	return(
		<Col className="col-12 col-md-4">
			<Card>
				<Card.Body className="bg-dark text-light">
					<YoutubeEmbed embedId="RxLS5Tgo9YM" />
			    	<Card.Title className="mb-4">2K23</Card.Title>
			    	<Card.Subtitle className="mb-2">Description:</Card.Subtitle>
			        <Card.Text>PS5 game, Physical Copy only</Card.Text>
			        <Card.Subtitle className="mb-2">Category:</Card.Subtitle>
			        <Card.Text>Games/PS5</Card.Text>
			        <Card.Subtitle className="mb-2">Price:</Card.Subtitle>
			        <Card.Text>PhP 2000</Card.Text>
			        {
			        	user.id !== null ?
			        	<Button className="bg-success" as={Link} to='/games'>Details</Button>
			        	:
			        	<Button className="bg-success" as={Link} to='/login'>Login to Learn More</Button>
			        }
				</Card.Body>
			</Card>
		</Col>
	);
}
