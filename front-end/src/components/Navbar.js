import { Route, Routes, Link } from "react-router-dom"

function Navbar() {
    return (<>
        <nav class="navbar navbar-expand-lg bg-body-tertiary">
            <div class="container-fluid">
                <Link class="navbar-brand" to="/">Bill Desk</Link>
                <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                    <span class="navbar-toggler-icon"></span>
                </button>
                <div class="collapse navbar-collapse" id="navbarNav">
                    <ul class="navbar-nav">
                        <li class="nav-item">
                            <Link class="nav-link active" aria-current="page" to="/auth">Auth</Link>
                        </li>
                        <li class="nav-item">
                            <Link class="nav-link" to="/product">Product</Link>
                        </li>
                        <li class="nav-item">
                            <Link class="nav-link" to="/admin">Admin</Link>
                        </li>
                    </ul>
                </div>
            </div>
        </nav>
    </>)
}

export default Navbar