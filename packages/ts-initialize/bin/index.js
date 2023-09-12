#!/usr/bin/env node
import { bin } from "../lib/bin.js";

process.exitCode = await bin(process.argv.slice(2), process.cwd());
