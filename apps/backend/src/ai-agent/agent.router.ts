export class AIAgentRouter {
  static suggestExpertDomainFromTitle(title: string): string {
    const map: Record<string, string[]> = {
      finance: ['invoice', 'tax', 'payment'],
      it: ['vpn', 'network', 'printer', 'wifi'],
      hr: ['leave', 'payslip', 'contract'],
    };

    const lower = title.toLowerCase();

    for (const [domain, keywords] of Object.entries(map)) {
      if (keywords.some(k => lower.includes(k))) return domain;
    }

    return 'general';
  }
}
