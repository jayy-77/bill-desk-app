import axios from 'axios'
import { useEffect, useState } from 'react';

function ProductForm() {
    const [status, setStatus] = useState(false)
    const [form_data, setFormData] = useState({})

    function http_set_product(){
        axios.get(`http://127.0.0.1:8000/set-product-data`, {
            params: form_data
        })
            .then(response => {setStatus(true);})
            .catch(err => console.log(err))
    }

    useEffect(() =>{
        if(!localStorage.getItem("auth_token")) window.location.href = '/'
    })

    function form_shallow_copy(e){
        setFormData(data =>({
            ...data,
            ...{[e.target.id]: e.target.value}
        }))
    }

    return (
        <>
        {status ? <h1>Data Stored</h1> : null}
            <div className="container mt-5 border border-primary p-5">
                <h4>Add new product</h4>
                <form method='get' onSubmit={(e) => {e.preventDefault(); http_set_product()}}>
                    <div class="mb-3">
                        <label for="name" class="form-label">Product Name</label>
                        <input type="text" class="form-control" id="name" placeholder="Enter product name" onChange={(e) =>{form_shallow_copy(e)}}/>
                    </div>
                    <div class="mb-3">
                        <label for="price" class="form-label">Product Price</label>
                        <input type="number" class="form-control" id="price" placeholder="Enter product price" onChange={(e) =>{form_shallow_copy(e)}}/>
                    </div>
                    <div class="mb-3">
                        <label for="quantity" class="form-label">Quantity</label>
                        <input type="number" class="form-control" id="quantity" placeholder="Enter quantity" onChange={(e) =>{form_shallow_copy(e)}}/>
                    </div>
                    <button type="submit" class="btn btn-primary">Submit</button>
                </form>
            </div>
        </>
    )
}

export default ProductForm