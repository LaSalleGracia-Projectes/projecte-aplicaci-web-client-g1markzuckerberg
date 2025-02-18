import Header from './components/Header';
import Banner from './components/Banner';
import CallToAction from './components/CallToAction';
import NextRound from './components/NextRound';
import TopScorersAssists from './components/TopScorersAssists';
import Footer from './components/Footer';

export default function Home() {
    return (
        <div>
            <Header />
            <Banner />
            <CallToAction />
            <NextRound />
            <TopScorersAssists />
            <Footer />
        </div>
    );
}