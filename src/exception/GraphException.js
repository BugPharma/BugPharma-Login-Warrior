class GraphException extends Error {
    constructor(message, selectedDims, expectedDims) {
        super(message);
        this.selectedDims = selectedDims;
        this.expectedDims = expectedDims;
    }
    messageDim() {
        if (this.selectedDims < this.expectedDims) {
            const remainingDims = this.expectedDims - this.selectedDims;
            const text = remainingDims === 1 ? 'dimensione mancante' : 'dimensioni mancanti';
            return `, selezionare ${remainingDims} ${text}`;
        }
        else {
            const excessDims = this.selectedDims - this.expectedDims;
            const text = excessDims == 1 ? 'dimensione' : 'dimensioni';
            return `, deselezionare ${excessDims} ${text}`;
        }
    }
}

export default GraphException;