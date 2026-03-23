import { parseSpecies, parseCitizenships, parseLanguages } from './parse';
import citizenshipsXml from '../../../data/citizenships.xml?raw';
import languagesXml from '../../../data/languages.xml?raw';

const speciesModules = import.meta.glob('../../../data/species/*.xml', {
	query: '?raw',
	import: 'default',
	eager: true
});

export const species = Object.values(speciesModules).map((xml) => parseSpecies(xml as string));
export const citizenships = parseCitizenships(citizenshipsXml);
export const languages = parseLanguages(languagesXml);
