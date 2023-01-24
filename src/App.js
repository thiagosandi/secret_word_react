import './App.css';
import StartScreen from './components/StartScreen';
import { useCallback, useEffect, useState } from 'react';

import { wordsList } from "./data/words";
import GameOver from './components/GameOver';
import Game from './components/Game';

const stages = [
  { id: 1, name: "start" },
  { id: 2, name: "game" },
  { id: 3, name: "end" },
]

function App() {

  const guessQuantity = 5;

  const [gameStage, setGameStage] = useState(stages[0].name);
  const [words] = useState(wordsList);

  const [pickedWord, setPickedWord] = useState("");
  const [pickedCategory, setPickedCategory] = useState("");
  const [letters, setLetters] = useState([]);

  const [guessedLetters, setGuessedLetters] = useState([]);
  const [wrongLetters, setWrongLetters] = useState([]);
  const [guesses, setGuesses] = useState(guessQuantity);
  const [score, setScore] = useState(0)

  const pickWordAndCategory = useCallback(() => {
    const categories = Object.keys(words);
    const category = categories[Math.floor(Math.random() * Object.keys(words).length)];

    // pick a random word
    const word = words[category][Math.floor(Math.random() * words[category].length)];

    return { word, category };
  }, [words]);

  // starts the secret word game
  const startGame = useCallback(() => {

    clearLetterStates();


    // pick word and pick category
    const { word, category } = pickWordAndCategory();

    // create an array of letters
    let wordLetters = word.split("");

    wordLetters = wordLetters.map((letter) => letter.toLowerCase());

    setPickedWord(word);
    setPickedCategory(category);
    setLetters(wordLetters);

    setGameStage(stages[1].name)
  }, [pickWordAndCategory]);

  // process the letter input
  const verifyLetter = (letter) => {
    const lowerLetter = letter.toLowerCase();

    //check if letter has already been utilized
    if (guessedLetters.includes(lowerLetter) || wrongLetters.includes(lowerLetter)) {
      return;
    }

    // push guessed letter or remove a guess
    if (letters.includes(lowerLetter)) {
      setGuessedLetters((actualGuessedLetters) => [
        ...actualGuessedLetters,
        lowerLetter
      ])
    } else {
      setWrongLetters((actualWrongLetters) => [
        ...actualWrongLetters,
        lowerLetter
      ]);

      setGuesses((actualGuesses) => actualGuesses - 1);

    }
  }

  const clearLetterStates = () => {
    setGuessedLetters([]);
    setWrongLetters([])
  }

  //check guess condition
  useEffect(() => {
    if (guesses <= 0) {
      // reset all states
      clearLetterStates()

      setGameStage(stages[2].name)
    }
  }, [guesses])


  // check win condition
  useEffect(() => {
    const uniqueLetters = [...new Set(letters)]; 

    if(guessedLetters.length === uniqueLetters.length) {

      // add score
      setScore((actualScore) => actualScore += 100);

      //restart game with new word
      startGame();
    }

  }, [guessedLetters, letters, startGame])

  // restarts the game
  const retry = () => {
    setScore(0);
    setGuesses(guessQuantity);
    setGameStage(stages[0].name);
  }

  return (
    <div className='App'>
      {gameStage === 'start' && <StartScreen startGame={startGame} />}
      {gameStage === 'game' &&
        <Game
          verifyLetter={verifyLetter}
          pickedWord={pickedWord}
          pickedCategory={pickedCategory}
          letters={letters}
          guessedLetters={guessedLetters}
          wrongLetters={wrongLetters}
          guesses={guesses}
          score={score}
        />}
      {gameStage === 'end' && <GameOver retry={retry} score={score} />}

    </div>

  );
}

export default App;
