import React, { Component } from 'react';
import './Hangman.css';
import randomWord from './words';
import img0 from './0.jpg';
import img1 from './1.jpg';
import img2 from './2.jpg';
import img3 from './3.jpg';
import img4 from './4.jpg';
import img5 from './5.jpg';
import img6 from './6.jpg';

class Hangman extends Component {
	/** by default, allow 6 guesses and use provided gallows images. */
	static defaultProps = {
		maxWrong: 6,
		images: [ img0, img1, img2, img3, img4, img5, img6 ]
	};

	constructor(props) {
		super(props);
		this.state = {
			nWrong: 0,
			guessed: new Set(),
			answer: randomWord(),
			isHidden: false
		};
		this.handleGuess = this.handleGuess.bind(this);
		this.playAgain = this.playAgain.bind(this);
	}

	/** guessedWord: show current-state of word:
    if guessed letters are {a,p,e}, show "app_e" for "apple"
  */
	guessedWord() {
		if (this.state.isHidden) {
			return this.state.answer.split('');
		} else {
			return this.state.answer
				.split('')
				.map((ltr) => (this.state.guessed.has(ltr) ? ltr : '_'));
		}
	}

	/** handleGuest: handle a guessed letter:
    - add to guessed letters
    - if not in answer, increase number-wrong guesses
  */
	handleGuess(evt) {
		let ltr = evt.target.value;
		if (this.state.nWrong < this.props.maxWrong - 1) {
			this.setState((st) => ({
				guessed: st.guessed.add(ltr),
				nWrong: st.nWrong + (st.answer.includes(ltr) ? 0 : 1)
			}));
		} else {
			this.setState({ isHidden: !this.state.isHidden });
		}
	}

	/** generateButtons: return array of letter buttons to render */
	generateButtons() {
		return 'abcdefghijklmnopqrstuvwxyz'.split('').map((ltr) => (
			<button
				value={ltr}
				onClick={this.handleGuess}
				disabled={this.state.guessed.has(ltr)}
				key={ltr}
			>
				{ltr}
			</button>
		));
	}

	getRemaining() {
		return this.props.maxWrong - this.state.nWrong;
	}

	playAgain() {
		this.setState({
			nWrong: 0,
			guessed: new Set(),
			answer: randomWord(),
			isHidden: false
		});
	}

	/** render: render game */
	render() {
		const gameOver = this.state.nWrong >= this.props.maxWrong;
		const isWinner = this.guessedWord().join('') === this.state.answer;
		let gameState = this.generateButtons();
		if (isWinner) gameState = 'You Win!';
		if (gameOver) gameState = 'You Lose!';
		return (
			<div className="Hangman">
				<h1>Hangman</h1>
				<img
					src={this.props.images[this.state.nWrong]}
					alt={this.getRemaining()}
				/>
				<br />
				{!this.state.isHidden && (
					<div>
						{' '}
						Number Wrong: {this.state.nWrong}
						<br />
						Remaining: {this.getRemaining()}
					</div>
				)}
				<p className="Hangman-word">{this.guessedWord()} </p>
				{!this.state.isHidden && (
					<div>
						<p className="Hangman-btns">{this.generateButtons()}</p>
					</div>
				)}
				{this.state.isHidden && (
					<p>
						<strong>
							{' '}
							{this.state.nWrong < this.props.maxWrong ? (
								'You Lost Try Again!'
							) : null}
						</strong>{' '}
						{this.state.isWinner ? 'You won!' : null}
						<br />
						<button id="reset" onClick={this.playAgain}>
							Play Again!
						</button>
					</p>
				)}
			</div>
		);
	}
}

export default Hangman;
