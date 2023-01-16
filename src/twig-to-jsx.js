const FUNCTION_NAMES = [
  'absolute_url',
  'asset|0',
  'asset_version',
  'attribute',
  'block',
  'constant',
  'controller|0',
  'country_timezones',
  'csrf_token',
  'cycle',
  'date',
  'dump',
  'expression',
  'form|0',
  'form_end',
  'form_errors',
  'form_help',
  'form_label',
  'form_rest',
  'form_row',
  'form_start',
  'form_widget',
  'html_classes',
  'include',
  'is_granted',
  'logout_path',
  'logout_url',
  'max',
  'min',
  'parent',
  'path|0',
  'random',
  'range',
  'relative_path',
  'render',
  'render_esi',
  'source',
  'template_from_string',
  'url|0'
];

const FILTERS = [
  'abs',
  'abbr_class',
  'abbr_method',
  'batch',
  'capitalize',
  'column',
  'convert_encoding',
  'country_name',
  'currency_name',
  'currency_symbol',
  'data_uri',
  'date',
  'date_modify',
  'default',
  'escape',
  'file_excerpt',
  'file_link',
  'file_relative',
  'filter',
  'first',
  'format',
  'format_args',
  'format_args_as_text',
  'format_currency',
  'format_date',
  'format_datetime',
  'format_file',
  'format_file_from_text',
  'format_number',
  'format_time',
  'html_to_markdown',
  'humanize',
  'inky_to_html',
  'inline_css',
  'join',
  'json_encode',
  'keys',
  'language_name',
  'last',
  'length',
  'locale_name',
  'lower',
  'map',
  'markdown',
  'markdown_to_html',
  'merge',
  'nl2br',
  'number_format',
  'raw',
  'reduce',
  'replace',
  'reverse',
  'round',
  'slice',
  'slug',
  'sort',
  'spaceless',
  'split',
  'striptags',
  'timezone_name',
  'title',
  'trans',
  'transchoice',
  'trim',
  'u|0',
  'upper',
  'url_encode',
  'yaml_dump',
  'yaml_encode'
];
const TAG_NAMES = [
  'apply',
  'autoescape',
  'block',
  'cache',
  'deprecated',
  'do',
  'embed',
  'extends',
  'filter',
  'flush',
  'for',
  'form_theme',
  'from',
  'if',
  'import',
  'include',
  'macro',
  'sandbox',
  'set',
  'stopwatch',
  'trans',
  'trans_default_domain',
  'transchoice',
  'use',
  'verbatim',
  'with'
];

function isAVariable(variable) {
  return (TAG_NAMES.indexOf(variable) !== -1);
}

function isAFunction(func) {
  return (FUNCTION_NAMES.indexOf(func) !== -1);
}

function isAFilter(filter) {
  return (FILTERS.indexOf(filter) !== -1);
}
const twigToJSX = (twig) => {
  let jsx = '';
  let insideBlock = false;
  let blockName = '';
  let tabCount = 0;

  const lines = twig.split('\n');
  // let vars = [];

  for (let i = 0; i < lines.length; i++) {
    let line = lines[i];

    if (line.includes('{% block')) {
      insideBlock = true;
      blockName = line.split(' ')[1];
      jsx += `const ${blockName} = (props) => {\n`;
      tabCount++;
    } else if (line.includes('{% endblock %}')) {
      insideBlock = false;
      jsx += '\n}';
    } else if (insideBlock) {
      let indentation = ' '.repeat(tabCount * 2);

      if (line.trim().startsWith('</')) {
       // Closing tag
        let tagName = line.match(/<\/([a-zA-Z0-9-_]+)/)[1];

        tabCount--;
        jsx += `\n${indentation}</${tagName}>\n`;
      } else if (line.trim().startsWith('<')) {
        // Opening tag
        let tagName = line.match(/<([a-zA-Z0-9-_]+)/) ? line.match(/<([a-zA-Z0-9-_]+)/)[1] : '';
        let classes = (line.match(/class="(.+?)"/)) ? (line.match(/class="(.+?)"/)[1]) : '' ;

        jsx += `\n${indentation}<${tagName} className={${classes}}>\n`;
        tabCount++;
      } else if (line.trim().startsWith('{%')) {
        // vars.push(line.match(/^(?!")[a-zA-Z0-9-_]+)/));
        // Twig control flow
        if (line.trim().startsWith('{% if')) {
          let ifArr = line.split(' ');
          let start = ifArr.indexOf('if') + 1;
          let end = ifArr.indexOf('%}');

          let condition = ifArr.slice(start, end).join(' ');

          jsx += `\n${indentation} if (${condition}) {  \n`;
          tabCount++;
        } else if (line.trim().startsWith('{% endif')) {
          tabCount--;
          jsx += `\n${indentation} }\n`;
        } else if (line.trim().startsWith('{% else')) {
          tabCount--;
          jsx += `\n${indentation}: \n`;
          tabCount++;
        }
      } else if (line.trim().startsWith('{{ ')) {
        // Twig variable
        let variable = line.match(/{{ (.+?) }}/)[1];

        jsx += `\n${indentation}{props.${variable}}`;
      }
    }
  }
  console.log(jsx);
  return (jsx);
};

export default twigToJSX;

