import Link from 'next/link';
import {ExtensionInstall} from '@/components/extension-install';
export default function ExtensionPage(){return <main className="auth-page"><section className="auth-box"><p className="brand">Atos<span>Feed</span></p><ExtensionInstall/><Link href="/">Voltar ao painel</Link></section></main>;}
