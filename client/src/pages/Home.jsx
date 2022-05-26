import React, {useState, useEffect} from "react";
import { Row, Container, Col, Card } from "react-bootstrap";
import Layout from "./shared/Layout";
import AuthService from '../services/auth';


const Jumbotron = () => {
  //Importing and using the getCurrent user method
  const { getCurrentUser } = AuthService;
  return (
    <section className="p-5 mb-2 mt-3 bg-light border rounded-3 container ">
      <div className="container-fluid py-1">
        <h1 className="display-5 fw-bold">Welcome to Project Explorer</h1>
        <p className="col-md-12 fs-4">
          Project Explorer is a repository for final year projects across all
          departments at your institution. You can submit your project and
          search projects submitted by others to learn from.
        </p>

        {/* To conditionally show the signup and logged in button based on if there is a user */}
        {getCurrentUser() === null ?
          <div>
            <a className="me-2 btn btn-primary btn-md getStartedBtn" type="button" href="Signup">
              Get Started
            </a>
            <a className="btn btn-secondary btn-md loginBtn" type="button" href="Login">
              Login
            </a>
        </div>
        : null
      }
      </div>
    </section>
  );
};

const Home = () => {
  
  const [projects, setProjects] = useState([])

  useEffect(() => {

    fetch('/api/projectsShowcase')
      .then(async (response) => {
        const res = await response.json();
        const data = res.projects
        console.log('The projects ', data);
        setProjects(data);
      })

  }, [])
  

  return (
    <>
      
      <Layout>
        <>
          <Jumbotron />
          
          <Container fluid="md">
        
            <Row xs={1} lg={4} md={2} sm={2} className="g-4 showcase mt-2">
              {projects&&projects.map((project) => (

                <Col key={project._id} className="projCard" >
                  <Card keys={project._id} >
                    <Card.Body keys={project._id}>
                        <Card.Title > <a href={`/projects/${project._id}`} keys={project.name} >{project.name} </a>  </Card.Title>
          
                        <Card.Link href="#" className="projectLinks">
                          {project.authors.join(",")}
                        </Card.Link>
                        <Card.Text >{project.abstract.substring(0, 100)} ...</Card.Text>
                        <Card.Link href="#" className="projectLinks"> {project.tags.join('#')}</Card.Link>
                     </Card.Body>
                  </Card>
                </Col>
                ))}
            </Row>
          </Container>
          
        </>
      </Layout>
    </>
  )
}

export default Home;
