import * as fs from 'fs';
import { stringify } from 'csv-stringify/sync';

// I need the EXERCISES and INITIAL_TRAINING_PLANS data
// Let's extract it from page.tsx by stripping imports and react stuff
