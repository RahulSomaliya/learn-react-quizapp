import { createContext, useContext, useEffect, useReducer } from 'react';
// import { API_URL } from '../../src-no-context/components/App';
const API_URL = `https://react-quizapp-db.vercel.app`; // for production deployment

const QuizContext = createContext();

const SECS_PER_QUESTION = 30;
const initialState = {
  questions: [],
  status: 'loading', // 'loading', 'error', 'ready', 'active', 'finished'
  index: 0, // current open question
  answer: null, // selected answer index
  points: 0,
  highscore: 0,
  secondsRemaining: null,
};

function reducer(state, action) {
  const { type, payload } = action;
  switch (type) {
    case 'dataReceived':
      return {
        ...state,
        questions: payload,
        status: 'ready',
      };

    case 'dataFetchingFailed':
      return {
        ...state,
        status: 'error',
      };

    case 'start':
      return {
        ...state,
        status: 'active',
        secondsRemaining: state.questions.length * SECS_PER_QUESTION,
      };

    case 'newAnswer':
      const question = state.questions.at(state.index);
      return {
        ...state,
        answer: payload,
        points:
          payload === question.correctOption
            ? state.points + question.points
            : state.points,
      };

    case 'nextQuestion':
      return {
        ...state,
        index: state.index + 1,
        answer: null,
      };

    case 'finished':
      return {
        ...state,
        status: 'finished',
        highscore:
          state.points > state.highscore ? state.points : state.highscore,
      };

    case 'restartQuiz':
      return {
        ...initialState,
        questions: state.questions,
        status: 'ready',
        highscore: state.highscore,
      };

    case 'tick':
      return {
        ...state,
        secondsRemaining: state.secondsRemaining - 1,
        status: state.secondsRemaining === 0 ? 'finished' : state.status,
      };

    default:
      throw new Error('Unknown action');
  }
}

function QuizProvider({ children }) {
  const [
    { questions, status, index, answer, points, highscore, secondsRemaining },
    dispatch,
  ] = useReducer(reducer, initialState);

  const numQuestions = questions.length;
  const maxPossiblePoints = questions.reduce(
    (prev, cur) => prev + cur.points,
    0
  );

  useEffect(function () {
    fetch(`${API_URL}/questions`)
      .then(res => res.json())
      .then(data => dispatch({ type: 'dataReceived', payload: data }))
      .catch(err => dispatch({ type: 'dataFetchingFailed' }));
  }, []);

  return (
    <QuizContext.Provider
      value={{
        maxPossiblePoints,
        numQuestions,
        questions,
        status,
        index,
        answer,
        points,
        highscore,
        secondsRemaining,
        dispatch,
      }}
    >
      {children}
    </QuizContext.Provider>
  );
}

function useQuiz() {
  const context = useContext(QuizContext);
  if (context === undefined)
    throw new Error(
      `You're trying to access QuizContext outside QuizProvider scope`
    );
  return context;
}

export { QuizProvider, useQuiz };
