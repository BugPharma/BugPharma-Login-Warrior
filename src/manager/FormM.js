import { useDispatch } from 'react-redux';
import { dimActions } from '../stores/Dimension';
import { dataActions } from '../stores/Data';
import * as d3 from 'd3';

class FormM {
    dispatch = useDispatch();
    send(text) {
        /*-----------PARSING DATA ORA-----------------*/

        var parseDate = d3.timeParse("%Y-%m-%d %H:%M:%S.%L");

        const parsed = d3.csvParse(text, (row) => {
            let date = parseDate(row.data_evento) || new Date(0);

            return {
                utente: row.utente,
                year: date.getFullYear(),
                month: date.getMonth() + 1,
                day: date.getDate(),
                hours: date.getHours(),
                minutes: date.getMinutes(),
                giorno_settimana: date.getDay(),
                is_working_day: 1 <= date.getDay() && date.getDay() <= 5,
                is_working_hours: 8 <= date.getHours() && date.getHours() <= 18,
                tipo_evento: row.tipo_evento,
                applicazione: row.applicazione,
                IP: row.IP,
            };
        });

        /*-----------FINE PARSING DATA ORA-----------------*/

        /*-----------FILTRAGGIO DATI VALIDI-----------------*/

        const filtered = parsed.filter((row) => this.isValid(row));

        /*-----------FINE FILTRAGGIO DATI VALIDI-----------------*/

        /*-----------TRASFORMAZIONE IN ARRAY-----------------*/

        const keys = Object.keys(filtered[0]);

        /*-----------FINE TRASFORMAZIONE IN ARRAY-----------------*/

        /*-----------SAMPLING DEI DATI-----------------*/

        let sample = [];
        const length = filtered.length;
        for (let i = 0; i < 1000; i++) {
            const el = filtered[this.getRandomInt(length - 1)];
            sample.push(el);
        }

        /*-----------FINE SAMPLING DEI DATI-----------------*/

        let dimension = [];
        let isSelected = [];
        let isNumeric = [];

        for (let key in sample[0]) {
            if (this.isNumeric(sample[0][key])) {
                dimension.push(key);
                isSelected.push(false);
                isNumeric.push(true);
            } else {
                dimension.push(key);
                isSelected.push(false);
                isNumeric.push(false);
            }
        }

        /*----------------INSERITO DATI NELLO STORE ------------------*/
        this.dispatch(
            dimActions.addDimension({ dimension, isSelected, isNumeric })
        );
        this.dispatch(dataActions.addData(sample));
    }

    isNumeric(number) {
        return !isNaN(number);
    }

    getRandomInt(max) {
        return Math.floor(Math.random() * max);
    }

    isValid(row) {
        const notDate = new Date(0);
        return (
            row.utente &&
            row.year !== notDate.getFullYear() &&
            row.tipo_evento &&
            row.applicazione &&
            row.IP
        );
    }
}
export default FormM;
