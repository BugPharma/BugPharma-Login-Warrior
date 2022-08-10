function Chart() {
    return (
        <div id="main">
            <div
                id="hamburger-menu"
                data-testid="hamburger-menu"
                onClick={(event) => {
                    event.stopPropagation();
                    const personalization = document.getElementById('personalization');
                    const display = personalization.style.width !== '0px';
                    if (display) {
                        personalization.style.width = '0px';
                    } else {
                        personalization.style.width = '500px';
                    }
                }}
            >
                <span></span>
                <span></span>
                <span></span>
            </div>
            <div
                id="my-dataviz"
                data-testid="my-dataviz"
            ></div>
            <div
                id="personalization"
                data-testid="personalization"
            >
                <div id="sankey-personalization" style={{display: 'none'}}>
                    <p>Modifica l'opacità:</p>
                    <div id="sankey-opacity"></div>
                </div>
                <div id="scatter-personalization" style={{display: 'none'}}>
                    <p>Modifica l'opacità:</p>
                    <div id="scatter-opacity"></div>
                    <form>
                        <p>Dal:</p>
                        <div>
                            <select id="scatter-from-year">
                                <option value="" disabled selected hidden>
                                    Anno
                                </option>
                            </select>
                            <select id="scatter-from-month">
                                <option value="" disabled selected hidden>
                                    Mese
                                </option>
                            </select>
                        </div>
                        <p>Al:</p>
                        <div>
                            <select id="scatter-to-year">
                                <option value="" disabled selected hidden>
                                    Anno
                                </option>
                            </select>
                            <select id="scatter-to-month">
                                <option value="" disabled selected hidden>
                                    Mese
                                </option>
                            </select>
                        </div>
                        <div>
                            <p>Seleziona la dimensione per il colore:</p>
                            <select id="scatter-dim-color"></select>
                        </div>
                    </form>
                </div>
                <div id="fdg-personalization" style={{display: 'none'}}>
                    <form>
                        <p>Scegli contenuto etichetta:</p>
                        <select id="fdg-label-content"></select>
                        <p>Attiva dimensioni variabili:</p>
                        <input id="fdg-variable-nodes" type="checkbox" />
                    </form>
                </div>
                <div id="pc-personalization" style={{display: 'none'}}>
                    <form>
                        <p>Scegli dimensione di bundling:</p>
                        <select id="pc-bundling-dimension"></select>
                        <p>Scegli livello di forza di bundling:</p>
                        <div id="pc-bundling-strength"></div>
                        <p>Scegli livello di curvatura delle linee:</p>
                        <div id="pc-smoothness"></div>

                        <p>Attiva modalità di colorazione statistica:</p>
                        <input id="pc-statistical-color" type="checkbox" />
                        <p>Scegli dimensione su cui effettuare la colorazione statistica:</p>
                        <select id="pc-statistical-color-dim"></select>

                        <p>Scegli il livello di opacità delle linee:</p>
                        <div id="pc-opacity"></div>

                        <p>Scegli modalità di compositing:</p>
                        <select id="pc-compositing"></select>

                        <p>Scegli il tempo di renderizzazione delle linee:</p>
                        <div id="pc-rendering-rate"></div>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default Chart;
