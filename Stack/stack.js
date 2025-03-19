document.addEventListener("DOMContentLoaded", function () {
    loadStackData();
});

function loadStackData() {
    fetch("/Data/stack.json") // Абсолютный путь
        .then(response => {
            if (!response.ok) {
                throw new Error(`Ошибка загрузки JSON: ${response.statusText}`);
            }
            return response.json();
        })
        .then(data => {
            console.log("Загруженные данные:", data);
            renderStack(data);
        })
        .catch(error => console.error("Ошибка загрузки стека:", error));
}

function renderStack(data) {
    const container = document.getElementById("stack-container");
    if (!container) {
        console.error("Элемент #stack-container не найден.");
        return;
    }

    container.innerHTML = ""; // Очищаем перед рендерингом

    if (!data.stack || !Array.isArray(data.stack)) {
        console.error("Неверный формат JSON.");
        return;
    }

    data.stack.forEach(category => {
        if (!category.category || !Array.isArray(category.items)) {
            console.warn("Пропущена категория или отсутствуют элементы:", category);
            return;
        }

        const categoryDiv = document.createElement("div");
        categoryDiv.className = "stack-category";

        const title = document.createElement("h3");
        title.textContent = category.category;
        categoryDiv.appendChild(title);

        const itemsList = document.createElement("div");
        itemsList.className = "stack-items";

        category.items.forEach(item => {
            if (!item.name) return; // Поле name обязательно

            const itemDiv = document.createElement("div");
            itemDiv.className = "stack-item";

            if (item.icon && item.icon.trim() !== "") {
                const icon = document.createElement("span");
                icon.className = "stack-icon";
                icon.textContent = item.icon;
                itemDiv.appendChild(icon);
            }

            const name = document.createElement("span");
            name.textContent = item.name;
            itemDiv.appendChild(name);

            itemsList.appendChild(itemDiv);
        });

        categoryDiv.appendChild(itemsList);
        container.appendChild(categoryDiv);
    });
}