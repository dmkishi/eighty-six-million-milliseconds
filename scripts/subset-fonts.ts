/**
 * @fileoverview Subset Japanese fonts to only numeral words. Reads all fonts in
 * `src/fonts` of formats SFNT (TrueType/OpenType), WOFF, and WOFF2 and outputs
 * only WOFF2.
 *
 * Results can be inspected at <https://fontdrop.info/>.
 */
import { readFile, writeFile } from 'fs/promises';
import { glob } from 'glob';
import path from 'node:path';
import subsetFont from 'subset-font';

/**
 * @see <https://en.wikipedia.org/wiki/Japanese_numerals#Large_numbers>.
 */
const SET = '零一二三四五六七八九十百千万億兆京垓𥝱秭穣溝澗正載極恒河沙阿僧祇那由他多不可思議無量大数';

/**
 * Make new filepath with (a) file extension of `woff2` and (b) file name
 * appended with `-SUBSET`.
 * @example `dir/font.ttf` → `dir/font-SUBSET.woff2`
 */
function makeSubsetFilePath(filePath: string): string {
  const parsedPath = path.parse(filePath);
  return path.format({
    ...parsedPath,
    base: undefined, // Ignore `base` so that `name` and `ext` take effect.
    name: `${parsedPath.name}-SUBSET`,
    ext: 'woff2',
  });
}

function convertByteToMb(bytes: number): string {
  const mb = bytes / 1024 / 1024;
  return mb.toFixed(2);
}

const fontFilePaths = await glob('src/fonts/japanese/**/*.{ttf,otf,woff,woff2}');
const filteredFontFilePaths = fontFilePaths.filter(filePath => {
  return !path.parse(filePath).name.match(/-SUBSET$/);
});
filteredFontFilePaths.forEach(async filePath => {
  const buffer = await readFile(filePath);
  const subsetBuffer = await subsetFont(buffer, SET, { targetFormat: 'woff2' });
  const subsetFilePath = makeSubsetFilePath(filePath);
  await writeFile(subsetFilePath, subsetBuffer);

  const originalMb = convertByteToMb(buffer.length);
  const subsetMb = convertByteToMb(subsetBuffer.length);
  console.log(`${subsetFilePath} (${originalMb} → ${subsetMb} MB)`);
});
