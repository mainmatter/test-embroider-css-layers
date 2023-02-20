const fs = require('fs/promises');
const path = require('path');
const {
  preprocessEmbeddedTemplates,
} = require('ember-template-imports/lib/preprocess-embedded-templates.js');
const {
  TEMPLATE_TAG_NAME,
  TEMPLATE_TAG_PLACEHOLDER,
} = require('ember-template-imports/lib/util.js');

export default function firstClassComponentTemplates({ addonDir }) {
  return {
    name: 'preprocess-fccts',
    async resolveId(source, importer, options) {
      if (source.endsWith('.hbs')) return;

      for (let ext of ['', '.gjs', '.gts']) {
        let result = await this.resolve(source + ext, importer, {
          ...options,
          skipSelf: true,
        });

        if (result?.external) {
          return;
        }

        if (FCCT_EXTENSION.test(result?.id)) {
          return resolutionFor(result.id);
        }
      }
    },

    async load(id) {
      let originalId = this.getModuleInfo(id)?.meta?.fccts?.originalId ?? id;

      if (originalId !== id) {
        this.addWatchFile(originalId);
      }

      if (FCCT_EXTENSION.test(originalId)) {
        return await preprocessTemplates(originalId, addonDir, this);
      }
    },
  };
}

const FCCT_EXTENSION = /\.g([jt]s)$/;

function resolutionFor(originalId) {
  return {
    id: originalId.replace(FCCT_EXTENSION, '.$1'),
    meta: {
      fccts: { originalId },
    },
  };
}

async function preprocessTemplates(id, addonDir, rollup) {
  let ember = (await import('ember-source')).default;
  let contents = await fs.readFile(id, 'utf-8');

  // This is basically taken directly from `ember-template-imports`
  let result = preprocessEmbeddedTemplates(contents, {
    relativePath: path.relative('.', id),

    getTemplateLocalsRequirePath: ember.absolutePaths.templateCompiler,
    getTemplateLocalsExportPath: '_GlimmerSyntax.getTemplateLocals',

    templateTag: TEMPLATE_TAG_NAME,
    templateTagReplacement: TEMPLATE_TAG_PLACEHOLDER,

    includeSourceMaps: true,
    includeTemplateTokens: true,
  });

  const styleRegex = /<style>([\s\S]*?)<\/style>/g;
  let styleMatch;
  const styles = [];
  while ((styleMatch = styleRegex.exec(contents))) {
    const styleContent = styleMatch[1];
    styles.push(styleContent);
  }
  if (styles.length) {
    const relativePath = path.relative(path.join(addonDir, 'src'), id);
    const css = styles.join('\n\n');
    rollup.emitFile({
      type: 'asset',
      fileName: relativePath.replace(FCCT_EXTENSION, '.css'),
      source: css,
    });
    // await fs.writeFile(id.replace(FCCT_EXTENSION, '.css'), css);
  }

  return result.output;
}
