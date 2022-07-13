import React, { useRef, useState, useMemo } from 'react'
import JoditEditor from "jodit-react";

const Editor = ({ value, onChange }) => {
  const editor = useRef(null)
  const [content, setContent] = useState(value)
  const config = {}
								
  return useMemo(() => ( 
    <JoditEditor
      ref={editor}
      value={content}
      config={config}
      onChange={content => {
        setContent(content)
        onChange(content)
      }}
    /> 
  ), [])
}

export default Editor