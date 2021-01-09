import React, { useContext } from "react";
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from "reactstrap";
import { FormGroup, Label, Input } from "reactstrap";
import { Formik, Form } from "formik";
import { AppContext, setAlert } from "../context/context";
import axios from "axios";

const Login = () => {
  const [state, dispatch] = useContext(AppContext);
  const onSubmit = (values) => {
    const config = {
      headers: {
        "Content-type": "application/json",
      },
    };
    const body = JSON.stringify(values);
    axios.post("/api/auth/login", body, config).then((res) => {
      dispatch({
        type: "LOGIN",
        payload: res.data.data,
      });
      setAlert(dispatch, "success", "Logged in successfully");
    });
  };
  const initialValues = {
    email: "",
    password: "",
  };
  return (
    <div>
      <Modal isOpen={state.login.isOpen}>
        <ModalHeader>LOGIN</ModalHeader>
        <ModalBody>
          <Formik onSubmit={onSubmit} initialValues={initialValues}>
            {({ handleChange, values }) => {
              return (
                <Form>
                  <FormGroup>
                    <Label for="exampleEmail">Email</Label>
                    <Input
                      type="email"
                      name="email"
                      id="exampleEmail"
                      placeholder="email@address.com"
                      onChange={handleChange}
                      value={values.email}
                    />
                  </FormGroup>
                  <FormGroup>
                    <Label for="examplePassword">Password</Label>
                    <Input
                      type="password"
                      name="password"
                      id="examplePassword"
                      placeholder="Password"
                      onChange={handleChange}
                      value={values.password}
                    />
                  </FormGroup>
                  <Button
                    color="danger"
                    className="mb-2"
                    type="button"
                    onClick={() => dispatch({ type: "CLOSE_LOGIN" })}>
                    Cancel
                  </Button>
                  <Button color="success" className="ml-2 mb-2" type="submit">
                    Submit
                  </Button>
                  <ModalFooter />
                </Form>
              );
            }}
          </Formik>
        </ModalBody>
      </Modal>
    </div>
  );
};

export default Login;
