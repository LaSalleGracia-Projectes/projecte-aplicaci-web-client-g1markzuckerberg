import React from 'react';
import Header from './components/Header';
import Banner from './components/Banner';
import CallToAction from './components/CallToAction';
import NextRound from './components/NextRound';
import TopScorersAssists from './components/TopScorersAssists';
import Footer from './components/Footer';

function App() {
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

export default App;