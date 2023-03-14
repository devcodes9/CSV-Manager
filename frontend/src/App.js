import './App.css';
import FileUploader from './components/fileupload/FileUploader';

function App() {
  return (
    <div className="App">
    <h1>OneAssure CSV Manager</h1>
    <h3>Upload your files here</h3>
      <FileUploader />
    </div>
  );
}

export default App;
