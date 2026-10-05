import CaseButton from "./CaseButton";
export default function Cases() {
  return (
    <section className="section" id="casos">
      <p className="eyebrow">DA POSSIBILIDADE AO PROJETO</p>
      <h2>
        Um problema concreto.
        <br />
        <span>Uma automação com propósito.</span>
      </h2>
      <p className="intro">
        Explore cenários de implementação, os sistemas necessários e o papel da
        equipa em cada decisão.
      </p>
      <div className="case-library">
        <details className="study" id="caso-sales">
          <summary>
            <span>Comercial</span>
            <h3>Do primeiro contacto à oportunidade</h3>
            <b aria-hidden="true">+</b>
          </summary>
          <div className="study-body">
            <p>
              <strong>O que inicia:</strong> Pedido no site, email ou WhatsApp.
            </p>
            <p>
              <strong>O agente:</strong> Identificar intenção, resumir a
              necessidade e sugerir o próximo passo.
            </p>
            <p>
              <strong>A automação:</strong> Criar oportunidade no CRM e preparar
              resposta.
            </p>
            <p>
              <strong>Controlo humano:</strong> A equipa aprova propostas e
              compromissos comerciais.
            </p>
            <p>
              <strong>Pré-requisitos:</strong> CRM com API, catálogo de serviços
              e regras de encaminhamento.
            </p>
            <p>
              <strong>Como medir:</strong> Tempo de primeira resposta e
              oportunidades qualificadas.
            </p>
            <CaseButton scenario="sales">Explorar com a Clara →</CaseButton>
          </div>
        </details>
        <details className="study" id="caso-support">
          <summary>
            <span>Atendimento</span>
            <h3>Respostas com contexto, exceções com pessoas</h3>
            <b aria-hidden="true">+</b>
          </summary>
          <div className="study-body">
            <p>
              <strong>O que inicia:</strong> Nova questão de um cliente.
            </p>
            <p>
              <strong>O agente:</strong> Pesquisar documentação autorizada e
              preparar uma resposta com fontes.
            </p>
            <p>
              <strong>A automação:</strong> Abrir ou atualizar ticket e
              encaminhar para a equipa certa.
            </p>
            <p>
              <strong>Controlo humano:</strong> Dúvidas sem fonte, reclamações e
              dados sensíveis seguem para uma pessoa.
            </p>
            <p>
              <strong>Pré-requisitos:</strong> Base de conhecimento atualizada,
              permissões e helpdesk.
            </p>
            <p>
              <strong>Como medir:</strong> Resolução no primeiro contacto e taxa
              de encaminhamento.
            </p>
            <CaseButton scenario="support">Explorar com a Clara →</CaseButton>
          </div>
        </details>
        <details className="study" id="caso-retail">
          <summary>
            <span>Retail & Pharmacy</span>
            <h3>Antecipar ruturas e preparar reposição</h3>
            <b aria-hidden="true">+</b>
          </summary>
          <div className="study-body">
            <p>
              <strong>O que inicia:</strong> Atualização de stock ou revisão
              diária.
            </p>
            <p>
              <strong>O agente:</strong> Explicar anomalias e reunir contexto de
              vendas e fornecedores.
            </p>
            <p>
              <strong>A automação:</strong> Gerar alerta e rascunho de
              reposição.
            </p>
            <p>
              <strong>Controlo humano:</strong> Compras e alterações de preço
              exigem aprovação; sem aconselhamento clínico.
            </p>
            <p>
              <strong>Pré-requisitos:</strong> ERP/POS acessível, dados de stock
              e regras de reposição.
            </p>
            <p>
              <strong>Como medir:</strong> Ruturas, tempo de análise e precisão
              dos alertas.
            </p>
            <CaseButton scenario="retail">Explorar com a Clara →</CaseButton>
          </div>
        </details>
        <details className="study" id="caso-industry">
          <summary>
            <span>Industry & Supply Chain</span>
            <h3>Transformar atrasos em ações coordenadas</h3>
            <b aria-hidden="true">+</b>
          </summary>
          <div className="study-body">
            <p>
              <strong>O que inicia:</strong> Email de fornecedor ou alteração de
              entrega.
            </p>
            <p>
              <strong>O agente:</strong> Extrair datas, identificar encomendas e
              resumir impacto.
            </p>
            <p>
              <strong>A automação:</strong> Atualizar ocorrência e avisar
              responsáveis.
            </p>
            <p>
              <strong>Controlo humano:</strong> A equipa valida datas incertas e
              mudanças de planeamento.
            </p>
            <p>
              <strong>Pré-requisitos:</strong> Encomendas com identificadores,
              ERP e canal de notificações.
            </p>
            <p>
              <strong>Como medir:</strong> Tempo de deteção e resolução de
              exceções.
            </p>
            <CaseButton scenario="industry">Explorar com a Clara →</CaseButton>
          </div>
        </details>
        <details className="study" id="caso-realestate">
          <summary>
            <span>Real Estate</span>
            <h3>Qualificar procura e preparar visitas</h3>
            <b aria-hidden="true">+</b>
          </summary>
          <div className="study-body">
            <p>
              <strong>O que inicia:</strong> Pedido sobre um imóvel.
            </p>
            <p>
              <strong>O agente:</strong> Relacionar preferências declaradas com
              imóveis disponíveis.
            </p>
            <p>
              <strong>A automação:</strong> Registar lead e propor horários
              disponíveis.
            </p>
            <p>
              <strong>Controlo humano:</strong> Visita só é confirmada após
              disponibilidade e aceitação; sem decisões de crédito.
            </p>
            <p>
              <strong>Pré-requisitos:</strong> Catálogo atualizado, CRM e agenda
              com API.
            </p>
            <p>
              <strong>Como medir:</strong> Tempo de resposta e visitas
              confirmadas.
            </p>
            <CaseButton scenario="realestate">
              Explorar com a Clara →
            </CaseButton>
          </div>
        </details>
        <details className="study" id="caso-healthcare">
          <summary>
            <span>Services & Healthcare</span>
            <h3>Recuperar tempo na gestão de agendas</h3>
            <b aria-hidden="true">+</b>
          </summary>
          <div className="study-body">
            <p>
              <strong>O que inicia:</strong> Pedido de marcação ou cancelamento.
            </p>
            <p>
              <strong>O agente:</strong> Interpretar intenção administrativa e
              preparar encaminhamento.
            </p>
            <p>
              <strong>A automação:</strong> Propor horários e enviar lembretes
              autorizados.
            </p>
            <p>
              <strong>Controlo humano:</strong> Sem diagnóstico clínico;
              alterações dependem das regras da agenda.
            </p>
            <p>
              <strong>Pré-requisitos:</strong> Agenda integrada, consentimentos
              e separação de dados clínicos.
            </p>
            <p>
              <strong>Como medir:</strong> Tempo administrativo e comparências.
            </p>
            <CaseButton scenario="healthcare">
              Explorar com a Clara →
            </CaseButton>
          </div>
        </details>
        <details className="study" id="caso-documents">
          <summary>
            <span>Backoffice</span>
            <h3>Documentos que chegam prontos a validar</h3>
            <b aria-hidden="true">+</b>
          </summary>
          <div className="study-body">
            <p>
              <strong>O que inicia:</strong> Receção de uma fatura ou
              formulário.
            </p>
            <p>
              <strong>O agente:</strong> Extrair campos e sinalizar
              divergências.
            </p>
            <p>
              <strong>A automação:</strong> Comparar com registos e preparar
              lançamento.
            </p>
            <p>
              <strong>Controlo humano:</strong> Valores, duplicados e pagamentos
              são validados por pessoas e regras.
            </p>
            <p>
              <strong>Pré-requisitos:</strong> Documentos legíveis, esquema de
              dados e regras contabilísticas.
            </p>
            <p>
              <strong>Como medir:</strong> Tempo por documento e taxa de
              correções.
            </p>
            <CaseButton scenario="documents">Explorar com a Clara →</CaseButton>
          </div>
        </details>
        <details className="study" id="caso-operations">
          <summary>
            <span>Operações</span>
            <h3>Passar de relatórios a decisões informadas</h3>
            <b aria-hidden="true">+</b>
          </summary>
          <div className="study-body">
            <p>
              <strong>O que inicia:</strong> Fecho diário ou indicador fora do
              intervalo.
            </p>
            <p>
              <strong>O agente:</strong> Resumir desvios com referência aos
              dados de origem.
            </p>
            <p>
              <strong>A automação:</strong> Criar tarefa e relatório para
              responsáveis.
            </p>
            <p>
              <strong>Controlo humano:</strong> Causalidade e decisões
              operacionais exigem validação.
            </p>
            <p>
              <strong>Pré-requisitos:</strong> Fontes reconciliadas, KPIs
              definidos e responsáveis.
            </p>
            <p>
              <strong>Como medir:</strong> Tempo de preparação e tempo até à
              ação.
            </p>
            <CaseButton scenario="operations">
              Explorar com a Clara →
            </CaseButton>
          </div>
        </details>
      </div>
    </section>
  );
}
