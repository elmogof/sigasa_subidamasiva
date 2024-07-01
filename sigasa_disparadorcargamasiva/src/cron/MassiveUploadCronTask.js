import { CronJob } from 'cron';
import * as dotenv from "dotenv";
import ExecMassiveUpload from '../api/ExecMassiveUpload.js';
import { spawn } from 'child_process';
import treeKill from 'tree-kill';

dotenv.config();

let workerProcess = null;

const startWorker = () => {
  if (workerProcess) {
    console.log('Worker is already running');
    return;
  }

  console.log("Starting worker...");
  workerProcess = spawn('npm', ['run', 'dev'], { cwd: '../sigasa_subidainicialmasivadeaudios', shell: true});

  workerProcess.stdout.on('data', (data) => {
    console.log(`Worker stdout: ${data.toString()}`);
  });

  workerProcess.stderr.on('data', (data) => {
    console.error(`Worker stderr: ${data.toString()}`);
  });

  workerProcess.on('error', (err) => {
    console.error('Failed to start worker process:', err);
  });

  workerProcess.on('close', (code, signal) => {
    if (code !== null) {
      console.log(`Worker exited with code ${code}`);
    } else {
      console.log(`Worker was killed by signal: ${signal}`);
    }
    workerProcess = null;
  });
};

const stopWorker = async () => {
  if (!workerProcess) {
    console.log('No worker to stop');
    return;
  }

  console.log("Stopping worker...");
  treeKill(workerProcess.pid, 'SIGTERM', (err) => {
    if (err) {
      console.error('Failed to stop worker process:', err);
    }
  });

  // Esperar a que el proceso termine
  await new Promise((resolve) => {
    workerProcess.on('close', () => {
      console.log('Worker process closed');
      resolve();
    });
  });

  workerProcess = null;
};


export const MassiveUploadCronTask =
  new CronJob(
    process.env.CRON_TIME_PATTERN_MASSIVE_UPLOAD,
    async () => {
      try {
        startWorker();
        // Dar tiempo al servidor para iniciar antes de hacer la solicitud
        await new Promise(resolve => setTimeout(resolve, 5000));
        await ExecMassiveUpload();
      } catch (error) {
        console.error('Error during massive upload execution:', error);
      } finally {
        await stopWorker();
      }
    },
    true, // start
    'America/Costa_Rica' // timeZone
  );