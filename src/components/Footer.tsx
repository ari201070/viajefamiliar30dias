import React from 'react';
import { useAppContext } from '../App.tsx';

const Footer: React.FC = () => {
  const { t } = useAppContext();
  return (
    <footer className="bg-slate-800 text-slate-300 text-center p-6 shadow-inner mt-auto">
      <p>&copy; {new Date().getFullYear()} {t('footerText')}</p>
    </footer>
  );
};

export default Footer;