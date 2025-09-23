// TemplateModel.js
export default class TemplateModel {
  constructor(data) {
    const template = data || {};

    this.name = template.name || '';
    this.category = template.category || 'MARKETING';
    this.language = template.language || 'en_US';

    // Normalize components
    this.components = this.normalizeComponents(template.components || []);
  }

  /**
   * Ensure components always have HEADER, BODY, FOOTER, BUTTONS
   */
  normalizeComponents(components) {
    const defaultComponents = {
      HEADER: { type: 'HEADER', format: 'TEXT', text: '', example: {} },
      BODY: { type: 'BODY', text: '', example: {} },
      FOOTER: { type: 'FOOTER', text: '' },
      BUTTONS: { type: 'BUTTONS', buttons: [] }
    };

    // Map incoming components by type
    const compMap = {};
    components.forEach((c) => {
      compMap[c.type] = { ...defaultComponents[c.type], ...c };
    });

    // Always return all 4, fallback to defaults if missing
    return Object.values(defaultComponents).map((def) =>
      compMap[def.type] ? compMap[def.type] : def
    );
  }
}
