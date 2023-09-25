'use client'
import React from 'react';

import { Divider, Portal } from '@chakra-ui/react';
import CookiePref from './CookiesPref';
import HeroSection from './HeroSection';
import FeaturesSection from './FeaturesSection';
import PricingSection from './PricingSection';
import Testimonials from './Testimonials';
import Footer from '../Footer/Footer';




const IndexPage = ({ data }) => {
    const { pricing, features } = data;

    const [showCookiePref, setShowCookiePref] = React.useState(false);

    React.useEffect(() => {
        try {
            if (!localStorage.getItem('cookiesReported')) {
                setShowCookiePref(true)
            }
        } catch (error) {
            console.error(error)
        }
    }, [])


    return (
        <React.Fragment>
            <HeroSection />
            <FeaturesSection features={features.dataArray} />
            <Divider my={12} />
            <PricingSection pricing={pricing.dataArray} />
            <Divider my={12} />
            <Testimonials />
            <Footer />
            <Portal>
                <CookiePref isOpen={showCookiePref} setIsOpen={setShowCookiePref} />
            </Portal>
        </React.Fragment >
    );
};

export default IndexPage;