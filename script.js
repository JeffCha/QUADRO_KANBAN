// Quando o DOM (Document Object Model) estiver completamente carregado
document.addEventListener("DOMContentLoaded", () => {
    let sourceColumn; // Variável para armazenar a coluna de origem da tarefa arrastada
    let draggedTask; // Variável para armazenar a tarefa que está sendo arrastada

    // Função para criar uma nova tarefa
    function createTask(text, status) {
        const task = document.createElement("div"); // Cria um elemento <div> para representar a tarefa
        task.className = "task mb-2 alert alert-light"; // Define as classes CSS da tarefa
        task.innerHTML = `
            <span>${text}</span>
            <i class="fas fa-trash trash-icon"></i>
        `; // Define o conteúdo HTML da tarefa, incluindo o nome e o ícone de lixeira
        task.setAttribute("draggable", "true"); // Torna a tarefa arrastável
        task.setAttribute("data-status", status); // Define o status da tarefa usando um atributo de dados

        // Adiciona um ouvinte de evento ao ícone de lixeira para excluir a tarefa
        task.querySelector(".trash-icon").addEventListener("click", () => deleteTask(task));

        // Ouve o evento de arrastar o início da tarefa
        task.addEventListener("dragstart", (e) => {
            e.dataTransfer.setData("text/plain", e.target.textContent); // Define os dados que serão arrastados (o texto da tarefa)
            e.dataTransfer.setData("status", e.target.getAttribute("data-status")); // Define o status da tarefa
            sourceColumn = e.target.parentElement; // Armazena a coluna de origem
            draggedTask = e.target; // Armazena a tarefa arrastada
        });

        // Ouve o evento de arrastar sobre a tarefa
        task.addEventListener("dragover", (e) => {
            e.preventDefault(); // Impede o comportamento padrão de arrastar
        });

        // Ouve o evento de soltar a tarefa
        task.addEventListener("drop", (e) => {
            e.preventDefault(); // Impede o comportamento padrão de soltar
            const targetStatus = e.target.getAttribute("data-status"); // Obtém o status de destino da tarefa

            if (sourceColumn !== e.target.parentElement) {
                // Se a tarefa estiver sendo movida para outra coluna
                draggedTask.setAttribute("data-status", targetStatus); // Atualiza o status da tarefa
                e.target.parentElement.appendChild(draggedTask); // Move a tarefa para a coluna de destino
            } else if (draggedTask !== e.target) {
                // Se a tarefa estiver sendo reordenada na mesma coluna
                e.target.parentElement.insertBefore(draggedTask, e.target); // Reposiciona a tarefa
            }
        });

        const targetColumn = document.getElementById(status); // Obtém a coluna de destino com base no status
        targetColumn.querySelector(".card-body").appendChild(task); // Adiciona a tarefa à coluna de destino
    }

    // Função para excluir uma tarefa
    function deleteTask(task) {
        if (confirm("Tem certeza de que deseja excluir esta tarefa?")) {
            const deletedColumn = document.getElementById("deleted"); // Obtém a coluna "Excluído"
            task.setAttribute("data-status", "deleted"); // Define o status da tarefa como "deleted"
            deletedColumn.querySelector(".card-body").appendChild(task); // Move a tarefa para a coluna "Excluído"
            task.querySelector(".trash-icon").addEventListener("click", () => permanentlyDeleteTask(task)); // Adiciona um ouvinte de evento para excluir permanentemente a tarefa
        }
    }

    // Função para excluir permanentemente uma tarefa da coluna "Excluído"
    function permanentlyDeleteTask(task) {
        if (confirm("Tem certeza de que deseja excluir permanentemente esta tarefa?")) {
            task.remove(); // Remove a tarefa do DOM
        }
    }

    // Obtém todas as colunas de tarefas
    const columns = document.querySelectorAll(".card-body");

    // Adiciona ouvintes de evento para as colunas de tarefas
    columns.forEach((column) => {
        column.addEventListener("dragover", (e) => {
            e.preventDefault(); // Impede o comportamento padrão de arrastar sobre a coluna
        });

        column.addEventListener("drop", (e) => {
            e.preventDefault(); // Impede o comportamento padrão de soltar sobre a coluna
            const data = e.dataTransfer.getData("text/plain"); // Obtém os dados arrastados (nome da tarefa)
            const status = e.dataTransfer.getData("status"); // Obtém o status da tarefa
            const targetStatus = e.target.getAttribute("data-status"); // Obtém o status de destino

            if (status !== targetStatus) {
                draggedTask.querySelector("span").textContent = data; // Atualiza o nome da tarefa
                draggedTask.setAttribute("data-status", targetStatus); // Atualiza o status da tarefa
                column.appendChild(draggedTask); // Move a tarefa para a coluna de destino
            }
        });
    });

    // Obtém o formulário de adição de tarefa e a entrada de nova tarefa
    const taskForm = document.getElementById("taskForm");
    const newTaskInput = document.getElementById("newTask");

    // Adiciona um ouvinte de evento ao formulário para adicionar uma nova tarefa
    taskForm.addEventListener("submit", (e) => {
        e.preventDefault(); // Impede o envio do formulário
        const taskName = newTaskInput.value.trim(); // Obtém o nome da nova tarefa

        if (taskName !== "") {
            createTask(taskName, "todo"); // Cria uma nova tarefa na coluna "A fazer"
            newTaskInput.value = ""; // Limpa a entrada de nova tarefa
        }
    });
});
