import { existsSync, readFileSync } from 'fs';
import { join } from 'path';

export default function loadAppId(): string | undefined {
  const envFile = join(process.cwd(), '.env');
  if (existsSync(envFile)) {
    const envFileContent = readFileSync(envFile).toString();
    const regex = /^VK_APP_ID=(\d+)/gm;
    const match = regex.exec(envFileContent);
    if (match) {
      return match[1];
    }
  }
}
