import React, { useState } from 'react';
import '../App.css';
import { Button, Col, Card, CardImg, CardBody, CardTitle, CardText, Badge, ButtonGroup } from 'reactstrap';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart, faStar, faVideo } from '@fortawesome/free-solid-svg-icons';

function Movie(props) {
	const [watchMovie, setWatchMovie] = useState(false);
	const [countWatchMovie, setCountWatchMovie] = useState(0);
	const [myRatingMovie, setMyRatingMovie] = useState(0);
	const [isRatingMovie, setIsRatingMovie] = useState(false);

	const [rating] = useState(props.globalRating);
	const [countRating] = useState(props.globalCountRating);

	var changeLiked = (name, img) => {
		if (props.movieSee === true) {
			props.handleClickDeleteMovieParent(name);
		} else {
			props.handleClickAddMovieParent(name, img);
		}
	};

	var addWatch = () => {
		setWatchMovie(true);
		setCountWatchMovie(countWatchMovie + 1);
	};

	var setMyRating = (rating) => {
		if (rating < 0) {
			rating = 0;
		}

		if (rating > 10) {
			rating = 10;
		}

		setMyRatingMovie(rating);
		setIsRatingMovie(true);
	};

	var tabRating = [];
	for (let i = 0; i < 10; i++) {
		let color = {};
		if (i < myRatingMovie) {
			color = { color: '#f1c40f' };
		}
		let count = i + 1;
		tabRating.push(<FontAwesomeIcon key={i} onClick={() => setMyRating(count)} style={color} icon={faStar} />);
	}

	var nbTotalNote = rating * countRating;
	var nbTotalVote = countRating;

	if (isRatingMovie) {
		nbTotalVote += 1;
		nbTotalNote += myRatingMovie;
	}

	var avgTotal = Math.round(nbTotalNote / nbTotalVote);

	var tabGlobalRating = [];
	for (let i = 0; i < 10; i++) {
		let color = {};
		if (i < avgTotal) {
			color = { color: '#f1c40f' };
		}
		tabGlobalRating.push(<FontAwesomeIcon key={i} style={color} icon={faStar} />);
	}

	let colorLike;
	if (props.movieSee) {
		colorLike = { color: '#e74c3c', cursor: 'pointer' };
	} else {
		colorLike = { cursor: 'pointer' };
	}

	let colorWatch;
	if (watchMovie) {
		colorWatch = { color: '#e74c3c' };
	} else {
		colorWatch = {};
	}

	return (
		<Col xs='12' lg='6' xl='4'>
			<Card style={{ marginBottom: 30 }}>
				<CardImg top src={props.movieImg} alt={props.movieName} />
				<CardBody>
					<p>
						Like <FontAwesomeIcon style={colorLike} icon={faHeart} onClick={() => changeLiked(props.movieName, props.movieImg)} />
					</p>
					<p>
						Nombre de vues <FontAwesomeIcon style={colorWatch} icon={faVideo} onClick={() => addWatch()} />{' '}
						<Badge color='secondary'>{countWatchMovie}</Badge>
					</p>
					<>
						Mon avis
						{tabRating}
						<ButtonGroup size='sm'>
							<Button onClick={() => setMyRating(myRatingMovie - 1)} color='secondary'>
								-
							</Button>
							<Button onClick={() => setMyRating(myRatingMovie + 1)} color='secondary'>
								+
							</Button>
						</ButtonGroup>
					</>
					<p>
						Moyenne
						{tabGlobalRating}({nbTotalVote})
					</p>
					<CardTitle>{props.movieName}</CardTitle>
					<CardText>{props.movieDesc}</CardText>
				</CardBody>
			</Card>
		</Col>
	);
}

export default Movie;
