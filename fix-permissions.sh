#!/bin/bash

# Script para corregir permisos de directorios data y db
# Asegura que Docker pueda leer y escribir en estos directorios

set -e

PROJECT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
DATA_DIR="$PROJECT_DIR/data"
DB_DIR="$PROJECT_DIR/db"

echo "Corrigiendo permisos de directorios..."

# Crear directorios si no existen
mkdir -p "$DATA_DIR" "$DB_DIR"

# Establecer permisos adecuados (lectura, escritura y ejecución para todos)
# Esto permite que el contenedor Docker pueda escribir en estos directorios
chmod -R 777 "$DATA_DIR"
chmod -R 777 "$DB_DIR"

