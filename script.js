const produto = document.getElementById("produto");
const quantidade = document.getElementById("quantidade");
const btnAdicionar = document.getElementById("btnAdicionar");
const listaProdutos = document.getElementById("listaProdutos");
const btnLimpar = document.getElementById("btnLimpar");
const pesquisa = document.getElementById("pesquisa");
const totalCompra = document.getElementById("totalCompra");


// ===============================
// CARREGAR PRODUTOS SALVOS
// ===============================

let produtos = JSON.parse(localStorage.getItem("listaCompras")) || [];

mostrarProdutos();
calcularTotal();


// ===============================
// ADICIONAR PRODUTO
// ===============================

btnAdicionar.addEventListener("click", function () {

    const nomeProduto = produto.value.trim();
    const qtdProduto = quantidade.value;

    // Verifica se o produto foi preenchido
    if (nomeProduto === "") {
        alert("Digite o nome do produto!");
        return;
    }

    // Verifica se o produto já existe
    const produtoJaExiste = produtos.some(function (produto) {

        return produto.nome.toLowerCase() === nomeProduto.toLowerCase();

    });

    if (produtoJaExiste) {
        alert("O item já foi adicionado!");
        return;
    }

    // Cria o novo produto
    const novoProduto = {
        nome: nomeProduto,
        quantidade: qtdProduto,
        preco: 0,
        comprado: false
    };

    produtos.push(novoProduto);

    salvarProdutos();

    mostrarProdutos();

    calcularTotal();

    produto.value = "";
    quantidade.value = 1;

    produto.focus();

});


// ===============================
// MOSTRAR PRODUTOS
// ===============================

function mostrarProdutos(filtro = "") {

    listaProdutos.innerHTML = "";

    const produtosFiltrados = produtos.filter(function (produto) {

        return produto.nome
            .toLowerCase()
            .includes(filtro.toLowerCase());

    });


    if (produtosFiltrados.length === 0) {

        if (filtro === "") {

            listaProdutos.innerHTML = `
                <p class="lista-vazia">
                    Sua lista está vazia.
                </p>
            `;

        } else {

            listaProdutos.innerHTML = `
                <p class="lista-vazia">
                    Nenhum produto encontrado.
                </p>
            `;

        }

        return;
    }


    produtosFiltrados.forEach(function (produto) {

        const index = produtos.indexOf(produto);

        const item = document.createElement("div");

        item.classList.add("item");


        if (produto.comprado) {
            item.classList.add("produto-comprado");
        }


        const quantidadeProduto = Number(produto.quantidade);

        const preco = Number(produto.preco || 0);

        const subtotal = quantidadeProduto * preco;


        item.innerHTML = `

            <label class="produto-info">

                <input
                    type="checkbox"
                    class="checkbox-produto"
                    data-index="${index}"
                    ${produto.comprado ? "checked" : ""}
                >

                <span class="nome-produto">
                    ${produto.nome}
                </span>

            </label>


            <strong class="quantidade-produto">
                ${quantidadeProduto} un.
            </strong>


            <div class="preco-area">

                <input
                    type="text"
                    class="preco-produto"
                    data-index="${index}"
                    value="${produto.preco ? produto.preco.toString().replace(".", ",") : ""}"
                    placeholder="Preço"
                    inputmode="decimal"
                >

                <small class="subtotal-produto">
                    Subtotal:
                    ${subtotal.toLocaleString("pt-BR", {
                        style: "currency",
                        currency: "BRL"
                    })}
                </small>

            </div>


            <button
                type="button"
                class="btn-excluir"
                data-index="${index}"
                aria-label="Excluir produto"
            >
                🗑️
            </button>

        `;


        listaProdutos.appendChild(item);

    });

}


// ===============================
// CLIQUE NOS PRODUTOS
// ===============================

listaProdutos.addEventListener("click", function (event) {

    // ===============================
    // EXCLUIR PRODUTO
    // ===============================

    if (event.target.classList.contains("btn-excluir")) {

        const index = event.target.dataset.index;

        produtos.splice(index, 1);

        salvarProdutos();

        mostrarProdutos(pesquisa.value);

        calcularTotal();

        return;
    }

});


// ===============================
// MARCAR / DESMARCAR PRODUTO
// ===============================

listaProdutos.addEventListener("change", function (event) {

    if (event.target.classList.contains("checkbox-produto")) {

        const index = event.target.dataset.index;

        produtos[index].comprado = event.target.checked;

        salvarProdutos();

        mostrarProdutos(pesquisa.value);

        calcularTotal();
    }

});


// ===============================
// SALVAR NO LOCALSTORAGE
// ===============================

function salvarProdutos() {

    localStorage.setItem(
        "listaCompras",
        JSON.stringify(produtos)
    );

}


// ===============================
// LIMPAR TODA A LISTA
// ===============================

btnLimpar.addEventListener("click", function () {

    if (produtos.length === 0) {

        alert("A lista já está vazia!");

        return;
    }


    const confirmar = confirm(
        "Tem certeza que deseja limpar toda a lista?"
    );


    if (!confirmar) {
        return;
    }


    produtos = [];

    salvarProdutos();

    mostrarProdutos();

    calcularTotal();

});


// ===============================
// PESQUISAR PRODUTO
// ===============================

pesquisa.addEventListener("input", function () {

    const textoPesquisa = pesquisa.value;

    mostrarProdutos(textoPesquisa);

});


// ===============================
// ALTERAR PREÇO
// ===============================

listaProdutos.addEventListener("input", function (event) {

    if (event.target.classList.contains("preco-produto")) {

        const index = event.target.dataset.index;

        const valorDigitado = event.target.value;

        const valorNumerico = Number(
            valorDigitado.replace(",", ".")
        );


        produtos[index].preco = isNaN(valorNumerico)
            ? 0
            : valorNumerico;


        salvarProdutos();

        calcularTotal();


        const quantidadeProduto =
            Number(produtos[index].quantidade);


        const subtotal =
            quantidadeProduto * produtos[index].preco;


        const subtotalElemento =
            event.target.parentElement.querySelector(
                ".subtotal-produto"
            );


        subtotalElemento.textContent =
            "Subtotal: " +
            subtotal.toLocaleString("pt-BR", {
                style: "currency",
                currency: "BRL"
            });

    }

});


// ===============================
// CALCULAR TOTAL
// ===============================

function calcularTotal() {

    let total = 0;


    produtos.forEach(function (produto) {

        const quantidadeProduto =
            Number(produto.quantidade);

        const preco =
            Number(produto.preco || 0);


        total += quantidadeProduto * preco;

    });


    totalCompra.textContent =
        total.toLocaleString("pt-BR", {
            style: "currency",
            currency: "BRL"
        });

}