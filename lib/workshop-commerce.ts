/**
 * Comércio dos workshops AtlasHub.SI via ARO (issue #9).
 * Fonte dos preços e códigos: catálogo ARO do projeto `atlashub-si` (ofertas ATIVAS).
 * Este módulo é o ÚNICO lugar que mapeia slug+lote → oferta ARO. O browser nunca envia
 * código de oferta nem amount: envia `slug` + `lote`, e o amount exibido no checkout
 * vem SEMPRE da resposta do ARO (CheckoutSession.amount).
 */
import type { Workshop, WorkshopSlug } from "./workshops";

export type WorkshopLot = "antecipado" | "regular";

export type WorkshopOffer = {
  /** Lote tal como o browser envia. */
  lot: WorkshopLot;
  /** Código da oferta no catálogo ARO (nunca exposto ao browser). */
  aroOffer: string;
  /** Valor homologado no catálogo ARO (exibido na landing; cobrança usa o amount do ARO). */
  catalogAmountMinor: number;
  /** Janela de venda server-side (a oferta antecipada só abre depois desta hora). */
  opensAt: string;
};

export type WorkshopCommerce = {
  slug: WorkshopSlug;
  code: "W01" | "EL01";
  /** Atribuição enviada ao ARO (Clara/Atendimento.Center usa o link do próprio site). */
  attributionCode: string;
  /** Direito no catálogo ARO: só ACTIVE desbloqueia o bilhete. */
  aroEntitlement: string;
  /** Capacidade-alvo server-side (limites do catálogo; nunca prometidos como 'vagas restantes'). */
  capacity: number;
  offers: Record<WorkshopLot, WorkshopOffer>;
};

export const workshopCommerce: Record<WorkshopSlug, WorkshopCommerce> = {
  "empresa-aumentada-2027-2030": {
    slug: "empresa-aumentada-2027-2030",
    code: "W01",
    attributionCode: "W01-SITE",
    aroEntitlement: "atlashub-si:w01",
    capacity: 25,
    offers: {
      antecipado: {
        lot: "antecipado",
        aroOffer: "workshop-01-empresa-aumentada-antecipado-br",
        catalogAmountMinor: 29700,
        opensAt: "2026-10-16T03:00:00Z",
      },
      regular: {
        lot: "regular",
        aroOffer: "workshop-01-empresa-aumentada-regular-br",
        catalogAmountMinor: 34700,
        opensAt: "2026-11-02T03:00:00Z",
      },
    },
  },
  "enterprise-lab-ecommerce": {
    slug: "enterprise-lab-ecommerce",
    code: "EL01",
    attributionCode: "EL01-SITE",
    aroEntitlement: "atlashub-si:el01",
    capacity: 12,
    offers: {
      antecipado: {
        lot: "antecipado",
        aroOffer: "enterprise-lab-01-ecommerce-antecipado-br",
        catalogAmountMinor: 99000,
        opensAt: "2026-10-16T03:00:00Z",
      },
      regular: {
        lot: "regular",
        aroOffer: "enterprise-lab-01-ecommerce-regular-br",
        catalogAmountMinor: 129000,
        opensAt: "2026-11-02T03:00:00Z",
      },
    },
  },
};

export function commerceBySlug(slug: string): WorkshopCommerce | undefined {
  return (workshopCommerce as Record<string, WorkshopCommerce | undefined>)[slug];
}

export function commerceByWorkshop(w: Workshop): WorkshopCommerce {
  const c = commerceBySlug(w.slug);
  if (!c) throw new Error(`sem configuração comercial para ${w.slug}`);
  return c;
}

/** A oferta deve estar dentro da janela server-side. `now` injetável nos testes. */
export function lotInWindow(c: WorkshopCommerce, lot: WorkshopLot, now = new Date()): boolean {
  return now >= new Date(c.offers[lot].opensAt);
}

/**
 * Estados normalizados apresentados na UI. Tudo o que não é PENDING/APPROVED/EXPIRED
 * colapsa em FAILED (fail-closed: sem estado ambíguo, sem bilhete).
 */
export type PublicCheckoutState = "PENDING" | "APPROVED" | "FAILED" | "EXPIRED";
export function normalizeCheckoutState(state: string): PublicCheckoutState {
  switch (state) {
    case "PENDING":
    case "CREATED":
      return "PENDING";
    case "APPROVED":
      return "APPROVED";
    case "EXPIRED":
      return "EXPIRED";
    default:
      return "FAILED";
  }
}

/** Políticas comerciais visíveis ANTES de pagar (issue #9 §5). LGPD-compatível, sem afirmar espaço reservado. */
export function workshopPolicies(w: Workshop): { local: string; prazoLocal: string; adiamento: string; cancelamento: string; dados: string } {
  return {
    local: `Anápolis — local a divulgar. O endereço exato depende de confirmação de capacidade e é comunicado antes do evento; nenhum lugar fica reservado pela inscrição nesta fase de divulgação.`,
    prazoLocal: `O endereço é comunicado por e-mail a todos os inscritos com, no mínimo, 5 dias úteis de antecedência (${w.date}). Se o local não puder ser confirmado até essa data, o evento é reagendado e a inscrição pode ser mantida ou reembolsada integralmente.`,
    adiamento: `Se o evento for adiado pela organização, a inscrição é transferida automaticamente para a nova data. Quem não puder comparecer na nova data pode pedir reembolso integral até 5 dias úteis após o anúncio.`,
    cancelamento: `Cancelamento pelo participante: reembolso integral do valor pago até 7 dias corridos após a inscrição (art. 49 do CDC). Fora desse prazo, reembolso integral até 7 dias úteis antes do evento; após esse limite, a inscrição pode ser transferida para outra pessoa da mesma empresa até 2 dias úteis antes do evento.`,
    dados: `Usamos nome, e-mail e dados de pagamento apenas para viabilizar a sua inscrição, o bilhete e a comunicação do local (execução do contrato). E-mails de divulgação e o grupo de WhatsApp só são enviados/adicionados com a sua marcação voluntária e separada, revogáveis a qualquer momento. Não vendemos nem partilhamos os seus dados com terceiros de marketing. Mais detalhes na política de privacidade do site.`,
  };
}

export function formatBRL(amountMinor: number): string {
  return new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(amountMinor / 100);
}
