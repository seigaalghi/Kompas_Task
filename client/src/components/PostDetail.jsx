import axios from "axios";
import React, { Fragment, useContext, useEffect, useState } from "react";
import { useHistory, useParams } from "react-router-dom";
import {
  Card,
  CardImg,
  CardText,
  CardBody,
  CardSubtitle,
  Button,
  CardFooter,
  Media,
  InputGroup,
  InputGroupAddon,
  Input,
} from "reactstrap";
import { AppContext, setAlert } from "../context/context";

const Example = () => {
  const [state, dispatch] = useContext(AppContext);
  const [comment, setComment] = useState({
    comment: "",
  });
  const { id } = useParams();
  const history = useHistory();
  useEffect(() => {
    axios.get(`/api/post/${id}`).then((res) => {
      dispatch({
        type: "LOAD_POST",
        payload: res.data.data,
      });
    });
  }, []);

  const likeHandler = (postId) => {
    axios.post(`/api/post/like/${postId}`).then((res) => {
      dispatch({
        type: "ADD_LIKE",
        payload: { like: res.data.data, id: postId },
      });
    });
  };

  const dislikeHandler = (postId) => {
    axios.delete(`/api/post/like/${postId}`).then(() => {
      dispatch({
        type: "DELETE_LIKE",
        payload: { postId: id, authorId: state.author.id },
      });
    });
  };

  const deletePost = (postId) => {
    axios.delete(`/api/post/${postId}`).then(() => {
      dispatch({
        type: "DELETE_POST",
        payload: { postId },
      });
      setAlert(dispatch, "success", "Post Deleted Successfully");
      history.push("/");
    });
  };

  const addComment = () => {
    const config = {
      headers: {
        "Content-type": "application/json",
      },
    };
    const body = JSON.stringify(comment);
    axios.post(`/api/post/comment/${id}`, body, config).then((res) => {
      dispatch({
        type: "ADD_COMMENT",
        payload: { comment: res.data.data },
      });
      setComment({ comment: "" });
      setAlert(dispatch, "success", "Comment Posted Successfully");
    });
  };
  const deleteComment = (commentId) => {
    axios.delete(`/api/post/comment/${commentId}`).then(() => {
      dispatch({
        type: "DELETE_COMMENT",
        payload: { commentId },
      });
      setAlert(dispatch, "success", "Comment Deleted Successfully");
    });
  };

  return !state.post.author ? null : (
    <div>
      <Button className="mr-2 mt-2 mb-2" onClick={() => history.push("/")}>
        Go Back
      </Button>
      {state.post.author.id === state.author.id ? (
        <Fragment>
          <Button
            className="mr-2 mt-2 mb-2"
            color="warning"
            onClick={() => history.push(`/edit-post/${id}`)}>
            Edit
          </Button>
          <Button className="mr-2 mt-2 mb-2" color="danger" onClick={() => deletePost(id)}>
            Delete
          </Button>
        </Fragment>
      ) : null}
      <Card className="p-3">
        <h2>{state.post.title}</h2>
        <CardImg top width="100%" src={`/api/file/${state.post.image}`} alt="Card image cap" />
        <CardBody>
          <CardSubtitle tag="h6" className="mb-2 text-muted">
            Posted By. {state.post.author.name} at {new Date(state.post.createdAt).toDateString()}
          </CardSubtitle>
          <CardText>{state.post.body}</CardText>
        </CardBody>
        <CardFooter className="text-right">
          {state.post.likes.find((like) => like.authorId === state.author.id) ? (
            <i
              className="bi bi-heart-fill mr-1 ml-3 text-danger pointer"
              onClick={() => dislikeHandler(id)}></i>
          ) : (
            <i className="bi bi-heart-fill mr-1 ml-3 pointer" onClick={() => likeHandler(id)}></i>
          )}
          {state.post.likes.length}
          <i className="bi bi-chat-left-dots-fill mr-1 ml-3"></i>
          {state.post.comments.length}
        </CardFooter>
        {state.isLogin ? (
          <InputGroup>
            <Input
              placeholder="Comment here"
              value={comment.comment}
              onChange={(e) => setComment({ comment: e.target.value })}
            />
            <InputGroupAddon addonType="append">
              <Button onClick={addComment}>Send</Button>
            </InputGroupAddon>
          </InputGroup>
        ) : null}
        <CardFooter>
          {state.post.comments.map((comment) => (
            <Media key={comment.id}>
              <Media body>
                <Media heading>
                  {comment.author.name}{" "}
                  {comment.authorId === state.author.id ? (
                    <Button onClick={() => deleteComment(comment.id)} color="danger">
                      Delete
                    </Button>
                  ) : null}
                </Media>
                {comment.comment}
              </Media>
              <Media>
                <Media body>Posted at {new Date(comment.createdAt).toDateString()}</Media>
              </Media>
            </Media>
          ))}
        </CardFooter>
      </Card>
    </div>
  );
};

export default Example;
