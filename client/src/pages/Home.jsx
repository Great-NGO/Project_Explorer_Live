import React, {useState, useEffect, useRef} from "react";
import { Row, Container, Col, Card } from "react-bootstrap";
import Layout from "./shared/Layout";
import AuthService from '../services/auth';
import Loader from "../components/Loader";

//Importing and using the getCurrent user method
const { getCurrentUser } = AuthService;

const Jumbotron = () => {
  
  return (
    <Container>
      <section className="p-5 mb-2 mt-4 border rounded-3 container jumbotron">
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
            <a className="me-2 btn btn-success btn-md" type="button" href="Signup">
              Get Started
            </a>
            <a className="btn btn-secondary btn-md" type="button" href="Login">
              Login
            </a>
        </div>
        : null
      }
      </div>
      </section>
    </Container>
 
  );
};

const Home = () => {
  
  const [projects, setProjects] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [userId, setUserId] = useState('');

  useEffect(() => {

    fetch('/api/projectsShowcase')
      .then(async (response) => {
        const res = await response.json();
        const data = res.projects
        console.log('The projects ', data);
        setProjects(data);
        setIsLoading(false);
      })

      getCurrentUser() !== null ? setUserId(getCurrentUser()._id) : setUserId('');

  }, [])
  
  console.log("The user id ", userId);

  return (
    <>
      
      <Layout>
        <>
          <Jumbotron />
          
          <Container fluid="md">
        
          {isLoading ? <Loader size={"150px"}/> : 

            <Row xs={1} lg={4} md={2} sm={2} className="g-4 showcase mt-2">
              {projects&&projects.map((project) => (

                <Col key={project._id} className="projCard" >
                  <Card keys={project._id} className="singleCard">
                    <Card.Body keys={project._id}>
                        <Card.Title > <a href={`/projects/${project._id}`} keys={project.name} style={{textDecoration:"none", color:"#198754", fontWeight:"bold"}}>{project.name} </a>  </Card.Title>
                        <Card.Link href="#" className="projectAuthors">
                          {project.authors.join(",")}
                        </Card.Link>
                        <Card.Text className="projectText">{project.abstract.substring(0, 100)} ...</Card.Text>            

                        {project&&project.tags.map((tag) => (
                          <span>
                            <Card.Link href={`/search?search=${tag}&searchBy=tags`} className="projectTags" key={tag}> #{tag} </Card.Link>
                          </span>
                        ))}
                       
                       {getCurrentUser() !== null ? 
                       
                        <div>
        
                          {project.lastVisited.map((object) => (
                            <>
                              {object.userId === userId ? 
                                <>
                                  {/* {object.count} */}
                                  <p>You've visited this page: {object.count} times. <br /> Last visited {new Date(object.date).toLocaleDateString('en-GB')} </p>
                                  
                                </> : null
                              }
                    
                            </>
                          ))}

                        </div> : null

                      }

                     </Card.Body>
                  </Card>
                </Col>
                ))}
            </Row>
            
          }
          </Container>
          
        </>
      </Layout>
    </>
  )
}

export default Home;
