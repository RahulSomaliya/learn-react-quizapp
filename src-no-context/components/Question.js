import Options from './Options';

function Question({ question, dispatch, answer }) {
  const { question: ques } = question;

  return (
    <div>
      <h4>{ques}</h4>

      <Options question={question} dispatch={dispatch} answer={answer} />
    </div>
  );
}

export default Question;
