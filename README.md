# learn-react-quizapp

This small quiz for react question fetches questions from a json-server I've deployed on https://react-quizapp-db.vercel.app and checks the score. That's it. The beautiful thing about project lies in its state management - through this project, I've learned alot about reducer as it uses literally no useState hook, only the reducer hook is used in entirety of this quiz.

I have loaded questions from the api and stored then to reducer state, quiz state ( loading | error | ready ) are handled, navigating questions, maintaining score, highscore and all of other nitty-gritties are orchestrated using useReducer hook. I find it very elegant way of managing state compared to Vue's state management system I was used to, which could get pretty intertwined and hard to mess with once the state inter-dependencies grows. Also, useEffect is implemented to provide timer as deadline to answer all the questions. 

See what your score - https://learn-react-quizapp.vercel.app
