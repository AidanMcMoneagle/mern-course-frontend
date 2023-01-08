import React, { useContext } from "react";
import { useHistory } from "react-router-dom";

import Input from "../../shared/components/FormElements/Input";
import Button from "../../shared/components/FormElements/Button";
import ErrorModal from "../../shared/components/UIElements/ErrorModal";
import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner";
import {
  VALIDATOR_MINLENGTH,
  VALIDATOR_REQUIRE,
} from "../../shared/components/util/validators";
import useForm from "../../shared/hooks/form-hook";
import { useHttpClient } from "../../shared/hooks/http-hook";
import { AuthContext } from "../../shared/context/auth-context";
import ImageUpload from "../../shared/components/FormElements/ImageUpload";

import "./PlaceForm.css";
import "../../shared/components/UIElements/LoadingSpinner.css";

const NewPlace = () => {
  //useForm hook contains all the logic for form management / input state changes.

  const auth = useContext(AuthContext);
  const [formState, inputHandler] = useForm(
    {
      title: {
        value: "",
        isValid: false,
      },
      description: {
        value: "",
        isValid: false,
      },
      address: {
        value: "",
        isValid: false,
      },
      image: {
        value: null,
        isValid: false,
      },
    },
    false
  );
  // useCallback is used.
  const { isLoading, error, sendRequest, clearError } = useHttpClient();

  const history = useHistory();

  // creator is the user Id. we need to manage the userId on the frontEnd. We need to send the userId in post request so we can associate the place we are creating with the user.
  const placeSubmitHandler = async (e) => {
    e.preventDefault();
    try {
      let formData = new FormData();
      formData.append("title", formState.inputs.title.value);
      formData.append("description", formState.inputs.description.value);
      formData.append("address", formState.inputs.address.value);
      formData.append("image", formState.inputs.image.value);

      console.log(formData);
      await sendRequest(
        `${process.env.REACT_APP_BACKEND_URL}/places`,
        "POST",
        formData,
        {
          Authorization: "Bearer " + auth.token,
        }
      );
      history.push("/"); //Redirect the user to the home page.
    } catch (err) {
      console.log(err);
    }
  };

  //We use React.Fragment so we can have multiple top level JSX elements.
  return (
    <React.Fragment>
      <ErrorModal onClear={clearError} error={error} />

      <form className="place-form" onSubmit={placeSubmitHandler}>
        {isLoading && (
          <div className="center">
            <LoadingSpinner asOverlay />
          </div>
        )}
        <Input
          id="title"
          type="text"
          label="Title"
          element="input"
          validators={[VALIDATOR_REQUIRE()]}
          errorText="please enter a valid title"
          onInput={inputHandler} // onInput is a pointer to the inputHandler function
        />

        <Input
          id="description"
          label="Description"
          element="textarea"
          validators={[VALIDATOR_MINLENGTH(5)]}
          errorText="please enter a valid input of minimum 5 characters"
          onInput={inputHandler}
        />
        <Input
          id="address"
          label="Address"
          element="input"
          validators={[VALIDATOR_REQUIRE]}
          errorText="please enter a valid address"
          onInput={inputHandler}
        />
        <ImageUpload
          id="image"
          onInput={inputHandler}
          errorText="Please provide an image"
        />
        <Button type="submit" disabled={!formState.isValid}>
          ADD
        </Button>
      </form>
    </React.Fragment>
  );
};

export default NewPlace;
