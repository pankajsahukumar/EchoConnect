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
      let merged = { ...defaultComponents[c.type], ...c };

      // Special handling for HEADER text variables
      if (c.type === 'HEADER' && c.format === 'TEXT' && c.text) {
        merged.example = this.extractVariables(c.text, c.example || {});
      }

      // Special handling for BODY text variables
      if (c.type === 'BODY' && c.text) {
        merged.example = this.extractVariables(c.text, c.example || {});
      }

      // Special handling for BUTTONS with URL type
      if (c.type === 'BUTTONS' && Array.isArray(c.buttons)) {
        merged.buttons = c.buttons.map((btn) => {
          if (btn.type === 'URL' && btn.url) {
            btn.example = this.extractVariables(btn.url, btn.example || {});
          }
          return btn;
        });
      }

      compMap[c.type] = merged;
    });

    // Always return all 4, fallback to defaults if missing
    return Object.values(defaultComponents).map((def) =>
      compMap[def.type] ? compMap[def.type] : def
    );
  }

  /**
   * Extract variables from any string like "Hello {{name}}"
   * Returns { name: "" } or preserves existing values
   */
  extractVariables(text, existingExample = {}) {
    const regex = /{{\s*([^}]+)\s*}}/g;
    const variables = { ...existingExample };
    let match;

    while ((match = regex.exec(text)) !== null) {
      const varName = match[1].trim();
      if (!(varName in variables)) {
        variables[varName] = '';
      }
    }

    return variables;
  }
}
