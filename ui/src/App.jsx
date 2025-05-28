
import './App.css'
import Body from './Body';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './Login';

function App() {

  return (
    <>
      <BrowserRouter basename="/">
        <Routes>
          <Route path="/" element={<Body />}>
            {/* Index route: renders when path is exactly "/" */}
            <Route index element={<div>Home Page</div>} />
            <Route path="login" element={<Login />} />
            <Route path="feed" element={<div>feed page</div>} />
          </Route>
          
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
  