import React, { useContext } from "react";
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from "reactstrap";
import { FormGroup, Label, Input } from "reactstrap";
import { Formik, Form } from "formik";
import { AppContext, setAlert } from "../context/context";
import axios from "axios";

const Register = () => {
  const [state, dispatch] = useContext(AppContext);
  const onSubmit = (values) => {
    const config = {
      headers: {
        "Content-type": "application/json",
      },
    };
    const body = JSON.stringify(values);
    axios.post("/api/auth/register", body, config).then((res) => {
      dispatch({
        type: "REGISTER",
        payload: res.data.data,
      });
      setAlert(dispatch, "success", "Registered Successfully");
    });
  };
  const initialValues = {
    name: "",
    email: "",
    password: "",
  };
  return (
    <div>
      <Modal isOpen={state.register.isOpen}>
        <ModalHeader>REGISTER</ModalHeader>
        <ModalBody>
          <Formik onSubmit={onSubmit} initialValues={initialValues}>
            {({ handleChange, values }) => {
              return (
                <Form>
                  <FormGroup>
                    <Label for="exampleEmail">Name</Label>
                    <Input
                      type="text"
                      name="name"
                      placeholder="John Doe"
                      onChange={handleChange}
                      value={values.name}
                    />
                  </FormGroup>
                  <FormGroup>
                    <Label for="exampleEmail">Email</Label>
                    <Input
                      type="email"
                      name="email"
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
                      placeholder="Password"
                      onChange={handleChange}
                      value={values.password}
                    />
                  </FormGroup>
                  <Button color="success" className="mr-2 mb-2" type="submit">
                    Submit
                  </Button>
                  <Button
                    color="danger"
                    className="mb-2"
                    type="button"
                    onClick={() => dispatch({ type: "CLOSE_REGISTER" })}>
                    Cancel
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

export default Register;
