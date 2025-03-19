#!/bin/bash

echo "remove tsconfig.tsbuildinfo:"
rm -r "tsconfig.tsbuildinfo"

echo "remove node_modules:"
rm -r "node_modules"

pnpm store prune

pnpm install
