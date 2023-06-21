import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';

import {useState} from 'react';
import {decryptData} from './crypt.js';
import {UserProvider} from './AppContext.js';
import {BrowserRouter, Routes, Route, Redirect} from 'react-router-dom';

import AppNavBar from './components/AppNavBar.js';
import SideBar from './components/SideBar.js';
import NotFound from './pages/NotFound.js';
import Logout from './pages/Logout.js';
import Login from './pages/Login.js';
import Register from './pages/Register.js';
import Home from './pages/Home.js';
import AddProduct from './pages/AddProduct.js';
import UpdateProduct from './pages/UpdateProd.js';
import Products from './pages/Products.js';


function App() {
  document.body.style = 'background: black';

  let tokenUsr = localStorage.getItem('tokenU');
  let tokenAdm = localStorage.getItem('tokenA');

  const [user, setUser] = useState({
    id: tokenUsr === null ? null : decryptData(tokenUsr),
    isAdmin: tokenAdm === null ? null : decryptData(tokenAdm)
  });

  const unsetUser = () => {
    localStorage.clear();
  }

  return (
    <UserProvider value={{user, setUser, unsetUser}}>
      <BrowserRouter>
        <SideBar pageWrapId={'page-wrap'} outerContainerId={'outer-container'} />
        <AppNavBar />
        <Routes>
          <Route path='/login'                        element={<Login/>}          />
          <Route path='/logout'                       element={<Logout/>}         />
          <Route path='/register'                     element={<Register/>}       />
          <Route path='/addProduct'                   element={<AddProduct/>}     />
          <Route path='/updateProduct/:index/:prodId' element={<UpdateProduct/>}  />
          <Route path='/products/:index'              element={<Products/>}       />
          <Route path='/'                             element={<Home/>}           />
          <Route path='*'                             element={<NotFound/>}       />
        </Routes>
      </BrowserRouter>
    </UserProvider>
  );
}

export default App;
