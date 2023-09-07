import { useEffect } from "react"
import { Link } from "react-router-dom"

function Admin() {

    useEffect(() =>{
        if(!localStorage.getItem("auth_token")) window.location.href = '/'
    })

    return (
        <>
            <div class="container text-center">
                <div class="row mt-5">
                    <div class="col">
                        <Link to="/sales" style={{textDecoration: "none"}}>
                        <div style={{backgroundColor: "whitesmoke"}} className="p-1">
                            <img src="sales.svg" alt="none" height={"200px"} width={"200px"} />
                            <hr/>
                            <h3>Sales Data</h3>
                        </div>  
                        </Link>
                    </div>
                    <div class="col">
                        <Link to='/set-product' style={{textDecoration: "none"}}>
                            <div style={{backgroundColor: "whitesmoke"}} className="p-1">
                                <img src="add.svg" alt="none" height={"200px"} width={"200px"} />
                                <hr/>
                                <h3>Add Product</h3>
                            </div>
                        </Link>
                    </div>
                </div>
                <div class="row mt-5">
                    <div class="col">
                        <Link to ="/analysis" style={{textDecoration: "none"}}>
                            <div style={{backgroundColor: "whitesmoke"}} className="p-1">
                                <img src="analysis.svg" alt="none" height={"200px"} width={"200px"} />
                                <hr/>
                                <h3>Data Analysis</h3>
                            </div>
                        </Link>
                    </div>
                    <div class="col">
                        <div style={{backgroundColor: "whitesmoke"}} className="p-1">
                            <img src="update.svg" alt="none" height={"200px"} width={"200px"} />
                            <hr/>
                            <h3>Update Product Data</h3>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Admin