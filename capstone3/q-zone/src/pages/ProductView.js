import {Container, Row, Col, Card, Button} from 'react-bootstrap';
import {Link, useNavigate, useParams} from 'react-router-dom';
import {useEffect, useContext, useState} from 'react';

import UserContext from '../AppContext.js';
import YoutubeEmbed from '../components/YoutubeEmbed.js';


export default function ProductView() {

	const navigate = useNavigate();
	const {user} = useContext(UserContext);
	const {index, prodId} = useParams();

	const [name, setName] = useState('');
	const [description, setDescription] = useState('');
	const [price, setPrice] = useState('');
	const [category, setCategory] = useState('');
	const [clip, setClip] = useState('');
	const [goBackLink, setGoBackLink] = useState('');


	useEffect(() => {
		if (user.isAdmin == 'true' || user.isAdmin == true) {
			navigate('/notAccessible');
		}

		fetch(`${process.env.REACT_APP_API_URL}/products/getProduct/${prodId}`)
		.then(result => result.json())
		.then(data => {
			if (data) {
				setName(data.productDetails.name);
				setDescription(data.productDetails.description);
				setPrice(data.productDetails.price);
				setCategory(data.productDetails.category);
				setClip(data.productDetails.clip);

				switch(data.productDetails.category) {
					case 'Movie':
						setGoBackLink(`/movies/${index}`);
						break;
					case 'Series':
						setGoBackLink(`/series/${index}`);
						break;
					case 'Game':
						setGoBackLink(`/games/${index}`);
						break;
				}
			}
			else {
				console.log(`Error! Connection problem: ${data}`);
			}
		}).catch(error => console.log(error));
	}, []);


	return(
		<Container>
			<Row>
				<Col className="col-12 mb-5">
					<h1 className="text-center text-info my-5">{name}</h1>
					<Card className="bg-dark border border-5 border-danger mb-5">
					 	<YoutubeEmbed embedId={clip} />
						<Card.Body className="text-light">
					    	<Card.Title>Description:</Card.Title>
					    	<Card.Text>{description}</Card.Text>
					    	<Card.Title>Category:</Card.Title>
					    	<Card.Text className="border-bottom border-2 border-danger pb-4">{category}</Card.Text>
					    	<div className="d-flex flex-row py-3">
								<Button className="bg-info text-dark fw-bold p-3">Buy for PHP {price}</Button>
								<Button className="bg-info text-dark fw-bold p-3 ms-4">Rent for PHP {price/5}</Button>
							</div>
						</Card.Body>
					</Card>
					<div className="d-flex flex-row justify-content-center">
						<Link to={goBackLink} className="text-warning fw-bolder">Go Back</Link>
					</div>
				</Col>
			</Row>
		</Container>
	);
}
