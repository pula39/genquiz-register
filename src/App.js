import React, { useState } from 'react';
import axios from 'axios';
import ClipboardImageToBase64 from './ClipboardImageToBase64';

import './App.css'
import TableWithPagination from './TableWithPagination';

const categoryList = [
  { id: 'category_story', name: 'STORY', label: '스토리 문제' },
  { id: 'category_leveling', name: 'LEVELING', label: '육성 문제' },
  { id: 'category_meta', name: 'META_INFO', label: '메타데이터 문제' },
];

const inputs = [
  { id: 'option1', name: 'option1', label: '1번' },
  { id: 'option2', name: 'option2', label: '2번' },
  { id: 'option3', name: 'option3', label: '3번' },
  { id: 'option4', name: 'option4', label: '4번' },
];


const CategoryListFields = ({ questionItem, handleChange }) => {
  return (
    <div>
      {categoryList.map((input) => (
        <div key={input.id}>
          <label htmlFor={input.id}>{input.label}:</label>
          <label key={input.id + "radio"}>
            <input
              type="radio"
              value={input.name}
              name="mainCategory"
              checked={questionItem.mainCategory === input.name}
              onChange={handleChange}
            />
            {input.label}
          </label>
        </div>
      ))}
    </div>
  );
};

const InputFields = ({ questionItem, handleChange }) => {
  return (
    <div>
      {inputs.map((input) => (
        <div key={input.id}>
          <label htmlFor={input.id}>{input.label}:</label>
          <input
            type="text"
            id={input.id}
            name={"answerOptionJson." + input.name}
            value={questionItem.answerOptionJson[input.name]}
            onChange={handleChange}
          />
          <label key={input.id + "radio"}>
            <input
              type="radio"
              value={input.name}
              name={"answerSolutionJson.answerOption"}
              checked={
                questionItem.answerSolutionJson.answerOption === input.name
              }
              onChange={handleChange}
            />
            {input.label + "이 정답"}
          </label>
        </div>
      ))}
    </div>
  );
};

class QuestionItem {
  constructor(
    questionItemSeq,
    questionItemUUID,
    mainCategory,
    regUserId,
    askText,
    answerOptionJson,
    answerSolutionJson,
    contentDataJson,
    regDateTime,
    editedDateTime
  ) {
    this.questionItemSeq = questionItemSeq;
    this.questionItemUUID = questionItemUUID;
    this.mainCategory = mainCategory;
    this.regUserId = regUserId;
    this.askText = askText;
    this.answerOptionJson = answerOptionJson;
    this.answerSolutionJson = answerSolutionJson;
    this.contentDataJson = contentDataJson;
    this.regDateTime = regDateTime;
    this.editedDateTime = editedDateTime;
  }
}

class AnswerSolutionJson{
  constructor(imageData){
    this.askImg = imageData
  }
}

function makeQuestionItem(){
  return new QuestionItem(
   "",
   "",
   "STORY",
   "",
   "",
   {option1: "", option2: "", option3: "", option4: ""},
   {answerOption: "option1"},
   new AnswerSolutionJson(null),
   "",
   "",
  )
}

const updateNestedField = (obj, path, value) => {
  const keys = path.split('.');
  const lastKey = keys.pop();

  const target = keys.reduce((nestedObj, key) => {
    if (!nestedObj[key]) {
      nestedObj[key] = {};
    }
    return nestedObj[key];
  }, obj);

  target[lastKey] = value;

  return {...obj};
};

// const baseUrl = "https://genquiz-https-306304969.ap-northeast-2.elb.amazonaws.com"
const baseUrl = "http://localhost:8080"

