// TemplateModel.js
export default class TemplateModel {
  constructor(data) {
    const template = data || {};

    this.name = template.name || '';
    this.category = template.category || 'MARKETING';
    this.language = template.language || 'en'; // Changed default to 'en' to match UI
    this.components = this.normalizeComponents(template.components || []);
  }

  /**
   * Ensure components always have HEADER, BODY, FOOTER, BUTTONS for UI consistency
   */
  normalizeComponents(components) {
    const defaultComponents = {
      HEADER: { type: 'HEADER', format: 'NONE' }, // Default format NONE
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
   * Removes empty/unused components
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

    return {
      name: this.name,
      category: this.category,
      language: this.language,
      components: validComponents
    };
  }

  static fromState(state) {
    return new TemplateModel(state);
  }
}
