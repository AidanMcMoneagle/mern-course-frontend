import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import { useHttpClient } from "../../shared/hooks/http-hook";

import PlaceList from "../components/PlaceList";
import ErrorModal from "../../shared/components/UIElements/ErrorModal";
import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner";

// need to fetch userplaces by userId.
//need use the current userId
//sends a list of the userplaces to the placeList component.

const UserPlaces = () => {
  const { userId } = useParams(); // we have the id of the user in the URL. can use this in the request.
  const { error, isLoading, sendRequest, clearError } = useHttpClient();
  const [userPlaces, setUserPlaces] = useState();

  // use UseEffect has we only want to send request once and not when component re renders.
  useEffect(() => {
    const fetchPlaces = async () => {
      try {
        const responseData = await sendRequest(
          `${process.env.REACT_APP_BACKEND_URL}/places/user/${userId}`
        );
        console.log(responseData.foundUserPlaces);
        setUserPlaces(responseData.foundUserPlaces);
      } catch (err) {}
    };
    fetchPlaces();
  }, [sendRequest, userId, setUserPlaces]);

  const placeDeleteHandler = (deletedPlaceId) => {
    const newUserPlaces = userPlaces.filter(
      (place) => place.id !== deletedPlaceId
    );
    setUserPlaces(newUserPlaces);
  };

  return (
    <React.Fragment>
      <ErrorModal onClear={clearError} error={error} />
      {isLoading && (
        <div className="center">
          <LoadingSpinner />
        </div>
      )}
      {!isLoading && userPlaces && (
        <PlaceList items={userPlaces} onDelete={placeDeleteHandler} />
      )}
      ;
    </React.Fragment>
  );
};

export default UserPlaces;
