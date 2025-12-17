import 'dotenv/config';
import { watch } from 'chokidar';
import { readFile, rename, mkdir } from 'fs/promises';
import { createReadStream, createWriteStream } from 'fs'; // IMPORTANT: depuis 'fs', pas 'fs/promises'
import { join } from 'path';
import yauzl from 'yauzl';
import FormData from 'form-data';
import fetch from 'node-fetch';

const WATCH_DIR = '/home/hektor_ftp/xml_uploads';
const PROCESSED_DIR = join(WATCH_DIR, 'processed');
const WEBHOOK_URL = process.env.VERCEL_WEBHOOK_URL;
const WEBHOOK_SECRET = process.env.WEBHOOK_SECRET;

if (!WEBHOOK_URL || !WEBHOOK_SECRET) {
  console.error('❌ Variables d\'environnement manquantes!');
  process.exit(1);
}

// Créer le dossier processed s'il n'existe pas
mkdir(PROCESSED_DIR, { recursive: true }).catch(() => {});

// Fonction pour dézipper un fichier
function extractZip(zipPath: string, outputDir: string): Promise<string | null> {
  return new Promise((resolve, reject) => {
    yauzl.open(zipPath, { lazyEntries: true }, (err: Error | null, zipfile: yauzl.ZipFile | undefined) => {
      if (err || !zipfile) {
        reject(err || new Error('Failed to open zip file'));
        return;
      }

      zipfile.readEntry();
      zipfile.on('entry', (entry: yauzl.Entry) => {
        if (/\.xml$/i.test(entry.fileName)) {
          zipfile.openReadStream(entry, (err: Error | null, readStream: NodeJS.ReadableStream | null) => {
            if (err || !readStream) {
              reject(err || new Error('Failed to open read stream'));
              return;
            }

            const outputPath = join(outputDir, entry.fileName);
            const writeStream = createWriteStream(outputPath);
            
            readStream.pipe(writeStream);
            writeStream.on('close', () => resolve(outputPath));
            writeStream.on('error', reject);
          });
        } else {
          zipfile.readEntry();
        }
      });

      zipfile.on('end', () => resolve(null));
      zipfile.on('error', reject);
    });
  });
}

// Fonction pour envoyer le XML à Vercel
async function sendToVercel(xmlPath: string): Promise<void> {
  try {
    const xmlContent = await readFile(xmlPath, 'utf-8');
    
    const formData = new FormData();
    formData.append('xml', xmlContent, {
      filename: 'hektor.xml',
      contentType: 'application/xml'
    });

    const response = await fetch(WEBHOOK_URL!, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${WEBHOOK_SECRET}`,
        ...formData.getHeaders()
      },
      body: formData
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(`Vercel API error: ${JSON.stringify(result)}`);
    }

    console.log(`✅ Fichier traité avec succès: ${result.processed || 0} propriétés`);
  } catch (error: any) {
    const status = error?.response?.status || error?.status || 'N/A';
    console.error(`❌ Erreur lors du traitement: ${status}`, error);
    throw error;
  }
}

// Surveiller le dossier
console.log(`👀 Surveillance du dossier ${WATCH_DIR}...`);

const watcher = watch(WATCH_DIR, {
  ignored: /processed/,
  persistent: true,
  ignoreInitial: false
});

watcher.on('add', async (path: string) => {
  if (/\.(xml|zip)$/i.test(path)) {
    console.log(`📥 Nouveau fichier détecté: ${path}`);
    
    try {
      let xmlPath = path;
      
      // Si c'est un ZIP, le dézipper
      if (/\.zip$/i.test(path)) {
        console.log('📦 Extraction du ZIP...');
        const extracted = await extractZip(path, WATCH_DIR);
        if (!extracted) {
          throw new Error('Aucun fichier XML trouvé dans le ZIP');
        }
        xmlPath = extracted;
      }
      
      // Envoyer à Vercel
      console.log('📤 Envoi du XML à Vercel...');
      await sendToVercel(xmlPath);
      
      // Déplacer vers processed
      const fileName = path.split('/').pop() || 'unknown';
      const processedPath = join(PROCESSED_DIR, `${Date.now()}_${fileName}`);
      await rename(path, processedPath);
      
      // Si on a extrait un XML, aussi le déplacer
      if (xmlPath !== path) {
        const extractedFileName = xmlPath.split('/').pop() || 'unknown';
        const extractedProcessedPath = join(PROCESSED_DIR, `${Date.now()}_${extractedFileName}`);
        await rename(xmlPath, extractedProcessedPath);
      }
      
      console.log(`✅ Fichier déplacé vers: ${processedPath}`);
    } catch (error) {
      console.error(`❌ Erreur lors du traitement de ${path}:`, error);
    }
  }
});

watcher.on('error', (error: Error) => {
  console.error('❌ Erreur du watcher:', error);
});

console.log('✅ Surveillance active!');

