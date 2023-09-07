import { useEffect, useState } from "react"
import axios from 'axios'
function Auth() {
    const [clients, setClients] = useState([])
    const [currClient, setCurrClient] = useState("")
    const [accessKey, setAccessKey] = useState("")
    const [status, setStatus] = useState(null)

    function http_clients() {
        axios.get("http://127.0.0.1:8000/clients", { req: null })
            .then(response => {
                setClients(response.data.clients)
            })
            .catch(err => console.log(err))
    }

    function http_auth(e) {
        e.preventDefault()
        axios.get("http://127.0.0.1:8000/auth", {
            params: {
                auth_data: JSON.stringify({
                    client: currClient,
                    access_key: accessKey
                })
            }
        })
            .then(response => setStatus(response.data.status))
    }

    useEffect(() => {
        http_clients()
    }, [])

    useEffect(() =>{
        status && localStorage.setItem("auth_token", currClient)
    }, [status])

    return (<>
        <div className="container mt-5">
            {
                status !== null && <div class={`alert alert-${status ? 'success' : 'danger'} d-flex align-items-center" role="alert`}>
                    <div>
                        {status ? 'Authentication done.' : 'Athentication failed'}
                    </div>
                </div>
            }
            <div className="card">
                <div className="card-body">
                    <h2 className="card-title">Authentication</h2>
                    <form onSubmit={(e) => http_auth(e)}>
                        <div className="mb-3">
                            <label for="dropdown" className="form-label">Select an Option</label>
                            <select className="form-select" id="dropdown" name="dropdown" onChange={(e) => setCurrClient(e.target.value)}>
                                <option>Clients</option>
                                {
                                    clients && clients.map((c) => (
                                        <option value={c}>{c}</option>
                                    ))
                                }
                            </select>
                        </div>

                        <div className="mb-3">
                            <label for="password" className="form-label">Password</label>
                            <input type="password" onChange={(e) => setAccessKey(e.target.value)} className="form-control" id="password" name="password" placeholder="Enter your password" />
                        </div>

                        <button type="submit" className="btn btn-primary">Submit</button>
                    </form>
                </div>
            </div>
        </div>

    </>)
}

export default Auth