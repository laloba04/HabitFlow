# HabitFlow App 📱

App móvil híbrida para seguimiento de hábitos y control de gastos.

![Ionic](https://img.shields.io/badge/Ionic-7-3880FF?logo=ionic)
![Angular](https://img.shields.io/badge/Angular-17-DD0031?logo=angular)
![Firebase](https://img.shields.io/badge/Firebase-Auth-FFCA28?logo=firebase)

## 🎯 Descripción

Aplicación móvil híbrida construida con Ionic y Angular. Funciona en iOS, Android y Web.

## ✨ Funcionalidades

- 🔐 Autenticación con Firebase
- 📋 CRUD de hábitos con rachas
- 💰 Registro de gastos por categoría
- 📊 Dashboard con estadísticas
- 🌙 Modo oscuro

## 🛠️ Tech Stack

| Tecnología | Uso |
|------------|-----|
| Ionic 7 | Framework UI |
| Angular 17 | Framework |
| Capacitor 5 | Native bridge |
| Firebase Auth | Autenticación |

## 📁 Estructura

```
habitflow-app/
├── src/
│   ├── app/
│   │   ├── pages/
│   │   ├── services/
│   │   └── guards/
│   └── environments/
└── capacitor.config.ts
```

## 🚀 Instalación

```bash
npm install
ionic serve          # Desarrollo
ionic build          # Producción
npx cap add ios
npx cap add android
```

## 👩‍💻 Autora

**María Bravo Angulo**
