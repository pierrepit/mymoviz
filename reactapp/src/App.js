import React, { useState, useEffect, useRef } from 'react';
import './App.css';
import {
	Container,
	Row,
	Button,
	Nav,
	NavItem,
	NavLink,
	Popover,
	PopoverHeader,
	PopoverBody,
	ListGroup,
	ListGroupItem,
	ListGroupItemText,
} from 'reactstrap';

import Movie from './components/Movie';

function App() {
	const [moviesCount, setMoviesCount] = useState(0);
	const [moviesWishList, setMoviesWishList] = useState([]);
	const [movieList, setMovieList] = useState([]);
	const [popoverOpen, setPopoverOpen] = useState(false);
	const ref = useRef(null);

	useEffect(() => {
		async function loadData() {
			const response = await fetch('/new-movies');
			const jsonResponse = await response.json();
			setMovieList(jsonResponse.movies);

			const responseWish = await fetch('wishlist-movie');
			const jsonResponseWish = await responseWish.json();

			const wishlistFromDB = jsonResponseWish.movies.map((movie) => {
				return { name: movie.movieName, img: movie.movieImg };
			});

			setMoviesWishList(wishlistFromDB);
			setMoviesCount(jsonResponseWish.movies.length);
		}
		loadData();
	}, []);

	useEffect(() => {
		const handleClick = (event) => {
			if (!ref.current?.contains(event.target)) {
				console.log('useEffect');
				setPopoverOpen(false);
			}
		};

		document.addEventListener('click', handleClick, true);

		return () => {
			document.removeEventListener('click', handleClick, true);
		};
	}, [ref]);

	var handleClickAddMovie = async (name, img) => {
		setMoviesCount(moviesCount + 1);
		setMoviesWishList([...moviesWishList, { name: name, img: img }]);

		await fetch('/wishlist-movie', {
			method: 'POST',
			headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
			body: `name=${name}&img=${img}`,
		});
	};

	var handleClickDeleteMovie = async (name) => {
		setMoviesCount(moviesCount - 1);
		setMoviesWishList(moviesWishList.filter((object) => object.name !== name));

		await fetch(`/wishlist-movie/${name}`, {
			method: 'DELETE',
		});
	};

	var cardWish = moviesWishList.map((movie, i) => {
		return (
			<ListGroupItem key={i}>
				<ListGroupItemText
					onClick={() => {
						handleClickDeleteMovie(movie.name);
					}}
				>
					{/* eslint-disable-next-line jsx-a11y/alt-text */}
					<img width='25%' src={movie.img} /> {movie.name}
				</ListGroupItemText>
			</ListGroupItem>
		);
	});

	// var moviesData = [
	//   {name:"Star Wars : L'ascension de Skywalker", desc:"La conclusion de la saga Skywalker. De nouvelles légendes vont naître dans cette ...", img:"/starwars.jpg", note:6.7, vote:5},
	//   {name:"Maléfique : Le pouvoir du mal", desc: "Plusieurs années après avoir découvert pourquoi la plus célèbre méchante Disney avait un cœur ...", img:"/maleficent.jpg", note:8.2, vote:3},
	//   {name:"Jumanji: The Next Level", desc: "L’équipe est de retour, mais le jeu a changé. Alors qu’ils retournent dans Jumanji pour secourir ...", img:"/jumanji.jpg", note:4, vote:5},
	//   {name:"Once Upon a Time... in Hollywood", desc: "En 1969, Rick Dalton – star déclinante d'une série télévisée de western – et Cliff Booth ...", img:"/once_upon.jpg", note:6, vote:7},
	//   {name:"La Reine des neiges 2", desc: "Elsa, Anna, Kristoff, Olaf et Sven voyagent bien au-delà des portes d’Arendelle à la recherche de réponses ...", img:"/frozen.jpg", note:4.6, vote:3},
	//   {name:"Terminator: Dark Fate", desc: "De nos jours à Mexico. Dani Ramos, 21 ans, travaille sur une chaîne de montage dans une usine automobile...", img:"/terminator.jpg", note:6.1, vote:1},
	// ]

	var movieListItems = movieList.map((movie, i) => {
		var result = moviesWishList.find((element) => element.name === movie.title);
		var isSee = false;
		if (result !== undefined) {
			isSee = true;
		}
		var movieOverview = movie.overview;
		if (movieOverview.length > 80) {
			movieOverview = movieOverview.slice(0, 80) + '...';
		}

		var urlImage = '/generique.jpg';
		if (movie.backdrop_path != null) {
			urlImage = 'https://image.tmdb.org/t/p/w500/' + movie.backdrop_path;
		}
		return (
			<Movie
				key={i}
				movieSee={isSee}
				handleClickDeleteMovieParent={handleClickDeleteMovie}
				handleClickAddMovieParent={handleClickAddMovie}
				movieName={movie.title}
				movieDesc={movieOverview}
				movieImg={urlImage}
				globalRating={movie.popularity}
				globalCountRating={movie.vote_count}
			/>
		);
	});

	return (
		<div style={{ backgroundColor: '#232528' }}>
			<Container>
				<Nav>
					<span className='navbar-brand'>
						<img src='./logo.png' width='30' height='30' className='d-inline-block align-top' alt='logo' />
					</span>
					<NavItem>
						<NavLink style={{ color: 'white' }}>Last Releases</NavLink>
					</NavItem>
					<NavItem>
						<NavLink>
							<Button id='Popover1' type='button'>
								{moviesCount} films
							</Button>
							<Popover placement='bottom' isOpen={popoverOpen} target='Popover1' toggle={() => setPopoverOpen(true)}>
								<PopoverHeader>WishList</PopoverHeader>
								<PopoverBody>
									<div ref={ref}>
										<ListGroup>{cardWish}</ListGroup>
									</div>
								</PopoverBody>
							</Popover>
						</NavLink>
					</NavItem>
				</Nav>
				<Row>{movieListItems}</Row>
			</Container>
		</div>
	);
}

export default App;
