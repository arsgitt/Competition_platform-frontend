import { resolve } from 'path';

import { generateApi } from 'swagger-typescript-api';

generateApi({
    name: 'UnauthApi.ts',
    output: resolve(process.cwd(), './src/api'),
    url: 'http://127.0.0.1:8001/swagger/?format=openapi',
    httpClientType: 'axios',
});