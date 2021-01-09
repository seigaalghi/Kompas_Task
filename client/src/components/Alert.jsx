import React, { useContext } from "react";
import { Alert } from "reactstrap";
import { AppContext } from "../context/context";

const AlertPopDown = () => {
  const [state] = useContext(AppContext);
  return (
    <div>
      <Alert color={state.alert.type}>{state.alert.message}</Alert>
    </div>
  );
};

export default AlertPopDown;