function App() {
  const [state, setState] = useState({questionItem: makeQuestionItem()}); // JSON 필드 데이터를 저장할 상태 변수
  const [progress, setProgressState] = useState("IDLE"); // JSON 필드 데이터를 저장할 상태 변수

  const handleQuestionItemChange = (e) => {
    const { name, value } = e.target;
    // console.log(name, value);
    const updatedState = updateNestedField(state, "questionItem." + name, value);
    setState(prevState => { return {...prevState, ...updatedState}});
  };

  const handleReset = (e) => {
    // console.log(name, value);
    setState((prevState) => {
      return { questionItem: makeQuestionItem() };
    });
  };

  const handleLoad = (e) => {
    setProgressState("LOADING")

    const userInput = prompt("Please enter question item seq:");

    if (userInput === null) {
      alert("You canceled the prompt.");
      return
    }
    

    axios.get(baseUrl + '/question-items/' + userInput)
      .then(response => {
        // 요청이 성공한 경우 처리할 로직 작성
        console.log(response);
        setState({...state, questionItem: response.data})
        setProgressState("SUCCESS")
      })
      .catch(error => {
        // 요청이 실패한 경우 처리할 로직 작성
        console.error(error);
        setProgressState("FAIL(Check dev console)")
      });
  };

  const handleImageChange = (imageData) => {
    const updatedState = updateNestedField(
      state,
      "questionItem.contentDataJson",
      new AnswerSolutionJson(imageData)
    );
    setState(updatedState);

    console.log(state.contentDataJson?.askImg)
  }

  const handleSubmit = (e) => {
    e.preventDefault();

    if (isNaN(parseInt(state.questionItem.questionItemSeq)) === false) {
      setProgressState("PATCHING");
      axios
        .patch(
          baseUrl + "/question-items/" + state.questionItem.questionItemSeq,
          state.questionItem
        )
        .then((response) => {
          // 요청이 성공한 경우 처리할 로직 작성
          console.log(response);
          setState({ ...state, questionItem: response.data });
          setProgressState("SUCCESS");
        })
        .catch((error) => {
          // 요청이 실패한 경우 처리할 로직 작성
          console.error(error);
          setProgressState("FAIL(Check dev console)");
        });
    } else {
      setProgressState("POSTING");
      axios
        .post(baseUrl + "/question-items", state.questionItem)
        .then((response) => {
          // 요청이 성공한 경우 처리할 로직 작성
          console.log(response);
          setState({ ...state, questionItem: response.data });
          setProgressState("SUCCESS");
        })
        .catch((error) => {
          // 요청이 실패한 경우 처리할 로직 작성
          console.error(error);
          setProgressState("FAIL(Check dev console)");
        });
    }
  };

  function replacer(key, value) {
    // Filtering out properties
    if (typeof value === 'string' || value instanceof String){
      if(value.length > 300){
        return "LONGSTRING"
      }
    }
    return value;
  }

  return (
    <div className="App">
      <button type="submit" onClick={handleReset}>
        문제 새로 출제
      </button>
      <button type="submit" onClick={handleLoad}>
        문제 불러오기
      </button>
      <pre>{progress}</pre>
      <div>
        <label htmlFor="regUserId">등록하는 유저의 이름</label>
        <input
          type="text"
          id="regUserId"
          name="regUserId"
          value={state.questionItem.regUserId}
          onChange={handleQuestionItemChange}
        ></input>
      </div>

      <div>
        <label htmlFor="askText">문제 설명</label>
        <div>
          <textarea
            type="textarea"
            id="askText"
            name="askText"
            value={state.questionItem.askText}
            onChange={handleQuestionItemChange}
          ></textarea>
        </div>
      </div>

      <div>
        <label htmlFor="category">문제의 카테고리</label>
        <CategoryListFields
          questionItem={state.questionItem}
          handleChange={handleQuestionItemChange}
        />
      </div>

      <div>
        <label htmlFor="askText">문제에 사용될 이미지(Optional)</label>
        <ClipboardImageToBase64
          onValueChange={handleImageChange}
          base64Image={state.questionItem?.contentDataJson?.askImg}
        />
      </div>

      <label htmlFor="optionshelp">정답인 선지를 클릭해주세요</label>
      <div>
        <InputFields
          questionItem={state.questionItem}
          handleChange={handleQuestionItemChange}
        />
      </div>

      <button type="submit" onClick={handleSubmit}>
        Submit
      </button>
      <pre>{progress}</pre>

      <pre>
        <code>{JSON.stringify(state, replacer, 2)}</code>
      </pre>

      <TableWithPagination
        baseUrl={baseUrl}
        onClickItem={(item) => setState({ ...state, questionItem: item })}
      />
    </div>
  );
}

export default App;
