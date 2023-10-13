import commandLineArgs from 'command-line-args';
import commandLineUsage from 'command-line-usage';

export default function cli() {
  const optionDefinitions = [
    {
      name: 'help',
      description: 'Display this usage guide.',
      alias: 'h',
      type: Boolean,
    },
    {
      name: 'extract',
      alias: 'e',
      type: String,
      description:
        'Copy necessary exported files to the extract folder. ' +
        'Value: export path folder e.g: {underline export/UltimateFishing/}',
    },
    {
      name: 'clean',
      alias: 'c',
      type: Boolean,
      description: 'Clean extracted files',
    },
  ];

  const sections = [
    {
      header: 'Ultimate Fishing Simulator Parser',
      content:
        'Parse files previously extracted from Ultimate Fishing Simulator and generates associated data json files',
    },
    {
      header: 'Examples',
      content: [
        '$ node parse.js',
        '$ node parse.js {bold -e} {underline ./export/UltimateFishing/}',
        '$ node parsers/parse.js {bold --help}',
      ],
    },
    {
      header: 'Options',
      optionList: optionDefinitions,
    },
    {
      header: 'Extra',
      content: ['Project home: https://github.com/Dixeet/ufs-companion'],
    },
  ];

  const argv = commandLineArgs(optionDefinitions);
  const output = commandLineUsage(sections);

  return {
    argv,
    output,
  };
}
