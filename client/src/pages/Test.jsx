/*  TEST FILE FOR WESTWAY CLIENT PROJECT. TO TEST MULTIPLE IMAGE UPLOAD*/

import React, { useState } from "react";
import Layout from "./shared/Layout";
import { Form, Button, Container } from "react-bootstrap";
import axios from "axios";

const Test = () => {

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState();
  const [category, setCategory] = useState('');
  const [quantity, setQuantity] = useState();
  const [size, setSize ] = useState('');

//   For the 4 Images
  const [mainImage, setMainImage ] = useState();
  const [otherImg1, setOtherImg1 ] = useState();
  const [otherImg2, setOtherImg2 ] = useState();
  const [otherImg3, setOtherImg3 ] = useState();


  const handleSubmit = async (evt) => {
    evt.preventDefault();

    let formData = new FormData();
    formData.append("name", name);
    formData.append("description", description);
    formData.append("price", price);
    formData.append("category", category);
    formData.append("quantity", quantity);
    formData.append("size", size);
    formData.append("mainImage", mainImage);
    formData.append("otherImg1", otherImg1);
    formData.append("otherImg2", otherImg2);

    // For multiple files. i.e IF the Other IMg3 was an input field that expected multiple files
    // for (const key of Object.keys(otherImg3)) {
    //     formData.append("otherImg3", otherImg3[key]);
    // }
    formData.append("otherImg3", otherImg3);

    console.log("FORM DATA TO BE SENT ", formData);


    try {
        const res = await axios.post('/api/admin/addProduct', formData, { headers: { "Content-Type": "multipart/form-data" }});
        console.log("The Response baby ", res);
    } catch (error) {
        console.log(error.response);
        console.log("The ERRORS", error.response.data.errors)
    }
  }

  const handleInputChange = (evt) => {
    let {name, value } = evt.target;
    // value = value.trim();

    if(name === "name") {
        console.log(`${name} : ${value}`);
        setName(value);
    }
    if(name === "description") {
        console.log(`${name} : ${value}`);
        setDescription(value);
    }
    if(name === "price") {
        console.log(`${name} : ${value}`);
        setPrice(value);
    }
    if(name === "category") {
        console.log(`${name} : ${value}`);
        setCategory(value);
    }
    if(name === "size") {
        console.log(`${name} : ${value}`);
        setSize(value);
    }
    if(name === "quantity") {
        console.log(`${name} : ${value}`);
        setQuantity(value);
    }
  }

//   Handle Image(s) upload functions
  const handleMainImage = (evt) => {
    const {value, files} = evt.target;
    console.log("Event", evt + "Value", value);
    setMainImage(files[0]);
  }

  const handleOtherImg1 = (evt) => {
    const {value, files} = evt.target;
    console.log("Event", evt + "Value", value);
    setOtherImg1(files[0]);

  }
  const handleOtherImg2 = (evt) => {
    const {value, files} = evt.target;
    console.log("Event", evt + "Value", value);
    setOtherImg2(files[0])
  }
  const handleOtherImg3 = (evt) => {
    const {value, files} = evt.target;
    console.log("Event", evt + "Value", value);
    setOtherImg3(files[0])
    // setOtherImg3(evt.target.files)   //For multiple file uploadds
  }


  console.log("Main image - ", mainImage);
  console.log("other image 1 - ", otherImg1);
  console.log("other image 2 - ", otherImg2);
  console.log("other image 3 - ", otherImg3);
  
//   console.log("The files ", files);

  return (
    <Layout>
      <>
        <Container fluid="md">
          <main className="border rounded p-5 mt-5" >
            <h1>Testing Multiple file inputs single upload.</h1>

            <Form onSubmit={handleSubmit}>
              
   
              <Form.Group controlId="formBasicProductName">
                <Form.Label size="lg">Product Name </Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter product name"
                  value={name}
                  name="name"
                  onChange={handleInputChange}
                //   required
                />
              </Form.Group>
   
              <Form.Group controlId="formBasicProductDescription">
                <Form.Label size="lg">Product Description </Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter product description"
                  value={description}
                  name="description"
                  onChange={handleInputChange}
                //   required
                />
              </Form.Group>
   
              <Form.Group controlId="formBasicProductPrice">
                <Form.Label size="lg">Product Price </Form.Label>
                <Form.Control
                  type="number"
                  placeholder="Enter product price"
                  value={price}
                  name="price"
                  onChange={handleInputChange}
                //   required
                />
              </Form.Group>
           
              <Form.Group controlId="formBasicProductCategory">
                <Form.Label size="lg">Product Category </Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter product category"
                  value={category}
                  name="category"
                  onChange={handleInputChange}
                //   required
                />
              </Form.Group>
     
              <Form.Group controlId="formBasicProductQuantity">
                <Form.Label size="lg">Product Quantity in stock</Form.Label>
                <Form.Control
                  type="number"
                  placeholder="Enter product quantity available in stock"
                  value={quantity}
                  name="quantity"
                  onChange={handleInputChange}
                //   required
                />
              </Form.Group>

              <Form.Group controlId="formBasicProductSize">
                <Form.Label size="lg">Product Size </Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter product size"
                  value={size}
                  name="size"
                  onChange={handleInputChange}
                //   required
                />
              </Form.Group>
     
              <Form.Group controlId="formFile1" className="mb-3 col-md-12">
                 <Form.Label>Main Image</Form.Label>
                 <Form.Control type="file" name="mainImage" accept="image/png, image/jpeg, image/jpg" onChange={handleMainImage}/>
              </Form.Group>     
    
              <Form.Group controlId="formFile2" className="mb-3 col-md-12">
                 <Form.Label>Other Image 1</Form.Label>
                 <Form.Control type="file" name="otherImg1" accept="image/png, image/jpeg, image/jpg" onChange={handleOtherImg1}/>
              </Form.Group>     
    
              <Form.Group controlId="formFile3" className="mb-3 col-md-12">
                 <Form.Label>Other Image2</Form.Label>
                 <Form.Control type="file" name="otherImg2" accept="image/png, image/jpeg, image/jpg" onChange={handleOtherImg2}/>
              </Form.Group>     
    
              <Form.Group controlId="formFile4" className="mb-3 col-md-12">
                 <Form.Label>Other Image3</Form.Label>
                 <Form.Control type="file" name="otherImg3" accept="image/png, image/jpeg, image/jpg" onChange={handleOtherImg3}/>
                 {/* <Form.Control type="file" name="otherImg3" accept="image/png, image/jpeg, image/jpg" multiple onChange={handleOtherImg3}/> */}
              </Form.Group>     
    


              <Button variant="primary" type="submit" className="mt-2">
                Submit
              </Button>
    
            </Form>
          </main>
        </Container>
      </>
    </Layout>
  );
};
export default Test;
