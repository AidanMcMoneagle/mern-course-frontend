import React, { useReducer, useEffect } from "react";

import { validate } from "../util/validators";

import "./Input.css";
//manage what the user entered and manage whether the input is valid

const inputReducer = (state, action) => {
  // if dispatched action.type is equal to 'CHANGE' we modify the state. Change the
  if (action.type === "CHANGE") {
    return {
      ...state,
      value: action.payload,
      isValid: validate(action.payload, action.validators),
    };
  }
  // changing the state of isTouched (if true user clicked away from input)
  if (action.type === "TOUCH") {
    return {
      ...state,
      isTouched: true,
    };
  }
  return state;
};

const Input = (props) => {
  //reducer function used to control the state of the input value of the form, inputvalidity and when input is in focus.

  const [inputState, dispatch] = useReducer(inputReducer, {
    //initial state of the input component.
    value: props.initialValue || "",
    isValid: props.initialValid || false,
    isTouched: false,
  });

  // pass data to parent by calling a function that is passed from the parent has as props. We want to pass the data whenever the value of the input of validity of the input changes.

  const { id, onInput } = props;
  const { value, isValid } = inputState;

  //useEffect will run every time one of the depedencies changes. Passes the id of the input, value, isValid to the parent component.
  useEffect(() => {
    console.log(onInput);
    onInput(id, value, isValid);
  }, [id, value, isValid, onInput]);

  const changeHandler = (e) => {
    //changeHandler dispatches the action to the reducer function.
    dispatch({
      type: "CHANGE",
      payload: e.target.value,
      validators: props.validators,
    });
  };

  //When the object looses focus (i.e. we click away from the input field) we want to say the input is invalid. We do not want the input to be invalid
  const touchHandler = () => {
    dispatch({ type: "TOUCH" });
  };
  // based on props based to the input component. the input component will retrun different html elements.
  const element =
    props.element === "input" ? (
      <input
        id={props.id}
        type={props.type}
        placeholder={props.placeholder}
        onChange={changeHandler} // changeHandler is called whenever there is a change of user input.
        onBlur={touchHandler} // onBlur event occurs when the user looses focus on the element. Most common use case is in input validation.
        value={inputState.value} // 2 way binding (controlled input)
      />
    ) : (
      <textarea
        id={props.id}
        rows={props.rows || 3}
        onChange={changeHandler}
        onBlur={touchHandler}
        value={inputState.value} //2 way binding (controlled input)
      />
    );

  return (
    <div
      className={`form-control ${
        !inputState.isValid && inputState.isTouched && "form-control--invalid"
      }`}
    >
      <label htmlFor={props.id}>{props.label}</label>
      {element}
      {!inputState.isValid && inputState.isTouched && <p>{props.errorText}</p>}
    </div>
  );
};

export default Input;
