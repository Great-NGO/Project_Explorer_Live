import React from "react";
import Layout from "./shared/Layout";
import { Container } from "react-bootstrap";


const E404 = () => {
  return (
    <Layout>
      <Container>
        <div className="my-5">
          <div className="text-center">
            <h1 className="display-1 fw-bold">404</h1>
            <p className="fs-3">
              {" "}
              <span className="text-danger">Oops!</span> Page not found.
            </p>
            <p className="lead">The page you’re looking for doesn’t exist.</p>
            <a href="/" className="btn btn-primary">
              Go Back to Home Page
            </a>
          </div>
        </div>
      </Container>
    </Layout>
  );
};

export default E404;
