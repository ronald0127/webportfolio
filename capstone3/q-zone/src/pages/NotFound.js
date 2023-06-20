import {Container, Row, Col} from 'react-bootstrap';
import {Link} from 'react-router-dom';

export default function NotFound() {

	return(
		<Container>
			<Row>
				<Col className="text-center text-light mt-5">
					<h1 className="my-3">Page Not Found!</h1>
					<h2 className="my-3">Sorry we can't find the page you're looking for.</h2>
					<img className="img-fluid my-3"
						src="https://media.tenor.com/PPOe9MawAvsAAAAd/404-not-found.gif"
						alt="404-not-found.gif" />
					<h2 className="mt-3 mb-5">Now go back to the <Link to='/'>hompage</Link>.</h2>
				</Col>
			</Row>
		</Container>
	);
}
