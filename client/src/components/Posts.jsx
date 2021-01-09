import React, { useContext, useEffect } from "react";
import { Card, CardImg, CardText, CardBody, CardTitle, CardSubtitle, CardFooter } from "reactstrap";
import axios from "axios";
import { AppContext } from "../context/context";
import { useHistory } from "react-router-dom";

const Posts = () => {
  const history = useHistory();
  const [state, dispatch] = useContext(AppContext);
  useEffect(() => {
    axios.get("/api/post/all").then((res) => {
      dispatch({
        type: "LOAD_POSTS",
        payload: res.data.data,
      });
    });
  }, []);

  return (
    <div>
      <h1>News</h1>
      {state.posts.map((post) => (
        <Card className="mt-3 p-3" key={post.id}>
          <CardImg
            top
            width="100%"
            src={`api/file/${post.image}`}
            alt="Card image cap"
            className="pointer"
            onClick={() => history.push(`/post/${post.id}`)}
          />
          <CardBody>
            <CardTitle
              tag="h5"
              className="under-hover pointer"
              onClick={() => history.push(`/post/${post.id}`)}>
              {post.title}
            </CardTitle>
            <CardSubtitle tag="h6" className="mb-2 text-muted">
              Posted By. {post.author.name} at {new Date(post.createdAt).toDateString()}
            </CardSubtitle>
            <CardText>{post.body}</CardText>
          </CardBody>
          <CardFooter>
            Tags :{" "}
            {post.tags.map((tag, index) =>
              index === post.tags.length - 1 ? `${tag.tag}` : `${tag.tag}, `
            )}
          </CardFooter>
        </Card>
      ))}
    </div>
  );
};

export default Posts;
