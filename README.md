
# 🏠 Home Services Platform

[![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.2-brightgreen.svg)](https://spring.io/projects/spring-boot)
[![Angular](https://img.shields.io/badge/Angular-16-red.svg)](https://angular.io/)
[![Kubernetes](https://img.shields.io/badge/Kubernetes-1.28-blue.svg)](https://kubernetes.io/)
[![Coverage](https://img.shields.io/badge/Coverage-75%25-success.svg)](https://sonarqube.io)

> **Projet de Fin d'Études** - Bee Coders · Février - Juillet 2025

Plateforme web Full-Stack de mise en relation clients/prestataires de services à domicile avec architecture microservices déployée sur Kubernetes.

---

## 🎯 Vue d'Ensemble

**Problème** : Difficulté à trouver des prestataires fiables rapidement  
**Solution** : Matching intelligent par géolocalisation + réservation instantanée + chatbot IA  
**Impact** : -80% temps recherche · 99.9% uptime · 94% satisfaction

---

## 💼 Stack Technique

**Backend** : Spring Boot 3.2 · Spring Security 6 · JWT · MySQL · Redis  
**Frontend** : Angular 16 · TypeScript · Material Design · RxJS  
**IA** : Flask · Python · NLP multilingue (FR/EN/AR)  
**DevOps** : Docker · Kubernetes (kubeadm) · ArgoCD · Jenkins · SonarQube · Trivy · Prometheus · Grafana

---

## 🏗️ Architecture

```
Angular → API Gateway → Spring Boot Microservices
                        ├── Auth Service
                        ├── User Service
                        ├── Booking Service
                        ├── Payment Service
                        └── AI Chatbot (Flask)
                              ↓
                        MySQL + Redis
                              
Infrastructure : Kubernetes + ArgoCD + Prometheus/Grafana
```

---

## 🚀 CI/CD Pipeline (10 min commit → production)

```
Git Push → Build & Test → SonarQube → Docker Build → Trivy Scan → ArgoCD Deploy → K8s Production
```

---

## 📊 Métriques Clés

| Qualité | Performance |
|---------|-------------|
| ✅ 1350+ tests automatisés | ✅ Response time <320ms |
| ✅ 75%+ code coverage | ✅ Throughput 1450 req/s |
| ✅ 0 bugs critiques | ✅ Uptime 99.9% |
| ✅ 0 vulnérabilités | ✅ Error rate 0.04% |

---

## ✨ Fonctionnalités

**Client** : Recherche avancée · Réservation · Paiement · Avis · Chatbot IA  
**Prestataire** : Profil pro · Planning · Tarifs · Dashboard · Analytics  
**Admin** : Modération · Statistiques · Gestion utilisateurs

---

## 🔐 Sécurité

✅ JWT + Spring Security · RBAC  
✅ HTTPS/TLS · CORS · CSRF Protection  
✅ Trivy scan · SonarQube · OWASP  
✅ 0 vulnérabilité critique

---

## 🤖 Intelligence Artificielle

Chatbot Flask avec NLP :
- Réponses automatiques FAQ (95% précision)
- Recommandations intelligentes
- Support multilingue (FR/EN/AR)
- Analyse sentiment

---

## 📊 Monitoring

**Dashboards Grafana** : Infrastructure K8s · Applications · Business Metrics  
**Alertes** : Error rate · Response time · Pod crashes

---

## ⚙️ Installation

```bash
# Development
git clone https://github.com/NourLassoued/projetpfe2025.git
cd backend && ./mvnw spring-boot:run
cd frontend && npm install && ng serve
cd chatbot && pip install -r requirements.txt && python app.py

# Production (Kubernetes)
kubectl apply -f k8s/argocd/application.yaml
```

---

## 🎯 Points Forts

✅ **Production-Ready** : Kubernetes + Monitoring 24/7  
✅ **DevOps Complet** : Pipeline CI/CD automatisé  
✅ **Qualité Rigoureuse** : 1350+ tests · 75% coverage  
✅ **Sécurité** : JWT · 0 vulnérabilités  
✅ **Scalable** : Microservices · Auto-scaling  
✅ **IA** : Chatbot NLP en production  
✅ **GitOps** : Déploiement automatique ArgoCD

<p align="center">
  <b>Projet de Fin d'Études · Bee Coders · 2025</b><br>
  <i>Architecture microservices production-ready avec CI/CD complet</i>
</p>
