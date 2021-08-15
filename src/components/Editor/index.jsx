
import React, { useState } from 'react';
// import 'tinymce/tinymce';
// import 'tinymce/icons/default';
// import 'tinymce/themes/silver';
// import 'tinymce/plugins/paste';
// import 'tinymce/plugins/n1ed';
// import 'tinymce/plugins/link';
// import 'tinymce/plugins/image'; 
// import 'tinymce/plugins/table';
// import "tinymce/skins/ui/material-outlined/skin.min.css";
// import "tinymce/skins/ui/material-outlined/content.css";
// import 'tinymce/skins/ui/oxide/skin.min.css';
// import 'tinymce/skins/ui/oxide/content.min.css';
// import 'tinymce/skins/content/default/content.min.css';
// import { Editor as TinyMCE } from '@tinymce/tinymce-react';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';

const Editor = ({ initialContent, setContent, debug = false, withoutN1edScript = false }) => {
  
  const n1edScript = "<script src=\"//cdn.public.n1ed.com/OSZMDFLT/widgets.js\"></script>";
  const [text, setText] = useState(initialContent);

  function handleEditorChange(content) {
    if (withoutN1edScript) content = content.replace(n1edScript, '');
    if (content === "") content = null;
    if (debug) console.log('Content was updated:', { content });
    setText(content);
    setContent(content);
  };
  
  return (<>
    {/* <TinyMCE
      initialValue={initialContent}
      apiKey='OSZMDFLT'
      init={{
        // skin: 'material-outline',
        // content_css: 'material-outline',
        // icons: 'material',
        height: 800,
        plugins: [
          'advlist autolink lists link image charmap print preview anchor',
          'searchreplace visualblocks code fullscreen',
          'insertdatetime media table paste code help wordcount',
          // 'n1ed'
        ],
        apiKey: "OSZMDFLT", 
        toolbar:
          'undo redo | formatselect | bold italic textcolor backcolor | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | removeformat | help'
      }}
      value={text}
      onEditorChange={handleEditorChange}
    /> */}
    <CKEditor editor={ClassicEditor}
      data={text}
      onChange={ ( event, editor ) => {
        const editorData = editor.getData();
        handleEditorChange(editorData);
      } }
    />
  </>);
}

export default Editor;
