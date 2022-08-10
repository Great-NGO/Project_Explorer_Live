import JoditEditor from 'jodit-react';
import React, {useMemo, useRef, useState} from 'react';
import { Button, Dropdown, Form } from 'react-bootstrap';
// import CustomToggle from '../CustomToggle';
import Loader from '../Loader';


const EditComment = ({comment, handleEditComment}) => {

    const [openEditForm, setOpenEditForm] = useState(false);
    const [isLoading, setIsLoading] = useState(false)
    // Jodit Config set up
    const editor = useRef(null);
    const [ commentContent, setCommentContent ] = useState(comment.text||'');

    const config = useMemo(() => ({
    readonly:false,
    // placeholder: "Add a reply..."
    }), [])

    const handleEditCommentChange = (newContent) => {
        setCommentContent(newContent)
    }

        // Handle Cancel Edit function
        const handleCancelEdit = () => {
            setOpenEditForm(false)
        }

        const handleEditCommentSubmit = (evt) => {
            evt.preventDefault();
            handleEditComment(commentContent);
            setOpenEditForm(false)
        }

    let strippedString = commentContent.replace(/(<([^>]+)>)|&nbsp;|&zwnj;/gi, "");    


    return (
        <>

        {/* */}

                 {openEditForm ?
                    <Form onSubmit={handleEditCommentSubmit} >

                    <JoditEditor ref={editor} value={commentContent} config={config}  onChange={handleEditCommentChange} />

                    <div className="form-group my-2">
                        <Button variant="danger" className="me-2" type="button" onClick={handleCancelEdit}> Cancel </Button>
                        <Button className="small" variant="success" type="submit" data-comment-id={comment._id} disabled={strippedString < 1 ? true : false}> Edit </Button>
                    </div>

                    {isLoading ? <Loader size={"30px"} /> : "" }

                    </Form>
                    :

                    <Dropdown.Item onClick={() => setOpenEditForm(true)}>Edit</Dropdown.Item>

                }
        </>
    );
};


export default EditComment;