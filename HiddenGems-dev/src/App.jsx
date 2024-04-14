import { Navbar, Nav, Container } from 'react-bootstrap'; // React Bootstrap components
import { useSelector, useDispatch } from 'react-redux'; // Redux hooks
import { NavLink, Outlet } from 'react-router-dom'; // React Router components
import * as Icon from 'react-bootstrap-icons'; // Importing React Bootstrap Icons
import { useEffect } from 'react'; // Make sure to import React and useEffect correctly
import axios from 'axios'; // Ensure axios is correctly imported, note the missing quote at the end in your snippet

// Components/Pages/CSS
import 'bootstrap/dist/css/bootstrap.min.css'; // Import Bootstrap CSS
import 'bootstrap-icons/font/bootstrap-icons.css'; // Import Bootstrap Icons CSS
import "./CSS/App.css";
import gemIcon from "../src/public/blue1.png"





function App() {
  const userId = useSelector(state => state.userId);
  const navbarColor = useSelector(state => state.navbarColor);
  const dispatch = useDispatch();

  const sessionCheck = async () => {
    const res = await axios.get("/session-check");

    if (res.data.success) {
      console.log("Session check is running:", res.data.message);
      dispatch({
        type: "USER_AUTH",
        payload: res.data.userId
      })
    } else {
      dispatch({
        type: "COMPLETED_LOADING"
      })
    }
  }

  useEffect(() => {
    sessionCheck()
  }, [])

  const handleLogout = async () => {
    if (!userId) { return } // if the user is already logged out, no need to do this
    const res = await axios.get('/logout'); // deletes req.session.userId and makes it null

    if (res.data.success) { // if it DOES delete req.session.userId, it will update the userId in the redux store to be null as well
      dispatch({
        type: 'LOGOUT'
      });
    }
  };


  return (
    
    <>
    
      <Navbar expand='md' className='navbar navbar-light ' style={{ backgroundColor: navbarColor }}>
        <Container fluid className="d-flex">
          <Navbar.Brand>
            <Icon.Gem className="main-navbar-icon" />
            Hidden Gems
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse>
            <Nav className="me-auto">
              <NavLink to="/" className="nav-link">
                <Icon.House className="navbar-icon"/>
                Home
              </NavLink>
              <NavLink to="/discover" className="nav-link">
                <Icon.Search className="navbar-icon"/>
                Discover
              </NavLink>
              <NavLink to="/about" className="nav-link">
                  <Icon.InfoCircle className="navbar-icon"/>
                  Our Picks
              </NavLink>
            </Nav>
            <Nav className="ms-auto">
                <NavLink to="/login" className="nav-link" onClick={handleLogout}>
                  <Icon.BoxArrowInRight className="navbar-icon"/>
                  {userId ? "Logout" : "Login"}
                </NavLink>
                <NavLink to="/profile" className="nav-link">
                  <Icon.Person className="navbar-icon"/>
                  Profile
                </NavLink>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      <Outlet />
    </>
  );
}

export default App;
