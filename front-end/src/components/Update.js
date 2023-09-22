import axios from "axios"
import { useEffect, useState } from "react"

function Update() {
    const [productData, setProductData] = useState(null)
    const [updateFlag, setUpdateFlag] = useState(false)
    const [saveFlag, setSaveFlag] = useState(false)
    const [closeSec, setCloseSec] = useState(-1)

    useEffect(() => {
        axios.get('http://127.0.0.1:8000/get-product-data')
            .then(response => {
                setProductData(response.data.product_data)
            })
    }, [])

    useEffect(() => {
        if (saveFlag) {
            setTimeout(() => {
                setSaveFlag(!saveFlag)
            }, 10000)
        }
    }, [saveFlag])

    function shallow_edit(e, i) {
        const temp = [...productData]
        temp[i][e.target.name] = e.target.value
        setProductData(temp)
    }

    function updateOperation(i) {
        if (updateFlag) {
            http_update()
            setUpdateFlag(!updateFlag)
        } else {
            setUpdateFlag(!updateFlag)
        }
    }

    async function http_update() {
        await axios.get('http://127.0.0.1:8000/update', {
            params: {
                product_data: JSON.stringify({ data: productData })
            }
        })
            .then(response => setSaveFlag(true))
    }

    function deleteOperation(i) {
        setProductData(
            productData.filter((_, index) => {
                if (i !== index) return true
            })
        )
        http_update()
    }

    return (<>
        <div className="container-fluid">
            {saveFlag &&
                <div class="alert alert-success d-flex align-items-center" role="alert">
                    Product Data Updated <button className="btn btn-primary"> Closing in {closeSec} </button>
                </div>
            }
            <div class="btn-group w-100 mb-2" role="group">
                <button type="button" className={`btn btn-outline${updateFlag ? '-success' : '-primary'}`} onClick={updateOperation}><h6>{updateFlag ? "Save" : "Bulk Edit"}</h6></button>
            </div>
            <table class="table border table-hover">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Name</th>
                        <th>Price</th>
                        <th>Quantity</th>
                        <th>Delete</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        productData && productData.map((p, i) => (
                            <tr>
                                <td>{i + 1}</td>
                                <td>{updateFlag ? <input className="form-control" type="text" name="name" onChange={(e) => shallow_edit(e, i)} value={p.name} /> : p.name}</td>
                                <td>{updateFlag ? <input className="form-control" type="number" name="price" onChange={(e) => shallow_edit(e, i)} value={p.price} /> : p.price}</td>
                                <td>{updateFlag ? <input className="form-control" type="number" name="quantity" onChange={(e) => shallow_edit(e, i)} value={p.quantity} /> : p.quantity}</td>
                                <td><button className="btn btn-danger w-100" onClick={() => deleteOperation(i)}>Delete</button></td>
                            </tr>
                        ))
                    }
                </tbody>
            </table>
        </div>

    </>)
}

export default Update