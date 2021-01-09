import { Formik, Form, Field } from "formik";
import React, { useContext } from "react";
import { Button, FormGroup, Label, Input } from "reactstrap";
import axios from "axios";
import { AppContext, setAlert } from "../context/context";
import { useHistory } from "react-router-dom";

const AddPost = () => {
  const [state, dispatch] = useContext(AppContext);
  const history = useHistory();
  const initialValues = {
    title: "",
    body: "",
    image: null,
    tag: [],
  };

  const onSubmit = async (values) => {
    const formData = new FormData();
    formData.append("title", values.title);
    formData.append("image", values.image);
    formData.append("body", values.body);
    await values.tag.map((tg, index) => formData.append(`tag`, tg));
    const config = {
      headers: {
        "Content-type": "multipart/form-data",
      },
    };
    axios
      .post("http://localhost:5000/api/post", formData, config)
      .then((res) => {
        dispatch({
          type: "ADD_POST",
          payload: res.data.data,
        });
        setAlert(dispatch, "success", "Post Added Successfully");
        history.push("/");
      })
      .catch((err) => console.log(err.response));
  };
  return (
    <div className="mt-5">
      <h2>What is Happen Today?</h2>
      <Formik initialValues={initialValues} onSubmit={onSubmit}>
        {({ values, handleChange, setFieldValue }) => {
          return (
            <Form>
              <FormGroup>
                <Label for="AddPostEmail">Title</Label>
                <Input
                  type="title"
                  name="title"
                  placeholder="Some title here"
                  value={values.title}
                  onChange={handleChange}
                />
              </FormGroup>
              <FormGroup>
                <Label for="AddPostText">Content</Label>
                <Input
                  type="textarea"
                  name="body"
                  id="AddPostText"
                  value={values.body}
                  onChange={handleChange}
                />
              </FormGroup>
              <FormGroup>
                <Label for="AddPostFile">Image</Label>
                <Input
                  type="file"
                  name="file"
                  id="AddPostFile"
                  accept="image/*"
                  onChange={(e) =>
                    e.target.files ? setFieldValue("image", e.target.files[0]) : null
                  }
                />
              </FormGroup>
              <Label>Tags</Label>
              <FormGroup>
                <Label className="mr-2">
                  <Field type="checkbox" name="tag" value="News" /> News
                </Label>
                <Label className="mr-2">
                  <Field type="checkbox" name="tag" value="Showbiz" /> Showbiz
                </Label>
                <Label className="mr-2">
                  <Field type="checkbox" name="tag" value="Technology" /> Technology
                </Label>
                <Label className="mr-2">
                  <Field type="checkbox" name="tag" value="Sport" /> Sport
                </Label>
                <Label className="mr-2">
                  <Field type="checkbox" name="tag" value="Otomotive" /> Otomotive
                </Label>
              </FormGroup>
              <Button type="submit">Submit</Button>
            </Form>
          );
        }}
      </Formik>
    </div>
  );
};

export default AddPost;
