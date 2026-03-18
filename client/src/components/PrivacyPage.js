import React from 'react';
import { Link } from 'react-router-dom';
import Footer from './Footer';

function PrivacyPage({ text = {} }) {
  return (
    <div className="page-container" style={{ paddingTop: '150px', minHeight: '100vh' }}>
      
      <div style={{ maxWidth: '900px', margin: '0 auto 50px', padding: '0 20px', color: 'var(--text-color)', textAlign: 'justify' }}>
        <h1 style={{ color: 'var(--accent-color)', marginBottom: '40px', textAlign: 'center' }}>Zásady zpracování a ochrany osobních údajů (GDPR)</h1>
        
        <p style={{ opacity: 0.85, lineHeight: 1.7, marginBottom: '30px' }}>
          Tento dokument poskytuje subjektům údajů (dále jen „Uživatel“) informace o způsobu, rozsahu a účelu zpracování osobních údajů v rámci užívání webové platformy a služeb umělé inteligence JuNoMi. Zpracování osobních údajů probíhá striktně v souladu s Nařízením Evropského parlamentu a Rady (EU) 2016/679 (obecné nařízení o ochraně osobních údajů, dále jen „GDPR“) a platnou národní legislativou.
        </p>

        <h3 style={{ marginTop: '40px', marginBottom: '15px', color: 'var(--accent-color)' }}>1. Rozsah zpracovávaných osobních údajů</h3>
        <p style={{ opacity: 0.85, lineHeight: 1.7, marginBottom: '15px' }}>
          Provozovatel platformy (dále jen „Správce“) shromažďuje a zpracovává pouze ty osobní údaje, které jsou nezbytné pro poskytování služeb. Jedná se o:
        </p>
        <ul style={{ opacity: 0.85, lineHeight: 1.7, marginBottom: '20px', paddingLeft: '20px' }}>
          <li><strong>Identifikační a kontaktní údaje:</strong> e-mailová adresa, uživatelské jméno a kryptografický otisk (hash) přístupového hesla.</li>
          <li><strong>Údaje generované užíváním služby:</strong> textové vstupy (tzv. prompty) zadávané do rozhraní umělé inteligence a historie konverzací.</li>
          <li><strong>Technické a síťové údaje:</strong> IP adresa, metadata o čase a způsobu přihlášení, technické cookies nezbytné pro udržení uživatelské relace.</li>
        </ul>
        <p style={{ opacity: 0.85, lineHeight: 1.7, marginBottom: '20px', padding: '15px', backgroundColor: 'rgba(255, 77, 77, 0.1)', borderLeft: '4px solid #ff4d4d' }}>
          <strong>DŮLEŽITÉ UPOZORNĚNÍ:</strong> Uživatelům je výslovně zakázáno zadávat do chatovacího rozhraní zvláštní kategorie osobních údajů dle čl. 9 GDPR (např. údaje o zdravotním stavu, rodná čísla, biometrické údaje) či citlivé finanční informace. Správce nenese odpovědnost za zpracování takovýchto údajů, pokud je Uživatel poskytne z vlastní vůle v rozporu s tímto varováním.
        </p>

        <h3 style={{ marginTop: '40px', marginBottom: '15px', color: 'var(--accent-color)' }}>2. Účel a právní základ zpracování</h3>
        <p style={{ opacity: 0.85, lineHeight: 1.7, marginBottom: '15px' }}>
          Osobní údaje jsou zpracovávány výhradně pro následující účely a na základě těchto právních titulů:
        </p>
        <ul style={{ opacity: 0.85, lineHeight: 1.7, marginBottom: '20px', paddingLeft: '20px' }}>
          <li><strong>Plnění smlouvy (čl. 6 odst. 1 písm. b) GDPR):</strong> Založení a správa uživatelského účtu, zajištění chodu aplikace a zpřístupnění historie konverzací s AI modulem.</li>
          <li><strong>Oprávněný zájem Správce (čl. 6 odst. 1 písm. f) GDPR):</strong> Zajištění bezpečnosti sítě, prevence kybernetických útoků a nezbytná analytika chybovosti systému.</li>
          <li><strong>Souhlas subjektu údajů (čl. 6 odst. 1 písm. a) GDPR):</strong> Využití volitelných analytických a marketingových nástrojů (cookies třetích stran), který může být kdykoliv odvolán.</li>
        </ul>

        <h3 style={{ marginTop: '40px', marginBottom: '15px', color: 'var(--accent-color)' }}>3. Příjemci a sdílení osobních údajů</h3>
        <p style={{ opacity: 0.85, lineHeight: 1.7, marginBottom: '20px' }}>
          Správce neprodává osobní údaje třetím stranám. Ke zpracování údajů mohou být využiti prověření zpracovatelé (např. poskytovatelé cloudového hostingu, databází a API rozhraní jazykových modelů). Zpracovatelé jsou smluvně vázáni dodržovat odpovídající technická a organizační bezpečnostní opatření. Textové vstupy odesílané do API jazykových modelů nejsou používány k tréninku veřejných modelů třetích stran.
        </p>

        <h3 style={{ marginTop: '40px', marginBottom: '15px', color: 'var(--accent-color)' }}>4. Doba uchovávání údajů</h3>
        <p style={{ opacity: 0.85, lineHeight: 1.7, marginBottom: '20px' }}>
          Osobní údaje jsou uchovávány pouze po dobu nezbytně nutnou k naplnění účelu jejich zpracování. V případě údajů vázaných na uživatelský účet jde o dobu aktivní existence účtu. Při zrušení účtu Uživatelem jsou veškeré osobní údaje a historie konverzací trvale a nevratně odstraněny, s výjimkou provozních logů, které si Správce ponechává po zákonem stanovenou dobu z důvodu ochrany svých právních nároků.
        </p>

        <h3 style={{ marginTop: '40px', marginBottom: '15px', color: 'var(--accent-color)' }}>5. Práva subjektu údajů</h3>
        <p style={{ opacity: 0.85, lineHeight: 1.7, marginBottom: '15px' }}>
          V souladu s kapitolou III GDPR disponuje Uživatel následujícími právy:
        </p>
        <ul style={{ opacity: 0.85, lineHeight: 1.7, marginBottom: '20px', paddingLeft: '20px' }}>
          <li><strong>Právo na přístup:</strong> Právo získat potvrzení, zda jsou osobní údaje zpracovávány, a právo na kopii těchto údajů.</li>
          <li><strong>Právo na opravu:</strong> Právo na opravu nepřesných nebo doplnění neúplných osobních údajů.</li>
          <li><strong>Právo na výmaz („právo být zapomenut“):</strong> Právo požadovat bezodkladné vymazání osobních údajů, pokud již nejsou potřebné pro stanovené účely.</li>
          <li><strong>Právo na omezení zpracování:</strong> V případech sporných otázek ohledně zpracování.</li>
          <li><strong>Právo na přenositelnost údajů:</strong> Právo získat své údaje ve strukturovaném, běžně používaném a strojově čitelném formátu.</li>
          <li><strong>Právo vznést námitku:</strong> Proti zpracování založeném na oprávněném zájmu Správce.</li>
          <li><strong>Právo podat stížnost:</strong> U dozorového úřadu, kterým je v ČR Úřad pro ochranu osobních údajů (ÚOOÚ, Pplk. Sochora 27, 170 00 Praha 7).</li>
        </ul>

        <div style={{ marginTop: '60px', borderTop: '1px solid var(--border-color)', paddingTop: '30px', textAlign: 'center' }}>
          <Link to="/" style={{ color: 'var(--accent-color)', textDecoration: 'none', fontWeight: 'bold', fontSize: '1.1rem' }}>
            ← Zpět na domovskou stránku
          </Link>
        </div>
      </div>

      <Footer text={text} />
    </div>
  );
}

export default PrivacyPage;