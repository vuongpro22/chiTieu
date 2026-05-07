import logo from './logo.svg';
import './App.css';
import './components/toast/noti.css';
import ChiTieu from './components/chitieu';

function App() {
  return (
    <div className="App">
      <div id="toast"></div>
      <ChiTieu />
    </div>
  );
}

export default App;
