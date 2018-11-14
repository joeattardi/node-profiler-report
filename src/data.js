const debug = require('debug')('profiler-report:data');

const sectionHeaderRegex = /\[(.+)\]:/;
const recordRegex = /(\d+)\s+(\d+\.\d+%)\s+(\d+\.\d+%)?\s+(.+)/;

const whitelist = ['JavaScript', 'C++', 'Summary', 'Shared libraries'];

exports.parseSections = function parseSections(content) {
  debug('Parsing data sections');

  const lines = content.split('\n');
  
  const sections = {};

  let currentSection;

  lines.forEach(line => {
    let match = sectionHeaderRegex.exec(line);
    if (match) {
      currentSection = match[1];

      if (whitelist.includes(currentSection)) { // new section found
        debug(`Found new section: "${currentSection}"`);
        sections[currentSection] = [];
        return;
      }
    }

    match = recordRegex.exec(line);
    if (match && currentSection && whitelist.includes(currentSection)) {
      sections[currentSection].push({
        ticks: parseInt(match[1]),
        total: percentToDecimal(match[2]),
        nonlib: percentToDecimal(match[3] || '') || 0,
        name: match[4]
      });
    }
  });

  return sections;
};

function percentToDecimal(percent) {
  return parseFloat(percent.substring(0, percent.length - 1));
}
