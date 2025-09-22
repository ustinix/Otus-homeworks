async function GraphQLProducts() {
  try {
    const response = await fetch('https://api.escuelajs.co/graphql/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query: `
          query {
            products(limit: 50, offset: 0) {
              id
              title
              price
              description
              images
              category {
                id
                name
                image
              }
            }
          }
        `,
      }),
    });

    const data = await response.json();
    console.log('Ответ от GraphQL API:', data);

    if (data.data && data.data.products) {
      console.log(`Получено товаров: ${data.data.products.length}`);
      console.log('Первые 5 товаров:', data.data.products.slice(0, 5));
    } else {
      console.log('Нет данных о товарах в ответе');
    }

    return data;
  } catch (error) {
    console.error('Ошибка:', error);
  }
}

GraphQLProducts();
