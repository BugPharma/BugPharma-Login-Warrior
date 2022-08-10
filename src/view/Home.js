import Footer from './staticComponent/Footer';
import Header from './staticComponent/Header';
import Hero from './staticComponent/Hero';
import CompanyInfo from './staticComponent/CompanyInfo';
import ChartInfo from './staticComponent/ChartInfo';

function Home() {
    return (
        <div>
            <Header />
            <Hero />
            <CompanyInfo />
            <ChartInfo />
            <Footer />
        </div>
    );
}

export default Home;