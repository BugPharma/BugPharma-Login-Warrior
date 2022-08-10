import React from 'react';
import Header from './staticComponent/Header';
import Chart from './chartComponent/ChartComponent';
import HeroForm from './staticComponent/HeroForm';
import Footer from './staticComponent/Footer';

function Plot() {
    return (
        <div>
            <Header />
            <HeroForm />
            <Chart />
            <Footer />
        </div>
    );
}

export default Plot;