# Player Routes

The frontend application for [Player Routes](https://playerroutes.com), a football playbook builder designed for coaches to create, organize, and manage football plays.

Player Routes allows coaches to build visual plays, manage offensive formations, maintain team rosters, organize playbooks, and manage their subscriptions.

## Tech Stack

* **Vue 3**
* **TypeScript**
* **Pinia**
* **Vite**
* **Vue Router**
* **HTML Canvas**
* **Stripe**
* **CSS / SCSS**
* **Vercel**

## Features

### Play Designer

* Visual football field and play creation
* Player positioning
* Pass, Run, and Special play types
* Multiple stroke styles for play routes
* Custom route colors and thickness
* Play editing and deletion
* Offensive and defensive formation guides
* Playbook organization and sorting
* Favorite plays

### Team Management

* Coach registration and authentication
* Team profiles
* Player roster management
* Player positions
* Player login
* Profile management

### Authentication

* JWT-based authentication
* Coach and player login
* Guest access
* Protected application routes
* Persistent authentication state using Pinia

### Subscriptions

* Stripe subscription integration
* Coach and Team plans
* Subscription management
* Stripe Customer Portal integration
* Subscription status handling

## Application Architecture

The application uses Vue 3 with TypeScript and separates reusable application logic into composables and Pinia stores.

```text
src/
├── components/
├── composables/
├── router/
├── stores/
├── views/
└── ...
```

Application state is managed with Pinia, while reusable functionality and application logic are extracted into composables to keep components focused on presentation and interaction.

## Backend

Player Routes uses a separate REST API for authentication, user management, roster management, playbooks, and subscription functionality.

**Backend repository:**
https://github.com/n-scovell/PlayRouteBack

## Deployment

The production application is deployed on Vercel.

**Live application:**
https://playerroutes.com

## Project

Player Routes is a personal product project built from the ground up as a production-oriented SaaS application.

The project covers the full application stack, including frontend development, API integration, authentication, database-backed features, subscription billing, and deployment.
