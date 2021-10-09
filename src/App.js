import '../node_modules/bootstrap/dist/css/bootstrap.min.css';
import './app.css';
import Header from './components/Header';

function App() {

  return (
      <div className="app-container">
        <Header title={'Photo editor'}/>
        <div className="content">
          Hi
        </div>
      </div>)
}

export default App;
