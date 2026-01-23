# Saegus Task Manager

Application de gestion de tâches moderne, développée dans le cadre d’un test technique, avec une interface soignée, une architecture claire et une intégration d’IA pour fournir des insights intelligents sur les listes et les tâches.

---

## ✨ Fonctionnalités

### 🔐 Authentification
- Inscription et connexion utilisateur
- Authentification via JWT
- Déconnexion sécurisée

### 📋 Gestion des listes
- Création et suppression de listes
- Sélection d’une liste active
- Sidebar gauche rétractable
- Scroll interne si contenu trop long

### ✅ Gestion des tâches
- Création, modification et suppression de tâches
- Toggle **TODO / DONE**
- Affichage / masquage des tâches complétées
- Sélection d’une tâche pour afficher ses détails
- Scroll interne sans modifier la taille des colonnes

### 🧠 IA – Insights
- Analyse globale des listes
- Suggestions et résumés générés par IA
- Rafraîchissement manuel des insights

### 🖥️ UI / UX
- Layout en **3 colonnes fixes** (Listes / Tâches / Détails)
- Sidebars gauche et droite rétractables sans déplacer le contenu central
- Fermeture automatique du panneau de détails si clic hors tâche
- Design moderne avec fond dégradé, glassmorphism et cohérence visuelle

---

## 🧱 Stack technique

### Frontend
- React + TypeScript
- Vite
- Tailwind CSS
- React Router

### Backend
- Node.js
- Express
- TypeScript
- Prisma
- PostgreSQL
- JWT (authentification)

### IA
- Endpoint dédié `/ai`
- Génération de résumés et recommandations (LLM)

---

## 🚀 Installation & lancement

### 1. Cloner le projet

git clone <repo-url>
cd saegus-task-manager

2. Backend

cd backend
npm install
npm run dev
Configurer la base de données et les variables d’environnement (DATABASE_URL, JWT_SECRET, etc.).

3. Frontend
cd frontend
npm install
npm run dev

App accessible sur : http://localhost:5173

Structure du projet :

frontend/
 ├─ components/
 ├─ layouts/
 ├─ pages/
 ├─ assets/
 └─ auth/

backend/
 ├─ routes/
 ├─ middlewares/
 ├─ controllers/
 ├─ prisma/
 └─ utils/


