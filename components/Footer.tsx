import React from 'react';
import { SuiLogo } from './icons';

const Footer: React.FC = () => {
    return (
        <footer className="bg-surface-dark/50 border-t border-border py-8 sm:py-12">
            <div className="container mx-auto px-6 text-center text-secondary">
                <div className="flex justify-center items-center gap-2 text-xl sm:text-2xl font-bold text-primary mb-4">
                    <SuiLogo className="w-5 sm:w-6 h-5 sm:h-6 text-accent-soft"/>
                    <span className="text-xl sm:text-2xl md:text-2xl font-bold font-heading text-primary uppercase">LEGENDS</span>
                </div>
                <p style={{  fontFamily: "helvetica" }} className="text-sm sm:text-base">Where Deeds Earn Eternal Glory on the Sui Blockchain.</p>
                <p style={{  fontFamily: "helvetica" }} className="mt-4 text-xs sm:text-sm">&copy; {new Date().getFullYear()} Legends. All rights reserved.</p>
            </div>
        </footer>
    );
};

export default Footer;