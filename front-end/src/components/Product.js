import axios from 'axios'
import { useEffect, useState } from 'react'
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

function Product() {
    const [product, setProduct] = useState(null)
    const [order, setOrder] = useState(null)
    const [total_bill, setTotalBill] = useState(0)
    const [currProduct, setCurrProduct] = useState({})
    const [security_code, setSecurityCode] = useState("")
    const [open, setOpen] = useState(false);
    const [payment, setPayment] = useState(false)

    function http_product() {
        axios.get('http://127.0.0.1:8000/get-product-data', { 
            params: {
                auth_token: JSON.stringify({ client: localStorage.getItem("auth_token") })
            }
         })
            .then(response => {
                setProduct(response.data.product_data);
            })
            .catch(err => console.log(err))
    }

    function http_upi_qr() {
        axios.get('http://127.0.0.1:8000/upi-qr', {
            params: {
                total_bill: JSON.stringify({ bill: total_bill })
            }
        })
            .then(response => {
                setOpen(true)
                setSecurityCode(response.data.security_code);
            })
            .catch(err => console.log(err))
    }

    function http_order() {
        axios.get('http://127.0.0.1:8000/order', {
            params: {
                order: JSON.stringify(order)
            }
        })
            .then(response => {
                setProduct(response.data.product_data)
                setPayment(true)
            })
            .catch(err => console.log(err))
    }

    function current_product_state(key, value) {
        setCurrProduct(curr => ({
            ...curr,
            ...{ [key]: value }
        }))
    }

    function order_state_management(e) {
        setTotalBill((total_bill) => total_bill + product[e]["price"] * parseInt(currProduct["purchase_qty"]))
        setOrder(o => ({
            ...o,
            ...{ [e]: currProduct }
        }))
        setCurrProduct({})
    }

    useEffect(() => {
       if(localStorage.getItem("auth_token")) http_product()
       else window.location.href = '/'
    }, [])

    return (
        <>  
            {payment && <>
                <div class="m-3 alert alert-success d-flex align-items-center" role="alert">
                    <div>
                       Order Placed Successfully.
                    </div>
                </div>
            </>}

            <div class="btn-group w-100 p-3" role="group" aria-label="Basic outlined example">
                <button type="button" class="btn btn-outline-primary"><h4>TOTAL: ₹{total_bill}</h4></button>
                <button type="button" class="btn btn-outline-primary" onClick={http_upi_qr}><h4>QR</h4></button>
            </div>
            <div className="container-fluid mt-3">
                <Dialog open={open} onClose={() => setOpen(false)} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description">
                    <DialogTitle id="alert-dialog-title">
                        {"Security Code"}
                    </DialogTitle>
                    <DialogContent>
                        <DialogContentText id="alert-dialog-description">
                            {security_code}
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => setOpen(false)}>close</Button>
                        <Button onClick={() => {
                            setOpen(false)
                            http_order();
                            setTotalBill(0)
                            setCurrProduct({})
                            setOrder({})
                            http_product()
                        }} autoFocus>
                            place order
                        </Button>
                    </DialogActions>
                </Dialog>
                <table class="table">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Name</th>
                            <th>Price</th>
                            <th>Quantity</th>
                            <th>Purchase Quantity</th>
                            <th>ADD</th>
                        </tr>
                    </thead>
                    <tbody>
                        {product ? product.map((p, index) => (<>
                            <tr onClick={() => current_product_state("name", product[index]["name"])}>
                                <td>{index}</td>
                                <td>{p.name}</td>
                                <td>{p.price}</td>
                                <td>{p.quantity}</td>
                                <td style={{ width: "0px" }}>
                                    <input type="number" id='purchase_qty' name={index} onChange={(e) => current_product_state(e.target.id, e.target.value)} disabled={p.name !== currProduct["name"]} />
                                </td>
                                <td className={`btn btn-primary ${p.name !== currProduct["name"] ? 'disabled' : ''}`} onClick={() => order_state_management(index)}>ADD</td>
                            </tr>
                        </>)) : null}
                    </tbody>
                </table>
            </div>
        </>
    )
}

export default Product