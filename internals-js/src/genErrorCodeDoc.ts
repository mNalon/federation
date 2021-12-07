import { assert } from './utils';
import { ERROR_CODE_REGISTRY, REMOVED_ERRORS } from './error';

const header = `---
title: Federation error codes
sidebar_title: Error codes
---

When Apollo Gateway attempts to **compose** the schemas provided by your [subgraphs](./subgraphs/) into a **supergraph schema**, it confirms that:

* The subgraphs are valid
* The resulting supergraph schema is valid
* The gateway has all of the information it needs to execute operations against the resulting schema

If Apollo Gateway encounters an error, composition fails. This document lists subgraphs and composition error codes and their root causes.
`;

function makeMardownArray(
  headers: string[],
  rows: string[][]
): string {
  const columns = headers.length;
  let out = '| ' + headers.join(' | ') + ' |\n';
  out += '|---|---|\n';
  for (const row of rows) {
    assert(row.length <= columns, `Row [${row}] has too columns (expect ${columns} but got ${row.length})`);
    const frow = row.length === columns
      ? row
      : row.concat(new Array<string>(columns - row.length).fill(''));
    out += '| ' + frow.join(' | ') + ' |\n'
  }
  return out;
}

const rows = ERROR_CODE_REGISTRY.registeredDefinitions().map(def => [
  '`' + def.code + '`',
  def.description,
  def.metadata.addedIn,
  def.metadata.replaces ? `Replaces: ${def.metadata.replaces.map(c => '`' + c + '`').join(', ')}` : ''
]);

const sortRowsByCode = (r1: string[], r2: string[]) => r1[0].localeCompare(r2[0]);

rows.sort(sortRowsByCode);

const errorsSection = '## Errors\n\n' + makeMardownArray(
  [ 'Code', 'Description', 'Since', 'Comment' ],
  rows
);

const removedErrors = REMOVED_ERRORS
  .map(([code, comment]) => ['`' + code + '`', comment])
  .sort(sortRowsByCode);

const removedSection = `## Removed codes

The following section lists code that have been removed and are not longer generated by the gateway version this is the documentation for.

` + makeMardownArray(['Removed Code', 'Comment'], removedErrors);

console.log(
  header + '\n\n'
  + errorsSection + '\n\n'
  + removedSection
);
