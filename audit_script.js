
const http = require('http');

const BASE_URL = 'http://localhost:3001';

const pages = [
    '/',
    '/screener',
    '/macro'
];

async function checkPage(path) {
    return new Promise((resolve) => {
        const url = `${BASE_URL}${path}`;
        const start = Date.now();

        http.get(url, (res) => {
            let data = '';
            res.on('data', (chunk) => data += chunk);
            res.on('end', () => {
                const duration = Date.now() - start;
                const hasTimestamps = /Updated:/.test(data);
                const hasSource = /Source:/.test(data);
                const hasError = /Application error/.test(data) || /Internal Server Error/.test(data);

                resolve({
                    path,
                    status: res.statusCode,
                    duration,
                    hasTimestamps,
                    hasSource,
                    hasError,
                    size: data.length,
                    body: data
                });
            });
        }).on('error', (err) => {
            resolve({ path, error: err.message });
        });
    });
}

async function runAudit() {
    console.log('Starting Legend Investor Audit (Node.js version)...\n');

    let success = true;

    for (const page of pages) {
        const result = await checkPage(page);

        if (result.error) {
            console.log(`❌ ${page}: Failed to connect - ${result.error}`);
            success = false;
            continue;
        }

        const statusIcon = result.status === 200 ? '✅' : '❌';
        console.log(`${statusIcon} ${page} (${result.duration}ms)`);

        if (result.status !== 200) {
            console.log(`   Status: ${result.status}`);
            if (result.body) {
                console.log(`   Response: ${result.body.substring(0, 200)}...`);
            }
            success = false;
        }

        if (result.hasError) {
            console.log(`   ❌ Application Error detected!`);
            success = false;
        }

        // Check Trust UI
        /*
        if (result.hasTimestamps) console.log(`   ✅ Timestamps found`);
        else console.log(`   ⚠️ No timestamps found`);
        
        if (result.hasSource) console.log(`   ✅ Source badges found`);
        else console.log(`   ⚠️ No source badges found`);
        */
    }

    const fs = require('fs');
    fs.writeFileSync('audit_report.json', JSON.stringify({
        timestamp: new Date().toISOString(),
        success,
        results: pages.map(p => `Checked ${p}`) // Simplified for reporting
    }, null, 2));

    console.log('\nAudit Complete.');
    if (success) console.log('✅ All checks passed.');
    else console.log('❌ Issues detected.');
    console.log('💾 Report saved to audit_report.json');
}

runAudit();
