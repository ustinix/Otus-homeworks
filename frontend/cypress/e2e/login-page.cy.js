describe('Login page', function () {
    beforeEach(function () {
        cy.visit('/login');
    });
    it('should login user successfully', function () {
        cy.get('[data-test="username"]').type('Ksenia');
        cy.get('[data-test="email"]').type('user@example.com');
        cy.get('[data-test="password"]').type('Password123@');
        cy.get('[data-test="submit-btn"]').click();
        cy.url().should('include', '/');
        cy.get('[data-test="user-profile"]').should('be.visible').and('contain', 'Ksenia');
    });
    it('should login admin successfully', function () {
        cy.get('[data-test="username"]').type('AdminUser');
        cy.get('[data-test="email"]').type('admin@example.com');
        cy.get('[data-test="password"]').type('Password123@');
        cy.get('[data-test="admin"]').find('input[type="checkbox"]').click({ force: true });
        cy.get('[data-test="submit-btn"]').click();
        cy.url().should('include', '/admin');
        cy.get('[data-test="user-profile"]').should('be.visible').and('contain', 'AdminUser');
    });
    it('show validation error', function () {
        cy.get('[data-test="email"]').type('invalid-email');
        cy.get('[data-test="email"]')
            .find('.v-messages__message')
            .should('be.visible')
            .and('contain', 'Введите корректный email');
    });
    it('reset data', function () {
        cy.get('[data-test="username"]').type('AdminUser');
        cy.get('[data-test="email"]').type('admin@example.com');
        cy.get('[data-test="password"]').type('Password123@');
        cy.get('[data-test="admin"]').find('input[type="checkbox"]').click({ force: true });
        cy.get('[data-test="reset-btn"]').click();
        cy.get('[data-test="username"]').should('have.value', '');
        cy.get('[data-test="email"]').should('have.value', '');
        cy.get('[data-test="password"]').should('have.value', '');
        cy.get('[data-test="admin"]').find('input[type="checkbox"]').should('not.be.checked');
    });
});
