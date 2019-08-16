import { existsSync, readFileSync, writeFileSync } from 'fs';
import { join } from 'path';

export default function saveAppId(appId: string, replaceExisting: boolean) {
  const envFile = join(process.cwd(), '.env');
  const keyValue = `VK_APP_ID=${appId}`;
  let envFileContent = keyValue;
  if (existsSync(envFile)) {
    envFileContent = readFileSync(envFile).toString();
    envFileContent = replaceExisting
      ? envFileContent.replace(/^VK_APP_ID=\d+/gm, keyValue)
      : `${envFileContent}\n${keyValue}`;
  }
  writeFileSync(envFile, envFileContent);
}
