import type { Schema, Struct } from '@strapi/strapi';

export interface BlocksCapability extends Struct.ComponentSchema {
  collectionName: 'components_blocks_capabilities';
  info: {
    displayName: 'Capability';
    icon: 'terminal';
  };
  attributes: {
    text: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface BlocksProcessStep extends Struct.ComponentSchema {
  collectionName: 'components_blocks_process_steps';
  info: {
    displayName: 'Process Step';
    icon: 'apps';
  };
  attributes: {
    description: Schema.Attribute.Text & Schema.Attribute.Required;
    index: Schema.Attribute.String & Schema.Attribute.Required;
    title: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface BlocksService extends Struct.ComponentSchema {
  collectionName: 'components_blocks_services';
  info: {
    displayName: 'Service';
    icon: 'server';
  };
  attributes: {
    description: Schema.Attribute.Text & Schema.Attribute.Required;
    title: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface BlocksTag extends Struct.ComponentSchema {
  collectionName: 'components_blocks_tags';
  info: {
    displayName: 'Tag';
    icon: 'hashtag';
  };
  attributes: {
    label: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

declare module '@strapi/strapi' {
  export namespace Public {
    export interface ComponentSchemas {
      'blocks.capability': BlocksCapability;
      'blocks.process-step': BlocksProcessStep;
      'blocks.service': BlocksService;
      'blocks.tag': BlocksTag;
    }
  }
}
