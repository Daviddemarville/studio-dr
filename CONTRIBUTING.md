# 🧭 Studio DR — Guide de contribution
### Atomic commits • Micro-checks • Qualité continue

Ce document définit les règles internes de développement pour Studio DR.

---

## 1. 🔍 Micro-Check obligatoire avant chaque commit

```sh
pnpm biome check --write
pnpm tsc --noEmit
```

Si l’un des deux échoue → corriger avant de commit.

---

## 2. 🧱 Atomic Commits

Un commit = une seule intention.

Exemples :
- feat: add Testimonials view
- fix: correct PublicDBRow typing
- refactor: simplify SectionRenderer structure
- chore: cleanup unused imports

---

## 3. 🧽 Règles Biome

- pas de any non justifié  
- pas d’imports inutilisés  
- pas de fonctions inutilisées  
- typage strict obligatoire  
- 0 warning Biome et TS en dev

---

## 4. 🧩 Architecture

### 4.1. Pas de logique métier dans le JSX  
### 4.2. Pas de duplication  
### 4.3. Typage strict obligatoire  
### 4.4. Rendu public séparé : vues spécialisées, fallback générique

---

## 5. 🧪 Checklist avant push

- [ ] build OK  
- [ ] sections dynamiques OK  
- [ ] vues spécialisées OK  
- [ ] aucune erreur console  
- [ ] aucune erreur TS/Biome  

---

## 6. 🌿 Branches & PR

Branches :
```
feature/<nom>
refactor/<nom>
fix/<nom>
```

PR :
- description claire  
- aucun warning TS/Biome  
- build Vercel OK  

---

## 7. 🌱 Philosophie : Slow Down to Go Faster

Micro pause avant validation → énorme gain de stabilité.

---

Fin du document.
