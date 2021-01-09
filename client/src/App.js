import { Container } from "reactstrap";
import "./App.css";
import Login from "./components/Login";
import NavBar from "./components/NavigationBar";
import Posts from "./components/Posts";
import Register from "./components/Register";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import { useContext, useEffect } from "react";
import { AppContext } from "./context/context";
import setAuthToken from "./utility/setAuthToken";
import axios from "axios";
import AddPost from "./components/AddPost";
import PostDetail from "./components/PostDetail";
import EditPost from "./components/EditPost";
import AlertPopDown from "./components/Alert";

if (localStorage.token) {
  setAuthToken(localStorage.token);
}

function App() {
  const [state, dispatch] = useContext(AppContext);
  useEffect(() => {
    console.log(state);
  }, [state]);
  useEffect(() => {
    axios.get("/api/auth/").then((res) => {
      dispatch({
        type: "LOAD_USER",
        payload: res.data.data,
      });
    });
  }, []);
  return (
    <Container className="App">
      <Router>
        <Login />
        <Register />
        <NavBar />
        {state.alert.isOpen ? <AlertPopDown /> : null}
        <Switch>
          <Route component={Posts} exact path="/" />
          <Route component={AddPost} exact path="/add-post" />
          <Route component={PostDetail} exact path="/post/:id" />
          <Route component={EditPost} exact path="/edit-post/:id" />
        </Switch>
      </Router>
    </Container>
  );
}

export default App;
