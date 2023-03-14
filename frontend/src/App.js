import logo from './logo.svg';
import './App.css';
import FileUploader from './components/fileupload/FileUploader';

function App() {
  return (
    <div className="App">
    <h3>Upload your files here</h3>
      <FileUploader />
    </div>
  );
}

export default App;
