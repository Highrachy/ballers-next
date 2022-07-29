import React from 'react';
import MediumEditor from 'react-medium-editor';

const Editor = () => {
  const [text, setText] = React.useState('Type Something here');

  return (
    <MediumEditor
      text={text}
      onChange={(text, medium) => {
        setText(text);
        console.log(medium);
      }}
    />
  );
};

export default Editor;

// var App = React.createClass({
//   getInitialState() {
//     return { text: 'Fusce dapibus, tellus ac cursus commodo' };
//   },

//   render() {
//     return (
//       <div className="app">
//         <h1>react-medium-editor</h1>
//         <h3>Html content</h3>
//         <div>{this.state.text}</div>

//         <h3>Editor #1 (&lt;pre&gt; tag)</h3>
//         <Editor
//           tag="pre"
//           text={this.state.text}
//           onChange={this.handleChange}
//           options={{ toolbar: { buttons: ['bold', 'italic', 'underline'] } }}
//         />
//         <h3>Editor #2</h3>
//         <Editor text={this.state.text} onChange={this.handleChange} />
//       </div>
//     );
//   },

//   handleChange(text, medium) {
//     this.setState({ text: text });
//   },
// });
