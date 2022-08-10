import logo from './../../images/logo.png';

function Footer() {
    return (
        <footer className="footer mt-2" data-testid="footer">
            <div className="grid" data-testid="grid">
                <div className="col">
                    <div className="logo logo__footer" data-testid="img_logo">
                        <img src={logo} alt="" />
                    </div>
                </div>
                <div className="col">
                    <h4 className="tw" data-testid="nome_PIVA">P.IVA</h4>
                    <p className="tw" data-testid="numero_PIVA">05006900962</p>
                </div>
                <div className="col">
                    <h4 className="tw" data-testid="nome_sede">Sede</h4>
                    <p className="tw" data-testid="sede">Via Solferino, 1, 26900 Lodi LO</p>
                </div>
                <div className="col">
                    <h4 className="tw" data-testid="nome_PEC">PEC</h4>
                    <p className="tw" data-testid="PEC">zucchettispa@gruppozucchetti.it</p>
                </div>
            </div>
        </footer>
    );
}

export default Footer;