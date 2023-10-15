'use client'
import React from 'react';

import { Divider, Portal } from '@chakra-ui/react';
import CookiePref from '@/src/components/IndexPageComponents/CookiesPref';
import HeroSection from '@/src/components/IndexPageComponents/HeroSection';
import FeaturesSection from '@/src/components/IndexPageComponents/FeaturesSection';
import PricingSection from '@/src/components/IndexPageComponents/PricingSection';
import Testimonials from '@/src/components/IndexPageComponents/Testimonials';
import Footer from '@/src/components/PagesFooter/Footer';

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
            <FeaturesSection features={features ? features.dataArray : []} />
            <Divider my={12} />
            <PricingSection pricing={pricing ? pricing.dataArray : []} />
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