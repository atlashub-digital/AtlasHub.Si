import Image from "next/image";
export default function Areas() {
  return (
    <section className="band" id="areas">
      <div className="section">
        <p className="eyebrow">ÁREAS DE ATUAÇÃO</p>
        <h2>
          O contexto muda.
          <br />
          <span>A operação continua no centro.</span>
        </h2>
        <p className="intro">
          Casos de estudo e possibilidades de aplicação: do pedido de um cliente
          à gestão de fornecedores, descubra onde ligar pessoas, dados e agentes
          inteligentes na sua operação.
        </p>
        <div className="areas">
          <article className="area">
            <Image
              src="/assets/case-retail.jpg"
              alt=""
              loading="lazy"
              width={640}
              height={440}
            />
            <div>
              <span className="area-index">01 · APLICAÇÕES POR SETOR</span>
              <h3>Comércio & Farmácia</h3>
              <p className="area-description">
                Da disponibilidade em loja ao acompanhamento do cliente.
              </p>
              <ul className="area-examples">
                <li>
                  <strong>Antecipar ruturas</strong>
                  <p>
                    Cruzar stock e vendas para sinalizar produtos em falta e
                    preparar propostas de reposição.
                  </p>
                </li>
                <li>
                  <strong>Compras com contexto</strong>
                  <p>
                    Comparar condições de fornecedores e reunir informação para
                    aprovação de encomendas.
                  </p>
                </li>
                <li>
                  <strong>Atendimento consistente</strong>
                  <p>
                    Consultar o catálogo e responder sobre disponibilidade e
                    serviços, encaminhando questões clínicas para profissionais.
                  </p>
                </li>
              </ul>
              <p className="area-systems">
                <span>Fontes a ligar</span>ERP / POS · Catálogo · Fornecedores
              </p>
              <a className="text-link" href="#caso-retail">
                Ver o caso de aplicação <span aria-hidden="true">↗</span>
              </a>
            </div>
          </article>
          <article className="area">
            <Image
              src="/assets/case-industry.jpg"
              alt=""
              loading="lazy"
              width={640}
              height={440}
            />
            <div>
              <span className="area-index">02 · APLICAÇÕES POR SETOR</span>
              <h3>Indústria & Cadeia de abastecimento</h3>
              <p className="area-description">
                Mais visibilidade sobre encomendas, entregas e ocorrências.
              </p>
              <ul className="area-examples">
                <li>
                  <strong>Atrasos de fornecedores</strong>
                  <p>
                    Ler alterações recebidas por email, relacionar encomendas e
                    alertar os responsáveis pelo planeamento.
                  </p>
                </li>
                <li>
                  <strong>Exceções na logística</strong>
                  <p>
                    Reunir o estado das entregas e preparar pedidos de
                    atualização quando existe um desvio.
                  </p>
                </li>
                <li>
                  <strong>Ocorrências de manutenção</strong>
                  <p>
                    Classificar relatos, reunir o histórico e criar tarefas para
                    validação da equipa técnica.
                  </p>
                </li>
              </ul>
              <p className="area-systems">
                <span>Fontes a ligar</span>ERP · Encomendas · Registos de
                ocorrências
              </p>
              <a className="text-link" href="#caso-industry">
                Ver o caso de aplicação <span aria-hidden="true">↗</span>
              </a>
            </div>
          </article>
          <article className="area">
            <Image
              src="/assets/case-realestate.jpg"
              alt=""
              loading="lazy"
              width={640}
              height={440}
            />
            <div>
              <span className="area-index">03 · APLICAÇÕES POR SETOR</span>
              <h3>Imobiliário</h3>
              <p className="area-description">
                Do primeiro pedido ao acompanhamento de cada oportunidade.
              </p>
              <ul className="area-examples">
                <li>
                  <strong>Qualificação da procura</strong>
                  <p>
                    Recolher localização, orçamento e preferências declaradas
                    para sugerir imóveis do catálogo disponível.
                  </p>
                </li>
                <li>
                  <strong>Preparação de visitas</strong>
                  <p>
                    Recolher a janela preferida e pedir confirmação de
                    disponibilidade ao consultor.
                  </p>
                </li>
                <li>
                  <strong>Acompanhamento comercial</strong>
                  <p>
                    Resumir conversas, preparar respostas e propor tarefas de
                    seguimento no CRM.
                  </p>
                </li>
              </ul>
              <p className="area-systems">
                <span>Fontes a ligar</span>Catálogo · CRM · Disponibilidade da
                equipa
              </p>
              <a className="text-link" href="#caso-realestate">
                Ver o caso de aplicação <span aria-hidden="true">↗</span>
              </a>
            </div>
          </article>
          <article className="area">
            <Image
              src="/assets/case-healthcare.jpg"
              alt=""
              loading="lazy"
              width={640}
              height={440}
            />
            <div>
              <span className="area-index">04 · APLICAÇÕES POR SETOR</span>
              <h3>Serviços & Saúde</h3>
              <p className="area-description">
                Libertar tempo das equipas na operação administrativa.
              </p>
              <ul className="area-examples">
                <li>
                  <strong>Pedidos de marcação</strong>
                  <p>
                    Identificar o serviço pretendido e recolher preferências de
                    horário para confirmação pela equipa.
                  </p>
                </li>
                <li>
                  <strong>Cancelamentos e lembretes</strong>
                  <p>
                    Preparar alternativas de remarcação e lembretes autorizados,
                    de acordo com as regras do serviço.
                  </p>
                </li>
                <li>
                  <strong>Documentação administrativa</strong>
                  <p>
                    Organizar formulários e sinalizar campos em falta, com
                    acessos definidos e separação dos dados clínicos.
                  </p>
                </li>
              </ul>
              <p className="area-systems">
                <span>Fontes a ligar</span>Agenda · Regras do serviço ·
                Permissões
              </p>
              <a className="text-link" href="#caso-healthcare">
                Ver o caso de aplicação <span aria-hidden="true">↗</span>
              </a>
            </div>
          </article>
        </div>
        <div className="cross-sector">
          <p className="eyebrow">EM TODOS OS SETORES</p>
          <h3>Processos comuns. Aplicações à sua medida.</h3>
          <div className="cross-sector-grid">
            <a href="#caso-sales">
              <h4>
                Comercial<span aria-hidden="true">↗</span>
              </h4>
              <p>
                Qualificar pedidos, preparar oportunidades no CRM e acompanhar
                propostas.
              </p>
            </a>
            <a href="#caso-support">
              <h4>
                Atendimento<span aria-hidden="true">↗</span>
              </h4>
              <p>
                Pesquisar respostas em documentação aprovada e encaminhar
                exceções.
              </p>
            </a>
            <a href="#caso-documents">
              <h4>
                Backoffice<span aria-hidden="true">↗</span>
              </h4>
              <p>
                Extrair dados de faturas, comparar registos e sinalizar
                divergências.
              </p>
            </a>
            <a href="#caso-operations">
              <h4>
                Gestão & Operações<span aria-hidden="true">↗</span>
              </h4>
              <p>
                Reunir indicadores, resumir desvios e preparar tarefas para os
                responsáveis.
              </p>
            </a>
          </div>
        </div>
        <p className="area-footnote">
          Cada projeto começa pela análise do processo e dos sistemas
          disponíveis. A equipa define as regras, aprova compromissos e
          acompanha as exceções.
        </p>
      </div>
    </section>
  );
}
