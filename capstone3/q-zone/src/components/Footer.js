import {Container, Button} from 'react-bootstrap';
import {Link} from 'react-router-dom';
import {useContext} from 'react';

import UserContext from '../AppContext.js';

export default function Footer() {

	const {user} = useContext(UserContext);

	return(
		<section>
			<footer className="text-center text-light bg-dark">
				{
					user.id != null ?
					<></>
					:
					<Container className="container p-4 pb-0">
						<section>
					    	<p className="d-flex justify-content-center align-items-center">
					      		<span className="me-3">Register for free!</span>
					      		<Button className="btn-outline-light btn-rounded bg-dark" as={Link} to="/register">
					        		Sign up!
					      		</Button>
					    	</p>
						</section>
					</Container>
				}

		    	<div className="text-center p-3 footer-bottom">
		      		© 2023 Copyright:
		      		<a className="text-light ms-2"
		      			href="https://ronald0127.github.io/webportfolio/capstone1/" target="_blank">
		      				Ronald Allan Repollo
		      		</a>
		    	</div>
			</footer>
		</section>
	);
}
