import React, { useState } from 'react';
import { Button, Form } from 'react-bootstrap';
import Loader from '../Loader';

const CommentForm = ({initialText, labelButtonText, commentState, type, handleSubmit, cancelHandler, placeholderText, loadedState, shouldShowButtons}) => {

    const [text, setText] = useState(initialText);
    const [showButtons, setShowButtons] = useState(shouldShowButtons);
    // const [isLoading, setIsLoading] = useState(loadedState)

    // console.log("What is isloading from commentform ", loadedState)

    const onSubmit = (evt) => {
        evt.preventDefault();
        handleSubmit(text);

        // If type is a comment or reply clear the input after submitting else don't clear the input
        type==="comment"||type==="reply" ? setText("") : setText(text)
        setShowButtons(false)


    }

    const handleChange = (evt) => {
        setText(evt.target.value);
        setShowButtons(true)
    }

    const handleCancel = () => {
        if(type === "comment" || type==="reply") {
            setText("")
            setShowButtons(false)
        } else {
            // setShowButtons(false)
            console.log("UUUUU")
            cancelHandler()
        }
        
    }
    
    // console.log("Yrhe type ", type)
    // console.log("Initial text", initialText)
    // console.log("TEXT ", text)
    // console.log("IS TEXT ", initialText===text)

    const strippedString = text.trim();

    return (
        <div className="row my-2">

        <div className="col" id="comments">
            
          {loadedState ? <Loader size={"40px"} /> : 
             
            <Form onSubmit={onSubmit}>

             <Form.Control as="textarea"  rows={4}  className="mt-2" value={text} onChange={handleChange} placeholder={placeholderText} />
 
             {showButtons ? 
               <div>
                 <Button variant="danger" type="button" className="mt-2" style={{border:'none'}} onClick={handleCancel}>
                   Cancel
                 </Button>
                 
                 {/* <Button variant="success" type="submit" className="mt-2 mx-2" disabled={strippedString.length < 1 ? true : false}> */}
                 <Button variant="success" type="submit" className="mt-2 mx-2" disabled={type==="comment"||type==="reply" ? strippedString.length < 1 ? true : false : initialText===text || strippedString.length < 1 ? true : false}>
                   {labelButtonText}
                 </Button>
               </div> 
               : null 
             }
  
            </Form>
 
            }

        </div>
      </div>
    );
};

export default CommentForm;