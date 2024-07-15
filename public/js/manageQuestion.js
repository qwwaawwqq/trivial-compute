$(document).ready(function() {
    // Load categories from server
    function loadCategories() {
        fetch('/readAllCategories')
            .then(response => response.json())
            .then(categories => {
                $('#category-table-body').empty();
                categories.forEach(category => {
                    $('#category-table-body').append(`<tr id="${category.id}"><td>${category.name}</td></tr>`);
                });
            })
            .catch(error => console.error('Error loading categories:', error));
    }

    loadCategories();

    // Add new category
    $('#add-category-btn').click(function() {
        let newCategory = $('#new-category').val();
        if(newCategory) {
            fetch('/createNewCategory', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ categoryName: newCategory, creatorName: 'Admin' }) // Replace 'Admin' with actual creator name if needed
            })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    $('#category-table-body').append(`<tr id="${data.id}"><td>${newCategory}</td></tr>`);
                    $('#new-category').val('');
                } else {
                    console.error('Error adding category:', data.error);
                }
            })
            .catch(error => console.error('Error adding category:', error));
        } else {
            alert("Please enter a category name.");
        }
    });

    // Rename selected category
    $('#rename-category-btn').click(function() {
        let selectedRow = $('tr.table-warning');
        let newCategoryName = $('#rename-category').val();
        if(selectedRow.length && newCategoryName) {
            let categoryId = selectedRow.attr('id');
            fetch('/updateCategory', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ categoryId: categoryId, newName: newCategoryName })
            })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    selectedRow.find('td').text(newCategoryName);
                    $('#rename-category').val('');
                } else {
                    console.error('Error renaming category:', data.error);
                }
            })
            .catch(error => console.error('Error renaming category:', error));
        } else {
            alert("Please select a category and enter a new name.");
        }
    });

    // Delete selected category
    $('.btn-danger').click(function() {
        let selectedRow = $('tr.table-warning');
        if(selectedRow.length) {
            let categoryId = selectedRow.attr('id');
            fetch('/deleteCategory', {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ categoryId: categoryId })
            })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    selectedRow.remove();
                } else {
                    console.error('Error deleting category:', data.error);
                }
            })
            .catch(error => console.error('Error deleting category:', error));
        } else {
            alert("Please select a category to delete.");
        }
    });

    // Highlight selected row
    $('table tbody').on('click', 'tr', function() {
        $('tr').removeClass('table-warning');
        $(this).addClass('table-warning');
    });
});
