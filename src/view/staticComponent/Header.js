import logo from './../../images/logo.png';
import {Link} from 'react-router-dom';

function Header() {
    return (
        <div data-testid="header" className="header">
            <div className="logo">
                <img src={logo} alt="" />
            </div>
            <ul className="menu">
                <li><Link to="/">Home</Link></li>
                <li><Link to="/upload">Inserisci CSV</Link></li>
            </ul>
            <div className="hamburger">
                <span></span><span></span><span></span>
            </div>
        </div>
    );
}

export default Header;