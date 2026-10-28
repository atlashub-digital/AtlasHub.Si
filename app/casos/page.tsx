import type { Metadata } from "next";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import Areas from "../../components/Areas";
import Cases from "../../components/Cases";
export const metadata: Metadata={title:"Casos de aplicação",description:"Cenários demonstrativos de agentes, processos, integração e supervisão empresarial. Sem resultados de clientes não comprovados.",alternates:{canonical:"/casos"}};
export default function CasePage(){return <><Header/><main id="conteudo"><section className="atlas-generic-hero"><div className="atlas-container"><p className="arch-eyebrow">CASOS DE APLICAÇÃO · CENÁRIOS DIDÁTICOS</p><h1>Problemas reais. <em>Soluções a validar.</em></h1><p>Explore possibilidades de implementação por setor, com fontes, controles humanos, pré-requisitos e métricas. Os cenários não são testemunhos de clientes nem resultados auditados.</p></div></section><Areas/><Cases/></main><Footer/></>}
