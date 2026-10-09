import type {Metadata} from 'next';
import '@fontsource/plus-jakarta-sans/400.css';
import '@fontsource/plus-jakarta-sans/600.css';
import '@fontsource/plus-jakarta-sans/700.css';
import './globals.css';
import {AccountProvider} from '@/components/account-provider';
export const metadata:Metadata={title:'AtosFeed · Publicações',description:'Laboratório de publicações autorizadas em grupos.'};
export default function Layout({children}:{children:React.ReactNode}){return <html lang="pt-BR"><body><a className="skip" href="#content">Pular para o conteúdo</a><AccountProvider>{children}</AccountProvider></body></html>}
