import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import FrancophonieLeadForm from "../../components/FrancophonieLeadForm";
import styles from "./francophonie.module.css";

export const metadata: Metadata = {
  title: "IA agentique pour entreprises et professionnels francophones",
  description: "AtlasHub Francophonie : ateliers en français, appel de qualification et diagnostic opérationnel pour structurer vos premiers agents IA, avec contrôle humain.",
  alternates: { canonical: "/fr", languages: { "fr-FR": "/fr", "pt-BR": "/" } },
  openGraph: {
    type: "website", locale: "fr_FR", url: "/fr", siteName: "AtlasHub.SI",
    title: "AtlasHub Francophonie — L’entreprise augmentée",
    description: "Formation, qualification et intégration d’IA agentique, en français et avec supervision humaine.",
  },
};

const opportunities = [
  { num: "01", title: "Relation client", text: "Qualifier les demandes entrantes, préparer les réponses et transmettre les cas complexes à votre équipe." },
  { num: "02", title: "Commerce & e-commerce", text: "Rapprocher catalogues, commandes et informations de stock sans déléguer les transactions critiques à un modèle." },
  { num: "03", title: "Services & back-office", text: "Organiser documents, relances et tâches administratives avec des sources vérifiées et des permissions limitées." },
  { num: "04", title: "Créateurs & indépendants", text: "Structurer les contenus, les demandes et les parcours clients sans perdre la voix de votre marque." },
];
const principles = [
  { label: "01", title: "Observer", text: "Comprendre une opération réelle, ses responsabilités et ses données." },
  { label: "02", title: "Dessiner", text: "Établir le plan des processus, outils, agents et validations humaines." },
  { label: "03", title: "Tester", text: "Construire un premier essai limité et mesurer ce qui fonctionne." },
  { label: "04", title: "Déployer", text: "Intégrer progressivement, documenter, superviser et améliorer." },
];
const faq = [
  { question: "Faut-il savoir programmer pour participer à un atelier ?", answer: "Non pour un atelier d’initiation. Nous commençons par les processus, les sources d’information et les missions avant d’aborder les démonstrations techniques." },
  { question: "L’appel de qualification est-il un diagnostic complet ?", answer: "Non. Cet échange exploratoire de 20 minutes est gratuit et sert à comprendre votre besoin. Le diagnostic détaillé, avec livrable, constitue une prestation distincte." },
  { question: "Puis-je venir de Belgique, de Suisse ou du Québec ?", answer: "Oui. Les échanges et ateliers sont conçus en français et à distance. Les dates, horaires, devis, taxes et conditions de vente sont confirmés pour votre pays avant engagement." },
  { question: "Les tarifs affichés permettent-ils de payer immédiatement ?", answer: "Non. Les tarifs de l’atelier et du diagnostic sont des références de lancement en cours de validation. Aucune place ou prestation n’est confirmée avant accord écrit et moyen de paiement autorisé." },
  { question: "AtlasHub peut-elle agir directement dans mes systèmes ?", answer: "Une intégration ne commence qu’après définition des permissions, tests, responsabilités, contrat et validation. Les premières démonstrations utilisent des données fictives et une supervision humaine." },
];

