import { describe, it, expect } from 'vitest';
import { parseSpecies } from './parse';

describe('parseSpecies', () => {
	it('parses labels section into a record', () => {
		const xml = `<?xml version="1.0" encoding="UTF-8"?>
<species id="tajara" name="Tajara">
  <labels>
    <label for="subspecies">Ethnicity</label>
    <label for="skin-color">Fur Colour</label>
  </labels>
  <subspecies>
    <entry id="hharar" name="Hharar">
      <description>The typical Tajara.</description>
    </entry>
  </subspecies>
</species>`;
		const result = parseSpecies(xml);
		expect(result.labels).toEqual({
			subspecies: 'Ethnicity',
			'skin-color': 'Fur Colour'
		});
	});

	it('returns empty labels when no labels section exists', () => {
		const xml = `<?xml version="1.0" encoding="UTF-8"?>
<species id="unathi" name="Unathi">
</species>`;
		const result = parseSpecies(xml);
		expect(result.labels).toEqual({});
	});
});
