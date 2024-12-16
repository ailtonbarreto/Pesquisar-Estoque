document.addEventListener("DOMContentLoaded", () => {
    const url = "https://api-webstore.onrender.com/estoque";
    const section_data = document.querySelector(".section");
    const filterInput = document.getElementById("filterInput");
    let dadosSalvos = [];

    // Função para carregar os dados da API
    async function Load_Data() {
        try {
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error(`Erro na requisição: ${response.status} - ${response.statusText}`);
            }
            const dados = await response.json();
            console.log("Dados carregados:", dados);
            dadosSalvos = dados;
            load_products();
        } catch (error) {
            console.error("Erro ao carregar dados:", error.message);
        }
    }

    // Função para criar o card de cada produto
    function criarCardProduto(produto) {
        const card = document.createElement("figure");
        card.id = produto.SKU;
        card.classList.add("card");

        const listName = document.createElement("p");
        listName.classList.add("product-name");
        listName.textContent = produto.DESCRICAO;
        card.appendChild(listName);

        const img = document.createElement("img");
        img.src = produto.IMAGEM;
        card.appendChild(img);

        const sku = document.createElement("p");
        sku.classList.add("sku");
        sku.textContent = `SKU: ${produto.SKU}`;
        card.appendChild(sku);

        const stock = document.createElement("p");
        stock.classList.add("estoque");
        stock.textContent = `Estoque: ${produto.ESTOQUE}`;
        card.appendChild(stock);

        return card;
    }

 
    function displayProducts(produtos) {
        section_data.innerHTML = "";
        produtos.forEach(item => {
            const card = criarCardProduto(item);
            section_data.appendChild(card);
        });
    }

    // Função de filtragem em tempo real
    filterInput.addEventListener("input", () => {
        const searchValue = filterInput.value.toLowerCase().trim();

        if (searchValue === "") {
            displayProducts(dadosSalvos);
        } else {

            const regex = new RegExp(searchValue.split('').join('.*'), 'i');

            // Filtra os produtos com base na descrição ou SKU
            const filteredProducts = dadosSalvos.filter(produto => {
                const skuMatch = regex.test(produto.SKU.toString());
                const descriptionMatch = regex.test(produto.DESCRICAO.toLowerCase());
                return skuMatch || descriptionMatch;
            });
            displayProducts(filteredProducts);
        }
    });

    // Função para carregar e exibir os produtos
    async function load_products() {
        if (dadosSalvos.length) {
            displayProducts(dadosSalvos);
        }
    }

    Load_Data();
});
