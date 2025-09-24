describe('Cart page', function () {
    beforeEach(function () {
        var testProducts = [
            {
                id: 1,
                title: 'Test Product 1',
                price: 100,
                description: 'Test Description 1',
                category: 'electronics',
                image: 'https://fakestoreapi.com/img/81fPKd-2AYL._AC_SL1500_.jpg',
                rating: { rate: 4.5, count: 100 },
            },
            {
                id: 2,
                title: 'Test Product 2',
                price: 200,
                description: 'Test Description 2',
                category: 'jewelery',
                image: 'https://fakestoreapi.com/img/71pWzhdJNwL._AC_UL640_QL65_ML3_.jpg',
                rating: { rate: 4.0, count: 50 },
            },
        ];
        window.localStorage.setItem('cart', JSON.stringify([
            { product: testProducts[0], quantity: 1 },
            { product: testProducts[1], quantity: 1 },
        ]));
        cy.visit('/cart');
    });
    it('should increase product quantity', function () {
        cy.get('[data-test="plusBtn"]').first().click();
        cy.get('[data-test="quantity"]').first().should('contain', '2');
    });
    it('should decrease', function () {
        cy.get('[data-test="minusBtn"]').first().click();
        cy.get('[data-test="quantity"]').first().should('contain', '1');
    });
    it('should error about empty cart', function () {
        cy.get('[data-test="deleteBtn"]').first().click();
        cy.get('[data-test="deleteBtn"]').last().click();
        cy.get('[data-test="emptyCartMess"]').should('be.visible').and('contain', 'Ваша корзина пуста');
    });
});
