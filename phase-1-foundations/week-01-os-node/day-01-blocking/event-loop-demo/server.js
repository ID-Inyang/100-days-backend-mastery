import fs from 'fs'; // Using standard fs for stream creation
import fsPromises from 'fs/promises';
import path from 'path';

console.log('Start');

async function folderExists(targetPath) {
    try {
        const stats = await fsPromises.stat(targetPath);
        return stats.isDirectory();
    } catch (err) {
        if (err.code === 'ENOENT') return false;
        throw err;
    }
}

async function main() {
    const dir = './dummy-files/';
    const exists = await folderExists(dir);

    if (!exists) {
        console.log(`Creating directory: ${dir}`);
        await fsPromises.mkdir(dir, { recursive: true });

        // Create a small, reusable 4-Kilobyte block of data in memory
        const pattern = Buffer.from('abbc'); 
        const chunk = Buffer.alloc(4096); 
        for (let i = 0; i < chunk.length; i += pattern.length) {
            pattern.copy(chunk, i);
        }

        for (let i = 1; i <= 5; i++) {
            const sizeMB = i * 100;
            const totalBytesNeeded = sizeMB * 1024 * 1024;
            const filePath = path.join(dir, `file${i}.txt`);

            console.log(`Streaming file${i}.txt (${sizeMB}MB)...`);

            // Open a pipeline connection straight to the hard drive
            const writeStream = fs.createWriteStream(filePath);
            
            let bytesWritten = 0;
            while (bytesWritten < totalBytesNeeded) {
                const bytesLeft = totalBytesNeeded - bytesWritten;
                // If we need less than 4KB to finish, only write what's left
                const chunkToWrite = bytesLeft < chunk.length ? chunk.subarray(0, bytesLeft) : chunk;
                
                writeStream.write(chunkToWrite);
                bytesWritten += chunkToWrite.length;
            }

            // Close the pipeline and wait for the hard drive to finish saving
            await new Promise((resolve) => writeStream.end(resolve));
            console.log(`Successfully finished: file${i}.txt`);
        }
    } else {
        console.log('Directory already exists.');
    }
    console.log('Done!');
}

main().catch(console.error);