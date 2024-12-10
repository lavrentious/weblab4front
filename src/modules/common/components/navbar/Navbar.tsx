import * as React from "react";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import BootstrapNavbar from "react-bootstrap/Navbar";
import { LinkContainer } from "react-router-bootstrap";

const Navbar = () => {
  return (
    <BootstrapNavbar
      id="navbar"
      expand="lg"
      variant="light"
      bg="light"
      sticky="top"
    >
      <Container>
        <LinkContainer to="/">
          <BootstrapNavbar.Brand className="d-flex flex-nowrap align-items-center">
            <strong>weblab4</strong>
          </BootstrapNavbar.Brand>
        </LinkContainer>
        <BootstrapNavbar.Toggle>
          <span className="navbar-toggler-icon" />
        </BootstrapNavbar.Toggle>

        <BootstrapNavbar.Collapse>
          <Nav className="d-flex justify-content-between flex-row w-100">
            <div className="d-flex flex-wrap">
              <LinkContainer to="/dashboard">
                <Nav.Link>🗺 Основная страница</Nav.Link>
              </LinkContainer>
              <LinkContainer to="/">
                <Nav.Link>📄 Стартовая страница</Nav.Link>
              </LinkContainer>
            </div>
          </Nav>
        </BootstrapNavbar.Collapse>
      </Container>
    </BootstrapNavbar>
  );
};

export default Navbar;
