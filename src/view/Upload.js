import React from 'react';
import Form from './dynamicComponent/Form';
import Header from './staticComponent/Header';
import HeroForm from './staticComponent/HeroForm';
import Footer from './staticComponent/Footer';
import ElaborateForm from './dynamicComponent/ElaborateForm';
import {useSelector} from 'react-redux';

function Upload() {
    const list = useSelector((state) => state.dim.dimension);
    const isNumeric = useSelector((state) => state.dim.isNumeric);
    const isSelected = useSelector((state) => state.dim.isSelected);
    const isForm = useSelector((state) => state.form.isForm);
    return (
        <div>
            <Header />
            <HeroForm />
            {isForm && <Form />}
            {!isForm && (
                <ElaborateForm list={list} isNumeric={isNumeric} isSelected={isSelected} />
            )}
            <Footer />
        </div>
    );
}

export default Upload;
