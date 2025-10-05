import React, { FC } from 'react';
import { useAppContext } from '../context/AppContext.ts';

const Footer: FC = () => {
    const { t } = useAppContext();
    return (
        <footer className="bg-white dark:bg-slate-800 shadow-inner mt-12">
            <div className="container mx-auto py-6 px-4 sm:px-6 lg:px-8 text-center text-gray-500 dark:text-gray-400">
                <p>&copy; {new Date().getFullYear()} {t('footerText')}</p>
            </div>
        </footer>
    );
};

export default Footer;