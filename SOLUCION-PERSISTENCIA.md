# 🔧 Solución: Persistencia de Sesión WhatsApp en Docker

## 📋 Problemas Solucionados

1. ✅ **Sesión de WhatsApp no persiste** al reiniciar contenedores
2. ✅ **Permisos de directorios** `/data` y `/db` configurados correctamente

---

## 🚀 Instrucciones de Uso

### 1. Configurar Permisos (IMPORTANTE - Hacer antes de iniciar)

Antes de levantar los contenedores por primera vez o si tienes problemas de persistencia:

```bash
./fix-permissions.sh
```

Este script asegura que Docker tenga permisos para escribir en los directorios `data/` y `db/`.

### 2. Reconstruir Contenedor (Solo primera vez o después de cambios)

```bash
npm run docker:build
```

O manualmente:

```bash
docker compose build
```

### 3. Iniciar el Bot

```bash
npm run docker:up
```

O manualmente:

```bash
docker compose up -d
```

### 4. Ver Logs y Escanear QR

```bash
npm run docker:logs
```

Escanea el código QR con WhatsApp para autenticar.

### 5. Verificar Persistencia

Después de autenticar con WhatsApp:

```bash
# Ver archivos de sesión guardados
ls -la ./data/

# Reiniciar contenedor
docker compose restart

# Ver logs - NO debería pedir QR de nuevo
docker compose logs -f bot_sorteo
```

✅ Si la sesión persiste correctamente, verás `✅ Cliente listo` sin mostrar un nuevo QR.

---
