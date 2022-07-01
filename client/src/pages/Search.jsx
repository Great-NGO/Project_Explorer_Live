// Might convert project page to SSR with Next js later on

import React, {useState, useEffect} from "react";
import { Row, Container, Col, Card, Form, FormControl, Button, InputGroup, Pagination } from "react-bootstrap";
import Layout from "./shared/Layout";
import AuthService from '../services/auth';
import Loader from "../components/Loader";

const Search = () => {
  
  const [projects, setProjects] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [numOfResult, setNumOfResult] = useState(0);
  const [numOfPage, setNumOfPage] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);
  let [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [searchBy, setSearchBy] = useState('');

  useEffect(() => {

    fetch('/api/search')
      .then(async (response) => {
        const res = await response.json();
        console.log("The result ", res);
        setNumOfResult(res.allProjects)
        setCurrentPage(res.currentPage);
        setNumOfPage(res.numOfPages);
        const { data } = res
        console.log('The projects ', data);
        setProjects(data);
        setIsLoading(false);
      })

  }, [])
  
// On submit search result
const handleSearch = (evt) => {

  evt.preventDefault();
  console.log("ONsubmit ")
  setIsLoading(true)    //Load Loader component

  fetch(`/api/search?search=${search}&searchBy=${searchBy}&page=${currentPage}`)
  .then(async (response) => {
    const res = await response.json();
    console.log("The result ", res);
    setNumOfResult(res.allProjects)
    setCurrentPage(res.currentPage);
    setNumOfPage(res.numOfPages);
    const { data } = res
    console.log('The projects ', data);
    setProjects(data);
    setIsLoading(false);
  })

  
}

const result = () => {
  setIsLoading(true)    //Load Loader component

  fetch(`/api/search?search=${search}&searchBy=${searchBy}&page=${currentPage}`)
  .then(async (response) => {
    const res = await response.json();
    console.log("The result ", res);
    setNumOfResult(res.allProjects)
    setCurrentPage(res.currentPage);
    setNumOfPage(res.numOfPages);
    const { data } = res
    console.log('The projects ', data);
    setProjects(data);
    setIsLoading(false);
  })
 
}

  //On Click first button
  const handleClickFirst = (evt) => {
    evt.preventDefault();
 
    
    setIsLoading(true)    //Load Loader component

    fetch(`/api/search?search=${search}&searchBy=${searchBy}`)
    .then(async (response) => {
      const res = await response.json();
      console.log("The result ", res);
      setNumOfResult(res.allProjects)
      setCurrentPage(res.currentPage);
      setNumOfPage(res.numOfPages);
      const { data } = res
      console.log('The projects ', data);
      setProjects(data);
      setIsLoading(false);
    })
  
  }

  //On Click previous button
  const handleClickPrevious = (evt) => {
    evt.preventDefault();

    console.log("The page ", page)
    setPage(page-1);
    
    setIsLoading(true)    //Load Loader component

    fetch(`/api/search?search=${search}&searchBy=${searchBy}&page=${page}`)
    .then(async (response) => {
      const res = await response.json();
      console.log("The result ", res);
      setNumOfResult(res.allProjects)
      setCurrentPage(res.currentPage);
      setNumOfPage(res.numOfPages);
      const { data } = res
      console.log('The projects ', data);
      setProjects(data);
      setIsLoading(false);
    })
  
  }
  
  //On Click next button
  const handleClickNext = (evt) => {
    evt.preventDefault();

    console.log("The page ", page)
    setPage(page+1);
    
    setIsLoading(true)    //Load Loader component

    fetch(`/api/search?search=${search}&searchBy=${searchBy}&page=${page}`)
    .then(async (response) => {
      const res = await response.json();
      console.log("The result ", res);
      setNumOfResult(res.allProjects)
      setCurrentPage(res.currentPage);
      setNumOfPage(res.numOfPages);
      const { data } = res
      console.log('The projects ', data);
      setProjects(data);
      setIsLoading(false);
    })
  
  }

  //On Click last button
  const handleClickLast = (evt) => {
    evt.preventDefault();
    
    setIsLoading(true)    //Load Loader component

    fetch(`/api/search?search=${search}&searchBy=${searchBy}&page=${numOfPage}`)
    .then(async (response) => {
      const res = await response.json();
      console.log("The result ", res);
      setNumOfResult(res.allProjects)
      setCurrentPage(res.currentPage);
      setNumOfPage(res.numOfPages);
      const { data } = res
      console.log('The projects ', data);
      setProjects(data);
      setIsLoading(false);
    })
  
  }

  console.log("Search ", search)
  console.log("Search By", searchBy)

  return (
    <>
      
      <Layout>
        <>
        <nav className="searchNavbar container">
            <div >
              <h2 id="project_gallery" className="mt-3"> Project Gallery</h2>
            </div>

                <Form onSubmit={handleSearch} style={{backgroundColor: "lightgray"}} className="px-3 py-3">
                  <Row className="align-items-center">
                    <Col xs={12} lg={7}>
                      <FormControl
                          // type="search"
                          name="search"
                          value={search}
                          placeholder="Search Project name, authors, abstract, tags"
                          className="me-2 mt-1"
                          aria-label="Search"
                          onChange={(evt) => setSearch(evt.target.value)}
                          // required
                        />
                    </Col>
                    <Col lg={3} md={6}>
                      <InputGroup className="mt-1">
                        <InputGroup.Text>SearchBy</InputGroup.Text>
                        <Form.Select
                          name="searchBy"
                          value={searchBy}
                          onChange={(evt) => setSearchBy(evt.target.value) }
                          required
                        >
                            <option value="name">Name</option>
                            <option value="abstract">Abstract</option>
                            <option value="authors">Authors</option>
                            <option value="tags">Tags</option>
                            <option value="">All</option>
                       
                          </Form.Select>

                      </InputGroup>
                    </Col>
                    <Col lg={2} md={6}>
                      <div className="d-grid gap-2 mt-1">
                        <Button variant="success" type="submit">Search</Button> 
                      </div>
                    </Col>
                
                  </Row>
                </Form>



           
            </nav>

          <Container fluid="md" className="mt-5">
            <div style={{display:"flex", justifyContent:"space-between", marginBottom:"10px"}}>
              <h3 >All Projects ({numOfResult} results) </h3>
              <span style={{fontWeight: "500", paddingTop:"5px"}}> Page {currentPage} of {numOfPage} </span>
            </div>

          {isLoading ? <Loader size={"150px"}/> : 

          <>
            {/* Data from api is always 8 results if it's up to 8 ... since im using css grid and breakpoints there's no need to slice the results */}
            <Row xs={1} lg={4} md={2} sm={2} className="g-4 showcase">
              {projects&&projects.map((project) => (

                <Col key={project._id} className="projCard" >
                  <Card keys={project._id} className="singleCard">
                    <Card.Body keys={project._id}>
                        <Card.Title > <a href={`/projects/${project._id}`} keys={project.name} style={{textDecoration:"none", color:"#198754", fontWeight:"bold"}}>{project.name} </a>  </Card.Title>
                        <Card.Link href="#" className="projectAuthors">
                          {project.authors.join(",")}
                        </Card.Link>
                        <Card.Text className="projectText">{project.abstract.substring(0, 100)} ...</Card.Text>
                        <Card.Link href="#" className="projectTags"> {project.tags.join('#')}</Card.Link>
                        {/* <p>Last visited</p> */}
                     </Card.Body>
                  </Card>
                </Col>
                ))}
            </Row>

            </>
            
          }

            <Container>
              <Row>
                <Col>
                  <Pagination className="justify-content-center">
                    <Pagination.First onClick={handleClickFirst} disabled={currentPage===1 ? true : false}>First</Pagination.First>
                    <Pagination.Prev onClick={handleClickPrevious} disabled={currentPage===1 ? true : false}>Previous</Pagination.Prev>
                    <Pagination.Item active>{currentPage}</Pagination.Item>
                    <Pagination.Next onClick={handleClickNext} disabled={currentPage===numOfPage ? true : false} >Next</Pagination.Next>
                    <Pagination.Last onClick={handleClickLast} disabled={currentPage===numOfPage ? true : false}>Last</Pagination.Last>
                  </Pagination>          
                </Col>
              </Row>
         
              {/* <Row>
                <Col>
                  <Pagination className="justify-content-center">
                    <Pagination.First />
                    <Pagination.Prev />
                    <Pagination.Item active>{1}</Pagination.Item>
                    <Pagination.Next />
                    <Pagination.Last />
                  </Pagination>          
                </Col>
              </Row> */}

            </Container>
          </Container>
          
        </>
      </Layout>
    </>
  )
}

export default Search;