export default async function FrancophoniePage({ searchParams }: { searchParams: Promise<{ offre?: string }> }) {
  const params = await searchParams;
  const initialInterest = ([ "qualification", "atelier", "diagnostic", "integration" ].includes(params.offre ?? "")
    ? params.offre : "qualification") as "qualification" | "atelier" | "diagnostic" | "integration";
  return (
    <main className={styles.page} lang="fr" id="haut">
      <a className={styles.skip} href="#contenu">Aller au contenu</a>
      <header className={styles.header}>
        <Link className={styles.brand} href="/" aria-label="AtlasHub.SI — accueil">
          <Image src="/assets/atlashub-logo.webp" alt="" width={42} height={42} />
          <span><strong>ATLASHUB<span>.SI</span></strong><small>FRANCOPHONIE</small></span>
        </Link>
        <nav aria-label="Navigation francophone">
          <a href="#approche">Notre méthode</a>
          <a href="#offres">Offres & tarifs</a>
          <a href="#qualification">Parlons de votre projet</a>
          <Link className={styles.lang} href="/" lang="pt-BR" aria-label="Version portugaise">PT</Link>
        </nav>
      </header>

      <div id="contenu">
        <section className={styles.hero} aria-labelledby="fr-hero-title">
          <div className={styles.wrap}>
            <div className={styles.heroGrid}>
              <div className={styles.heroText}>
                <p className={styles.eyebrow}>ATLAS HUB FRANCOPHONIE · L’ENTREPRISE AUGMENTÉE</p>
                <h1 id="fr-hero-title">Votre entreprise n’a pas besoin d’un chatbot de plus. <em>Elle a besoin d’une architecture intelligente.</em></h1>
                <p className={styles.heroLead}>Transformez vos processus en opérations mieux organisées, avec des agents IA spécialisés, des données fiables et des décisions toujours maîtrisées.</p>
                <div className={styles.actions}>
                  <a href="#qualification" className={styles.primary}>Demander un appel de qualification <span aria-hidden="true">↗</span></a>
                  <a href="#offres" className={styles.secondary}>Découvrir nos ateliers <span aria-hidden="true">↘</span></a>
                </div>
                <p className={styles.micro}>Échanges en français · À distance · France, Belgique, Suisse, Québec et autres territoires francophones</p>
              </div>
              <div className={styles.visual} aria-label="Schéma illustratif : les données et outils sont reliés à des agents et à la supervision humaine">
                <div className={styles.visualTop}><span>ATLAS OPERATIONAL BLUEPRINT</span><span className={styles.status}>CONTRÔLE HUMAIN</span></div>
                <div className={styles.orbit}>
                  <div className={styles.nodeOne}><small>01</small><strong>PROCESSUS</strong><span>Besoins & étapes</span></div>
                  <div className={styles.nodeTwo}><small>02</small><strong>DONNÉES</strong><span>Sources fiables</span></div>
                  <div className={styles.central}><span className={styles.centralIcon}>A</span><strong>ENTREPRISE AUGMENTÉE</strong><small>Personnes · Systèmes · Agents</small></div>
                  <div className={styles.nodeThree}><small>03</small><strong>AGENTS IA</strong><span>Missions définies</span></div>
                  <div className={styles.nodeFour}><small>04</small><strong>VALIDATION</strong><span>Décisions humaines</span></div>
                </div>
                <div className={styles.visualBottom}>Observer <span>→</span> Concevoir <span>→</span> Tester <span>→</span> Superviser</div>
              </div>
            </div>
          </div>
        </section>

        <section id="approche" className={styles.section} aria-labelledby="fr-method">
          <div className={styles.wrap}>
            <div className={styles.sectionHeading}><p className={styles.eyebrow}>UNE APPROCHE OPÉRATIONNELLE</p><h2 id="fr-method">De l’idée à une <em>mission utile.</em></h2><p>Nous ne commençons pas par choisir un modèle. Nous commençons par comprendre le travail à accomplir, les risques et les responsabilités.</p></div>
            <div className={styles.steps}>{principles.map(p=><article key={p.label}><span>{p.label}</span><h3>{p.title}</h3><p>{p.text}</p></article>)}</div>
          </div>
        </section>

        <section className={styles.sectionAlt} aria-labelledby="fr-cases">
          <div className={styles.wrap}>
            <div className={styles.sectionHeading}><p className={styles.eyebrow}>EXEMPLES D’APPLICATION</p><h2 id="fr-cases">À chaque activité, <em>une architecture adaptée.</em></h2><p>Des scénarios de travail pour identifier un premier processus pertinent. Les exemples sont pédagogiques, pas des performances de clients démontrées.</p></div>
            <div className={styles.cases}>{opportunities.map(x=><article key={x.num}><span className={styles.caseNumber}>{x.num}</span><h3>{x.title}</h3><p>{x.text}</p><span className={styles.caseTag}>Analyse · Proposition · Validation</span></article>)}</div>
          </div>
        </section>

        <section className={styles.section} id="offres" aria-labelledby="fr-offers">
          <div className={styles.wrap}>
            <div className={styles.sectionHeading}><p className={styles.eyebrow}>CHOISISSEZ VOTRE POINT DE DÉPART</p><h2 id="fr-offers">Apprendre, qualifier, <em>construire.</em></h2><p>Des formats distincts selon votre maturité. Les tarifs pilotes ci-dessous sont indicatifs : conditions finales et fiscalité seront confirmées avant toute inscription ou prestation.</p></div>
            <div className={styles.offers}>
              <article className={styles.offer}><p className={styles.offerType}>APPRENDRE</p><h3>Atelier IA agentique</h3><div className={styles.price}>79 € <small>tarif pilote envisagé</small></div><p>Un atelier en français pour comprendre vos premières missions d’agents IA et dessiner un blueprint supervisé.</p><ul><li>Processus et données</li><li>Première mission et limites</li><li>Exemples et supports pratiques</li></ul><Link href="/fr?offre=atelier#qualification" className={styles.outlineAction}>Recevoir les dates <span>↗</span></Link></article>
              <article className={styles.offerFeatured}><p className={styles.offerType}>ÉCHANGER</p><h3>Appel de qualification</h3><div className={styles.price}>Gratuit <small>20 minutes · sur confirmation</small></div><p>Décrivons votre besoin et vérifions ensemble si un atelier, un diagnostic ou un projet d’intégration est adapté.</p><ul><li>Contexte et priorités</li><li>Premiers critères de faisabilité</li><li>Orientation vers la suite utile</li></ul><Link href="/fr?offre=qualification#qualification" className={styles.goldAction}>Demander un échange <span>↗</span></Link></article>
              <article className={styles.offer}><p className={styles.offerType}>STRUCTURER</p><h3>Diagnostic opérationnel</h3><div className={styles.price}>390 € <small>référence à confirmer</small></div><p>Analyse ciblée d’un processus, hypothèses d’amélioration, schéma TO-BE et plan d’un premier pilote.</p><ul><li>Entretien de cadrage</li><li>Carte du processus et priorités</li><li>Restitution et feuille de route</li></ul><Link href="/fr?offre=diagnostic#qualification" className={styles.outlineAction}>Étudier mon besoin <span>↗</span></Link></article>
            </div>
            <div className={styles.custom}><div><strong>Intégration sur mesure</strong><p>Agents, workflows, raccordement aux systèmes et accompagnement de vos équipes. Périmètre et prix définis par devis.</p></div><a href="/fr?offre=integration#qualification">Demander un cadrage <span aria-hidden="true">↗</span></a></div>
          </div>
        </section>

        <section id="qualification" className={styles.leadSection} aria-labelledby="fr-leads">
          <div className={styles.wrap}>
            <div className={styles.leadGrid}>
              <div>
                <p className={styles.eyebrow}>COMMENÇONS PAR VOTRE RÉALITÉ</p>
                <h2 id="fr-leads">Parlons de <em>votre prochain pas.</em></h2>
                <p>Formation, qualification ou intégration : partagez votre contexte sans transmettre de documents confidentiels. Un membre de l’équipe examinera votre demande.</p>
                <div className={styles.leadSteps}><span>01 · Votre objectif</span><span>02 · Votre contexte</span><span>03 · Retour humain</span></div>
                <p className={styles.privacySmall}>Une demande n’est ni une réservation automatique ni une inscription payée. Les disponibilités sont confirmées individuellement.</p>
              </div>
              {process.env.FR_LEAD_ENABLED === "true"
                ? <FrancophonieLeadForm initialInterest={initialInterest} />
                : <div className={styles.form}>
                    <div className={styles.formHeading}>
                      <span>CONTACT DIRECT · FRANCOPHONIE</span>
                      <strong>Échangeons sur votre projet</strong>
                    </div>
                    <p>Notre formulaire de qualification est en cours de configuration. Pour recevoir les dates de nos ateliers ou demander un échange, contactez directement l’équipe AtlasHub sur WhatsApp.</p>
                    <p>Nous répondons en français. Votre message ne constitue pas une réservation, une inscription ou un achat.</p>
                    <a className={styles.goldAction} style={{ textAlign: "center" }} href={"https://wa.me/5562991903462?text=" + encodeURIComponent("Bonjour AtlasHub, je vous contacte depuis atlashub.si/fr. Je souhaite en savoir plus sur " + ({ atelier: "l'atelier d'IA agentique", diagnostic: "le diagnostic opérationnel", integration: "un projet d'intégration d'agents IA", qualification: "un appel de qualification" } as Record<string, string>)[initialInterest] + ". Pouvez-vous me répondre en français ?")} target="_blank" rel="noopener noreferrer">Contacter AtlasHub sur WhatsApp ↗</a>
                    <p className={styles.formNote}>Merci de ne pas transmettre de données sensibles, de mots de passe ou de documents confidentiels.</p>
                  </div>
              }
            </div>
          </div>
        </section>

        <section className={styles.section} aria-labelledby="fr-faq"><div className={styles.wrap}>
          <div className={styles.sectionHeading}><p className={styles.eyebrow}>QUESTIONS FRÉQUENTES</p><h2 id="fr-faq">Les réponses <em>avant d’avancer.</em></h2></div>
          <div className={styles.faq}>{faq.map(item=><details key={item.question}><summary>{item.question}</summary><p>{item.answer}</p></details>)}</div>
        </div></section>

        <section className={styles.privacy} id="confidentialite" aria-labelledby="fr-privacy"><div className={styles.wrap}><h2 id="fr-privacy">Vos informations, notre responsabilité</h2><p>Les informations que vous transmettez servent à qualifier votre demande et à organiser une réponse de l’équipe AtlasHub. La réception et le traitement dépendent de la configuration du service de contact. Les messages de prospection sont facultatifs et font l’objet d’un choix séparé. Pour toute demande concernant vos données, contactez l’équipe par le canal officiel indiqué ci-dessous. Avant lancement commercial, les mentions légales détaillées, la durée de conservation et les éventuels transferts internationaux devront être validés.</p></div></section>
      </div>

      <footer className={styles.footer}><div className={styles.wrap}><div><strong>ATLASHUB.SI <span>· FRANCOPHONIE</span></strong><p>Architecture d’IA agentique, formation et opérations augmentées.</p></div><nav aria-label="Pied de page"><a href="#confidentialite">Confidentialité</a><a href="https://wa.me/5562991903462" target="_blank" rel="noopener noreferrer">WhatsApp officiel</a><Link href="/">Site en portugais</Link></nav></div></footer>
    </main>
  );
}
