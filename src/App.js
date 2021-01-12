import React, { createContext, useContext, useReducer, useState, useEffect } from 'react';
import './App.css';

// Figure out how to structure this! It'll translate well to the backend.
const pseudoServer = {
  areas: [],
  objects: [],
  entities: [],
  users: {
    'Reidek': {
      password: 'password',
      characters: [],
      settings: {}
    }
  }
};

const Reducer = (state, action) => {
  switch (action.type) {
    case 'LOAD_USER':
      // Should be getting userData = {name: username, currentCharacter: {name: '', index: -1}, settings: {}};
      const newUserState = {...action.payload, currentAppState: 'LOGGED_IN'};
      return {...state, user: newUserState};
    default:
      return state;
  }
};

const initialState = {
  user: {
    name: '',
    currentCharacter: {name: undefined, index: undefined},
    currentAppState: 'LOGGED_OUT',
    settings: {}
  },
  character: {
    name: '',
    identity: '',
    class: '',
    stats: {
      strength: 0,
      agility: 0,
      vitality: 0,
      intelligence: 0,
      wisdom: 0,
      will: 0,
      charisma: 0,
      wit: 0,
      luck: 0
    },
    skills: {
      combat: 0,
      magic: 0,
      stealth: 0,
      survival: 0,
      crafting: 0,
      knowledge: 0,
      social: 0
    },
    talents: [],
    equipment: {
      head: 'nothing',
      eyes: 'nothing',
      neck: 'nothing',
      torso: 'nothing',
      arms: 'nothing',
      legs: 'nothing',
      feet: 'nothing',
      righthand: 'nothing',
      lefthand: 'nothing'
    },
    condition: {
      hp: 100,
      hpmax: 100,
      mp: 10,
      mpmax: 10,
      injuries: [],
      position: 'standing'
    },
    appearance: {},
    location: undefined
  }
};



const Context = createContext(initialState);

const Store = ({children}) => {
  const [state, dispatch] = useReducer(Reducer, initialState);

  return (
    <Context.Provider value={[state, dispatch]}>
      {children}
    </Context.Provider>
  )
};

const App = () => {
  return (
    <Store>
      <div className='app-container'>
        <GameScreen />
      </div>
    </Store>
  )
}

const GameScreen = () => {
  const [state, dispatch] = useContext(Context);

  // WHOOPS. Had an error here where I didn't realize that setting the state's user automatically "started" the game.
  // Good lesson: always have placeholder text on pages in case we end up on one unexpectedly.
  return (
    <div>
      {state.user.currentAppState !== 'PLAYING' &&
        <LoginPage />
      }
      {state.user.currentAppState === 'PLAYING' &&
        <PlayingGame />
      }
    </div>
  )
}

const LoginPage = () => {
  const [state, dispatch] = useContext(Context);
  const [feedback, setFeedback] = useState({type: 'info', message: `Please log in, or if you're new here, you can create a new account.`});
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loginOK, setLoginOK] = useState(false);
  const [page, setPage] = useState('login');
  const [selectedCharacter, setSelectedCharacter] = useState(undefined);

  /*
    NEXT:
    -- Handle logging in successfully by prompting to CHARACTER SELECTION, including CREATE NEW CHARACTER
    -- Limit the characters to... let's say three for now?
  */


  // Add in here: we don't need the STATE of the app to hold all the user's characters;
  //  consider adding in a state of "logged in but no character selected" and other states of user-ness vs just having all chars here.
  const handleLogin = () => {
    if (username && password) {
      setFeedback({type: 'info', message: 'Attempting to log in...'});

      // HERE: Attempt to do login with axios when backend exists

      if (pseudoServer?.users[username]?.password === password) {
        // Handle successful login - update app state with proper stuffs, in this case user set, but character not set
        // Set... localStorage or cookies?... to hold user's info until timeout or logout
        let userData = {name: username, currentCharacter: {name: '', index: -1}, settings: {}};
        dispatch({type: 'LOAD_USER', payload: userData});
        // HERE: Update cookies OR localstorage with quick credentials to avoid forcing login
        setPage('character_select');
      } else {
        // Handle unsuccessful login
        // HERE: Update feedback message to reflect error
        setFeedback({type: 'error', message: 'Either the username or the password was incorrect.'});
      }
    }
  }

  useEffect(() => {
    if (username && password) {
      setLoginOK(true);
    } else {
      setLoginOK(false);
    }
  }, [username, password])

  return (
    <div>

      {page === 'login' &&
      <div>
        <div className='login-prompt-message flex-col'>
          <h1>Welcome!</h1>
          <h2 className={feedback.type === 'error' ? 'error' : ''}>{feedback.message}</h2>
        </div>

        <div className='login-holder'>
          <input type='text' autoFocus={true} value={username} onChange={(e) => setUsername(e.target.value)} placeholder='Username' />
          <input type='password' value={password} onChange={(e) => setPassword(e.target.value)} placeholder='Password' />
          <button disabled={!loginOK} onClick={handleLogin}>Boopty</button>
        </div>
      </div>
      }

      {page === 'character_select' &&
      <div>
        <div className='login-prompt-message'>
          <h1>Greetings, {state.user.name}! Choose your character.</h1>
        </div>

        <div className='selectable-characters-holder'>
          {state.user?.characters?.map(char => (<SelectCharacterBox />))}
          <button className='create-new-character' onClick={() => setPage('create_character')} >
            Create New Character
          </button>
        </div>
      </div>
      }

      {page === 'create_character' &&
      <div>
        <div className='login-prompt-message'>
          <h1>Ah, a new spirit to join the adventure! Excellent. Tell me more about your adventurer.</h1>
        </div>

        <div>
          {/* NAME */}
        </div>

        <div>
          {/* GENDER */}
        </div>

        <div>
          {/* IDENTITY */}
        </div>

      </div>
      }

    </div>
  )
}

const SelectCharacterBox = () => {
  return (
    <div>
      <p>I am ME!</p>
    </div>
  )
}


const PlayingGame = () => {
  const [state, dispatch] = useContext(Context);

  return (
    <div>

    </div>
  )
}

export default App;
