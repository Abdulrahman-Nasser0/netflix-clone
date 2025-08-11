/* global Cypress, cy */
// Custom Cypress commands for this project

Cypress.Commands.add('seedAuth', (overrides = {}) => {
	const user = {
		id: 1,
		name: 'Test User',
		email: 'user@example.com',
		phone: '+111111111',
		bio: 'Hello',
		created_at: '2025-08-01T12:00:00Z',
		updated_at: '2025-08-09T12:00:00Z',
		...overrides,
	}
	window.localStorage.setItem('auth_token', 'test-token')
	window.localStorage.setItem('user', JSON.stringify(user))
})

Cypress.Commands.add('clearAuth', () => {
	window.localStorage.removeItem('auth_token')
	window.localStorage.removeItem('user')
})

Cypress.Commands.add('mockBackend', (routes = {}) => {
	const base = Cypress.env('backendUrl')
	// Login
	cy.intercept('POST', `${base}/login`, (req) => {
		req.reply({
			statusCode: 200,
			body: { Token: 'mock-token', User: { id: 1, name: 'Test User', email: req.body.email } },
		})
	}).as('login')

	// Register
	cy.intercept('POST', `${base}/register`, { statusCode: 201, body: { message: 'Registered' } }).as('register')

	// Logout
	cy.intercept('POST', `${base}/logout`, { statusCode: 200, body: { message: 'Logged out' } }).as('logout')

	// Favorites endpoints used by MyListContext
	cy.intercept('GET', `${base}/retrieve`, { favorites: [] }).as('getFavorites')
	cy.intercept('POST', `${base}/add`, { success: true }).as('addFavorite')
	cy.intercept('DELETE', `${base}/delete/*`, { success: true }).as('deleteFavorite')

	// User endpoints
	cy.intercept('GET', `${base}/me`, { User: { id: 1, name: 'Test User', email: 'user@example.com' } }).as('me')
	cy.intercept('PUT', `${base}/user`, (req) => {
		req.reply({ User: { id: 1, email: 'user@example.com', ...req.body } })
	}).as('updateUser')

	// Allow overrides for special tests
	Object.entries(routes).forEach(([key, handler]) => {
		cy.intercept(handler.method || 'GET', handler.url, handler.response).as(key)
	})
})

Cypress.Commands.add('mockTmdb', () => {
	const origin = Cypress.env('tmdbOrigin')
	cy.intercept('GET', `${origin}/3/**`, (req) => {
		// Return minimal shape expected by UI
		if (req.url.includes('/trending')) {
			req.reply({ results: [
				{ id: 100, title: 'Trending Movie', backdrop_path: '/b.jpg', poster_path: '/p.jpg' },
			] })
			return
		}
		if (req.url.includes('/discover') || req.url.includes('/top_rated')) {
			req.reply({ results: [
				{ id: 200, title: 'List Movie', backdrop_path: '/b2.jpg', poster_path: '/p2.jpg' },
			] })
			return
		}
		if (/\/movie\/(\d+)$/.test(req.url) || /\/tv\/(\d+)$/.test(req.url)) {
			req.reply({ id: 100, title: 'Detail', genres: [{ id:1, name:'Action'}], runtime: 123, overview: 'Test' })
			return
		}
		if (req.url.includes('/credits')) {
			req.reply({ cast: [{ id: 1, name: 'Actor', character: 'Hero', profile_path: '/c.jpg' }] })
			return
		}
		if (req.url.includes('/videos')) {
			req.reply({ results: [{ id: 't1', key: 'abcd', type: 'Trailer' }] })
			return
		}
		if (req.url.includes('/similar')) {
			req.reply({ results: [{ id: 300, title: 'Similar' }] })
			return
		}
		// Default
		req.reply({ results: [] })
	}).as('tmdb')
})

// JS file, no TypeScript declarations here