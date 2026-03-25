// TemplateModel.js
export default class TemplateModel {
  constructor(data) {
    const template = data || {};

    this.id = template.id || null;
    this.name = template.name || '';
    this.category = template.category || 'MARKETING';
    this.subCategory = template.subCategory || 'CUSTOM';
    this.language = template.language || 'en';
    this.waba = template.waba || '';
    this.variableSamples = template.variableSamples || {};
    this.authConfig = template.authConfig || {
      securityDisclaimer: true,
      hasExpiry: true,
      expiryMinutes: 30,
    };
    this.components = this.normalizeComponents(template.components || []);
  }

  /**
   * Ensure components always have HEADER, BODY, FOOTER, BUTTONS for UI consistency
   */
  normalizeComponents(components) {
    const defaultComponents = {
      HEADER: { type: 'HEADER', format: 'NONE' },
      BODY: { type: 'BODY', text: '' },
      FOOTER: { type: 'FOOTER', text: '' },
      BUTTONS: { type: 'BUTTONS', buttons: [] }
    };

    // Map incoming components by type
    const compMap = {};
    components.forEach((c) => {
      compMap[c.type] = { ...c };
    });

    // Return array with merged defaults
    return Object.keys(defaultComponents).map(type => {
      if (compMap[type]) {
        return compMap[type];
      }
      return defaultComponents[type];
    });
  }

  /**
   * Prepare data for API submission
   * Removes empty/unused components, attaches variable examples
   */
  toApiPayload() {
    const validComponents = this.components.filter(c => {
      if (c.type === 'HEADER') {
        return c.format && c.format !== 'NONE';
      }
      if (c.type === 'BODY') {
        return c.text && c.text.trim().length > 0;
      }
      if (c.type === 'FOOTER') {
        return c.text && c.text.trim().length > 0;
      }
      if (c.type === 'BUTTONS') {
        return c.buttons && c.buttons.length > 0;
      }
      return false;
    });

    // Attach variable example values to components
    const componentsWithExamples = validComponents.map(c => {
      if (c.type === 'HEADER' && c.format === 'TEXT') {
        const headerExamples = this._getExamplesForScope('header', c.text);
        if (headerExamples.length > 0) {
          return { ...c, example: { header_text: headerExamples } };
        }
      }
      if (c.type === 'BODY') {
        const bodyExamples = this._getExamplesForScope('body', c.text);
        if (bodyExamples.length > 0) {
          return { ...c, example: { body_text: [bodyExamples] } };
        }
      }
      return c;
    });

    return {
      name: this.name,
      category: this.category,
      subCategory: this.subCategory,
      language: this.language,
      waba: this.waba,
      components: componentsWithExamples
    };
  }

  /**
   * Extract variable names from text and map them to sample values
   */
  _getExamplesForScope(scope, text) {
    if (!text) return [];
    const regex = /\{\{([^}]+)\}\}/g;
    const examples = [];
    let match;
    while ((match = regex.exec(text)) !== null) {
      const varName = match[1].trim();
      const sampleValue = this.variableSamples[`${scope}:${varName}`] || varName;
      examples.push(sampleValue);
    }
    return examples;
  }

  static fromState(state) {
    return new TemplateModel(state);
  }
}
