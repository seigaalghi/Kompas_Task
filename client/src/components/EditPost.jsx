import React, { useContext, useEffect, useState } from "react";
import { Button, FormGroup, Label, Input, Form } from "reactstrap";
import axios from "axios";
import { AppContext, setAlert } from "../context/context";
import { useHistory, useParams } from "react-router-dom";

const EditPost = () => {
  const [state, dispatch] = useContext(AppContext);
  const history = useHistory();
  const { id } = useParams();
  const [form, setForm] = useState({
    title: "",
    body: "",
    image: null,
  });

  useEffect(() => {
    axios.get(`/api/post/${id}`).then((res) => {
      setForm({ ...res.data.data });
    });
  }, []);

  const onSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("title", form.title);
    formData.append("image", form.image);
    formData.append("body", form.body);
    const config = {
      headers: {
        "Content-type": "multipart/form-data",
      },
    };
    axios
      .patch(`http://localhost:5000/api/post/${id}`, formData, config)
      .then((res) => {
        dispatch({
          type: "ADD_POST",
          payload: res.data.data,
        });
        setAlert(dispatch, "success", "Post Edited Successfully");
        history.push(`/post/${id}`);
      })
      .catch((err) => console.log(err.response));
  };
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };
  return (
    <div className="mt-5">
      <h2>What is Happen Today?</h2>

      <Form onSubmit={onSubmit}>
        <FormGroup>
          <Label for="AddPostEmail">Title</Label>
          <Input
            type="title"
            name="title"
            placeholder="Some title here"
            value={form.title}
            onChange={handleChange}
          />
        </FormGroup>
        <FormGroup>
          <Label for="AddPostText">Content</Label>
          <Input
            type="textarea"
            name="body"
            id="AddPostText"
            value={form.body}
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
              e.target.files ? setForm({ ...form, image: e.target.files[0] }) : null
            }
          />
        </FormGroup>
        <Button type="submit">Submit</Button>
      </Form>
    </div>
  );
};

export default EditPost;
