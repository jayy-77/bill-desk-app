import 'bootstrap/dist/css/bootstrap.min.css';
import { Route, Routes, Link } from "react-router-dom"
import Product from './components/Product'
import Navbar from './components/Navbar'
import Admin from './components/Admin';
import ProductForm from './components/ProductForm';
import Sales from './components/Sales';
import Auth from './components/Auth';
import Analysis from './components/Analysis'

function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/product" element={<Product />} />
        <Route path="/admin" element={<Admin />}> </Route>
        <Route path='/set-product' element = {<ProductForm/>}/>
        <Route path='/sales' element = {<Sales/>}/>
        <Route path='/analysis' element = {<Analysis/>}/>
        <Route path='/auth' element = {<Auth/>}/>
      </Routes>
    </>
  );
}

export default App;
