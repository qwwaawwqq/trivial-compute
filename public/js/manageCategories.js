$(document).ready(function() {
    // Load all categories on page load
    loadCategories();

    // Add new category
    $('#add-category-btn').click(function() {
        let newCategory = $('#new-category').val();
        if(newCategory) {
            $.ajax({
                url: '/createNewCategory',
                method: 'PUT',
                data: JSON.stringify({ categoryName: newCategory, creatorName: 'CurrentUser' }),
                contentType: 'application/json',
                success: function(result) {
                    loadCategories(); // Reload categories after adding
                    $('#new-category').val('');
                },
                error: function(xhr, status, error) {
                    alert("Error adding category: " + error);
                }
            });
        } else {
            alert("Please enter a category name.");
        }
    });

    // Rename selected category
    $('#rename-category-btn').click(function() {
        let selectedRow = $('tr.table-warning');
        let newCategoryName = $('#rename-category').val();
        let oldCategoryName = selectedRow.find('td').text();
        if(selectedRow.length && newCategoryName) {
            $.ajax({
                url: '/updateCategory', // You'll need to add this endpoint to your app.js
                method: 'PUT',
                data: JSON.stringify({ oldName: oldCategoryName, newName: newCategoryName }),
                contentType: 'application/json',
                success: function(result) {
                    loadCategories(); // Reload categories after renaming
                    $('#rename-category').val('');
                },
                error: function(xhr, status, error) {
                    alert("Error renaming category: " + error);
                }
            });
        } else {
            alert("Please select a category and enter a new name.");
        }
    });

    // Delete selected category
    $('.btn-danger').click(function() {
        let selectedRow = $('tr.table-warning');
        let categoryName = selectedRow.find('td').text();
        if(selectedRow.length) {
            $.ajax({
                url: '/deleteCategory', // You'll need to add this endpoint to your app.js
                method: 'DELETE',
                data: JSON.stringify({ categoryName: categoryName }),
                contentType: 'application/json',
                success: function(result) {
                    loadCategories(); // Reload categories after deleting
                },
                error: function(xhr, status, error) {
                    alert("Error deleting category: " + error);
                }
            });
        } else {
            alert("Please select a category to delete.");
        }
    });

    // Highlight selected row
    $('table tbody').on('click', 'tr', function() {
        $('tr').removeClass('table-warning');
        $(this).addClass('table-warning');
    });

    // Function to load all categories
    function loadCategories() {
        $.ajax({
            url: '/readAllCategories',
            method: 'GET',
            success: function(categories) {
                $('table tbody').empty();
                categories.forEach(function(category) {
                    $('table tbody').append(`<tr><td>${category.name}</td></tr>`);
                });
            },
            error: function(xhr, status, error) {
                alert("Error loading categories: " + error);
            }
        });
    }
});