import React, { Fragment, useContext } from "react";
import { useHistory } from "react-router-dom";
import {
  Navbar,
  NavbarBrand,
  Nav,
  UncontrolledDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  NavbarText,
} from "reactstrap";
import { AppContext, setAlert } from "../context/context";

const NavBar = () => {
  const [state, dispatch] = useContext(AppContext);
  const history = useHistory();
  return (
    <div>
      <Navbar color="light" light expand="md">
        <NavbarBrand onClick={() => history.push("/")} className="pointer">
          Daily News
        </NavbarBrand>
        <Nav className="mr-auto" navbar>
          <UncontrolledDropdown nav inNavbar>
            <Fragment>
              <DropdownToggle nav caret>
                Menu
              </DropdownToggle>
              <DropdownMenu right>
                {state.isLogin ? (
                  <Fragment>
                    <DropdownItem onClick={() => history.push("/add-post")}>
                      Add Post <i className="bi bi-newspaper"></i>
                    </DropdownItem>
                    <DropdownItem divider />
                    <DropdownItem
                      onClick={() => {
                        dispatch({ type: "LOGOUT" });
                        setAlert(dispatch, "warning", "Logged Out Successfully");
                      }}>
                      Logout <i className="bi bi-box-arrow-right"></i>
                    </DropdownItem>
                  </Fragment>
                ) : (
                  <Fragment>
                    <DropdownItem onClick={() => dispatch({ type: "OPEN_LOGIN" })}>
                      Login <i className="bi bi-box-arrow-left"></i>
                    </DropdownItem>
                    <DropdownItem onClick={() => dispatch({ type: "OPEN_REGISTER" })}>
                      Register <i className="bi bi-person-plus-fill"></i>
                    </DropdownItem>
                  </Fragment>
                )}
              </DropdownMenu>
            </Fragment>
          </UncontrolledDropdown>
        </Nav>
        <NavbarText>{state.isLogin ? `Welcome ${state.author.name}` : "Guest"}</NavbarText>
      </Navbar>
    </div>
  );
};

export default NavBar;
