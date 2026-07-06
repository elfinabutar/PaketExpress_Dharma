import mysql from 'mysql2/promise';

const passwords = ['', 'root', 'password', '123456', 'mysql', 'admin'];

async function testPasswords() {
    console.log('\n🔍 MENCARI PASSWORD MYSQL...\n');
    
    for (const pwd of passwords) {
        try {
            const conn = await mysql.createConnection({
                host: '127.0.0.1',
                user: 'root',
                password: pwd,
                port: 3306
            });
            console.log(`\n✅ BERHASIL! Password = ${pwd === '' ? '(KOSONG)' : pwd}`);
            console.log(`\n📝 UPDATE .env DENGAN:`);
            console.log(`DB_PASSWORD=${pwd}\n`);
            await conn.end();
            process.exit(0);
        } catch (err) {
            console.log(`❌ ${pwd === '' ? '(KOSONG)' : pwd} - gagal`);
        }
    }
    console.log('\n❌ TIDAK ADA PASSWORD YANG COCOK!');
}

testPasswords();