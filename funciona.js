const API_URL = "https://backendtrabalhofaculdade1-yc39ho1r.b4a.run/produtos";
let editandoId = null;


document.addEventListener("DOMContentLoaded", carregarProdutos);

document.getElementById("adicionar").addEventListener("click", adicionarProduto);
document.getElementById("atualizar").addEventListener("click", atualizarProduto);
document.getElementById("cancelar").addEventListener("click", cancelarEdicao);

async function carregarProdutos() {
    try {
        const response = await fetch(API_URL, { cache: "no-store" });
        if (!response.ok) throw new Error("Erro ao carregar produtos");

        const produtos = await response.json();
        console.log("Produtos carregados:", produtos); 

        const tabela = document.getElementById("lista-produtos");
        tabela.innerHTML = "";

        produtos.forEach(produto => {
            const row = document.createElement("tr");
            row.innerHTML = `
                <td>${produto.id}</td>
                <td>${produto.nome}</td>
                <td>R$ ${produto.preco.toFixed(2)}</td>
                <td>
                    <button class="editar" onclick="editarProduto('${produto.id}', '${produto.nome}', '${produto.preco}')">Editar</button>
                    <button class="excluir" onclick="excluirProduto('${produto.id}')">Excluir</button>
                </td>
            `;
            tabela.appendChild(row);
        });

    } catch (error) {
        console.error("Erro ao carregar produtos:", error);
        alert("Falha ao carregar produtos. Tente novamente.");
    }
}


async function adicionarProduto() {
    const nome = document.getElementById("nome").value;
    const preco = parseFloat(document.getElementById("preco").value); 

    if (!nome || isNaN(preco)) {
        alert("Preencha os campos corretamente!");
        return;
    }

    
    const response = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nome, preco })
    });

    if (!response.ok) {
        const errorMsg = await response.text();
        console.error("Erro ao cadastrar produto:", errorMsg);
        alert("Erro ao cadastrar produto! Verifique o console.");
        return;
    }

    
    document.getElementById("nome").value = "";
    document.getElementById("preco").value = "";

    
    carregarProdutos();
}



async function editarProduto(id, nome, preco) {
    document.getElementById("nome").value = nome;
    document.getElementById("preco").value = preco;
    editandoId = id;

    document.getElementById("adicionar").style.display = "none";
    document.getElementById("atualizar").style.display = "inline-block";
    document.getElementById("cancelar").style.display = "inline-block";
}

async function atualizarProduto() {
    if (!editandoId) {
        alert("Erro: Nenhum produto selecionado para edição!");
        return;
    }

    const nome = document.getElementById("nome").value;
    const preco = parseFloat(document.getElementById("preco").value); 

    if (!nome || isNaN(preco)) {
        alert("Preencha todos os campos corretamente!");
        return;
    }

    const response = await fetch(`${API_URL}/${editandoId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nome, preco })
    });

    if (!response.ok) {
        const errorData = await response.json();
        alert("Erro ao atualizar produto: " + errorData.error);
        return;
    }

    cancelarEdicao();
    carregarProdutos(); 
}



function cancelarEdicao() {
    document.getElementById("nome").value = "";
    document.getElementById("preco").value = "";
    editandoId = null;

    document.getElementById("adicionar").style.display = "inline-block";
    document.getElementById("atualizar").style.display = "none";
    document.getElementById("cancelar").style.display = "none";
}

async function excluirProduto(id) {
    if (confirm("Tem certeza que deseja excluir este produto?")) {
        const response = await fetch(`${API_URL}/${id}`, { method: "DELETE" });
        if (response.ok) {
            carregarProdutos(); 
        } else {
            alert("Erro ao excluir produto.");
        }
    }
}


document.getElementById("ver-estoque").addEventListener("click", async () => {
    const tabela = document.querySelector("table"); 
    if (tabela.style.display === "none" || tabela.style.display === "") {
        await carregarProdutos(); 
        tabela.style.display = "table"; 
    } else {
        tabela.style.display = "none"; 
    }
});
