import { useSelector } from "react-redux";

class GraphM {
    constructor(data) {
        this.data = data;
        if (new.target === GraphM) {
            //la rende stratta
            throw new Error('non instanziabile, classe astratta');
        }
    }
    dim = useSelector((state) => state.dim.dimension);
    isSelected = useSelector((state) => state.dim.isSelected);

    //estrae le dimensioni selezionate
    takeCord(index) {
        for (let i = 0; i < this.dim.length; i++) {
            if (this.isSelected[i]) {
                if (!index) {
                    return { cord: this.dim[i], index: i };
                } else {
                    index -= 1;
                }
            }
        }
    }

    dimensionNumber() {
        /*ritorna il numero delle dimensioni selelzionate dall'utente*/
        return this.isSelected.filter((s) => s).length;
    }
}

export default GraphM;
