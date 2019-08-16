import { readFileSync } from 'fs';
import { join } from 'path';

export default function getPackageName() {
  const pjsonPath = join(process.cwd(), './package.json');
  const content = readFileSync(pjsonPath, 'utf8');
  const pjson = JSON.parse(content);
  return pjson.name || null;
}
