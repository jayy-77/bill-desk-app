import { useEffect, useState } from 'react'
import axios from 'axios'
var xmlhttp = new XMLHttpRequest();

function Sales() {
    const [sales, setSales] = useState([])
    const [totalSale, setTotalSale] = useState(0)
    const [fileName, setFileName] = useState("")

    function http_sale() {
        axios.get("http://127.0.0.1:8000/sales", { req: null })
            .then(response => {
                setSales(response.data.sales_data.sales)
            })
            .catch(err => console.log(err))
    }

    function http_sales_report() {
        axios.get("http://127.0.0.1:8000/sales-report", { req: null })
            .then(response => {
                setFileName(response.data.file_name)
            })
    }

    useEffect(() => {
        http_sale()
    }, [])

    useEffect(() =>{
        setTotalSale(0)
        sales.map((p) => {
            setTotalSale((totalSale) => totalSale + (parseInt(p.price) * parseInt(p.quantity)))
        })
    }, [sales])

    return (<>
        <h4 className='text-center m-1 p-2' style={{ backgroundColor: "whitesmoke" }}>SALES DATA of {localStorage.getItem("auth_token")}</h4>

        {fileName && <div class="m-3 alert alert-success d-flex align-items-center" role="alert">
            <div>
                Excel file <b>{fileName}</b> saved Successfully 
                <button onClick={() =>{
                    window.location.replace(`file:///C:/Users/Admin/Music/Bill-Desk/back-end/API/${fileName}`)
                }}> open </button>
                {/* <button onClick={() => {
                    xmlhttp.onreadystatechange = function(){
                        if(xmlhttp.status == 200 && xmlhttp.readyState == 4){
                        //   txt = xmlhttp.responseText;
                        }
                      };
                      xmlhttp.open("GET","D:/Copy of copy_1.pdf",true);
                      xmlhttp.send();
                }}>Open</button> */}
            </div>
        </div>}

        <div style={{ maxHeight: '600px', overflowY: 'auto' }}>
            {
                sales && (<>
                    <table class="table m-3">
                        <thead>
                            <tr>
                                <th scope="col">Date</th>
                                <th scope="col">Time</th>
                                <th scope="col">Name</th>
                                <th scope="col">Price</th>
                                <th scope="col">Purchase quantity</th>
                                <th scope="col">Purchase value</th>
                            </tr>
                        </thead>
                        {
                            sales.map((p) => (<>
                                <tbody>
                                    <tr>
                                        <td>{p.date}</td>
                                        <td>{p.time}</td>
                                        <td>{p.name}</td>
                                        <td>{p.price}</td>
                                        <td>{p.quantity}</td>
                                        <td>{p.purchase_value}</td>
                                    </tr>
                                </tbody>
                            </>))
                        }
                    </table>

                </>)
            }
        </div>
        <div class="btn-group w-100 p-3" role="group" aria-label="Basic outlined example">
            <button class="btn btn-outline-success"><h4>TOTAL SALE: ₹{totalSale}</h4></button>
            <button class="btn btn-outline-danger" onClick={http_sales_report}><h4>GENERATE REPORT</h4></button>
        </div>
    </>)
}

export default Sales