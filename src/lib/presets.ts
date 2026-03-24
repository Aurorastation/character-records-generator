import { parseTemplate } from './data/parse';

const templateModules = import.meta.glob('../../data/templates/*.xml', {
	query: '?raw',
	import: 'default',
	eager: true
});

export const presets = Object.entries(templateModules).map(([path, xml]) => {
	const filename = path.split('/').pop()!.replace('.xml', '');
	return parseTemplate(xml as string, `preset:${filename}`);
});
