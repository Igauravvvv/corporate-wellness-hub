const fs = require('fs');

const frontendPkg = JSON.parse(fs.readFileSync('./src/frontend/package.json', 'utf8'));
const nextPkg = JSON.parse(fs.readFileSync('./next-app/package.json', 'utf8'));

const excludeDeps = [
    '@dfinity/agent', '@dfinity/auth-client', '@dfinity/candid', '@dfinity/identity', '@dfinity/principal',
    '@icp-sdk/core', 'react', 'react-dom', 'next', 'react-use'
];
const excludeDevDeps = [
    '@vitejs/plugin-react', 'vite', 'vite-plugin-environment', 'typescript', 'tailwindcss', 'postcss', 'autoprefixer'
];

if (frontendPkg.dependencies) {
    for (const [key, value] of Object.entries(frontendPkg.dependencies)) {
        if (!excludeDeps.includes(key)) {
            nextPkg.dependencies[key] = value;
        }
    }
}

if (frontendPkg.devDependencies) {
    for (const [key, value] of Object.entries(frontendPkg.devDependencies)) {
        if (!excludeDevDeps.includes(key) && !nextPkg.devDependencies[key]) {
            nextPkg.devDependencies[key] = value;
        }
    }
}

fs.writeFileSync('./next-app/package.json', JSON.stringify(nextPkg, null, 2));
console.log('package.json updated');
