import React, { useEffect, useState } from "react";
import UsersList from "../components/UsersList";
import ErrorModal from "../../shared/components/UIElements/ErrorModal";
import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner";
import { useHttpClient } from "../../shared/hooks/http-hook";

const Users = () => {
  // whenever we change the state in the useHttpClient custom hook the component in which the custom hook is used will be re-rendered.
  const { error, isLoading, sendRequest, clearError } = useHttpClient();
  const [loadedUsers, setLoadedUsers] = useState();

  // we only want to gettheUsers once on first render which is we wrap in useEffect. Otherwise we would have function within useEfect re run again whenever the state changes within the useEffect hook.
  //useEffect will run on the first render and any time the sendRequest function changes. Why we must use wrap the sendRequest in useCallback.
  //Sendrequest would be recreated every time the hook re runs which occurs whenever the Users component re runs. useEffect would then think that sendRequest has changed which would cause useEffect to re run which would cause an infinite loop.
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const responseData = await sendRequest(
          `${process.env.REACT_APP_BACKEND_URL}/users`
        );
        setLoadedUsers(responseData.users);
      } catch (err) {
        console.log(err);
      }
    };
    fetchUsers();
  }, [sendRequest]);

  return (
    <React.Fragment>
      {isLoading && (
        <div className="center">
          <LoadingSpinner />
        </div>
      )}
      <ErrorModal error={error} onClear={clearError} />
      {!isLoading && loadedUsers && <UsersList items={loadedUsers} />}
    </React.Fragment>
  );
};

export default Users;

// send LoadedUsers to UsersList.
