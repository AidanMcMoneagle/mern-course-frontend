import { useCallback, useReducer } from "react";

const formReducer = (state, action) => {
  if (action.type === "INPUT_CHANGE") {
    let formIsValid = true;
    // for in loop used to loop over properties in state.inputs (i.e. title and description)
    for (const inputId in state.inputs) {
      if (!state.inputs[inputId]) {
        continue; // continue statement skips this iteration of the for loop. Goes to next iteration
      }
      // checks whether the inputId (title/description is equal to passed through id)
      if (inputId === action.inputId) {
        formIsValid = formIsValid && action.isValid; // formIsValid will be true if both operands are true
      } else {
        formIsValid = formIsValid && state.inputs[inputId].isValid; //
      }
    }

    return {
      ...state,
      inputs: {
        ...state.inputs,
        [action.inputId]: { value: action.value, isValid: action.isValid }, //
      },
      isValid: formIsValid,
    };
  }

  if (action.type === "SET_DATA") {
    return {
      inputs: action.inputs,
      isValid: action.fromIsValid,
    };
  }
  return state;
};

const useForm = (initialInputs, initialFormValidity) => {
  const [formState, dispatch] = useReducer(formReducer, {
    inputs: initialInputs,
    isValid: initialFormValidity,
  });

  const inputHandler = useCallback((id, value, isValid) => {
    dispatch({
      type: "INPUT_CHANGE",
      value: value,
      isValid: isValid,
      inputId: id,
    });
  }, []);

  //used to setFormData once we have retrieved the data.
  const setFormData = useCallback((inputData, formValidity) => {
    dispatch({
      type: "SET_DATA",
      inputs: inputData,
      formIsValid: formValidity,
    });
  }, []);

  return [formState, inputHandler, setFormData];
};

export default useForm;

// inputs: {
//     title: {
//       value: "",
//       isValid: false,
//     },
//     description: {
//       value: "",
//       isValid: false,
//     },
//     address: {
//       value: "",
//       isValid: false,
//     },
//   },
//   isValid: false,
