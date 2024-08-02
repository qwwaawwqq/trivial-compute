$(document).ready(function () {
    // Load all categories on page load
    loadCategories();
    bindToControlButtons();
});

function bindToControlButtons() {
    $('#add-category-btn').on('click', addNewCategory);
    $('#rename-category-btn').on('click', renameCategory); // Added this line
    $('.btn-danger').on('click', deleteCategory); // Added this line
}

// Add new category
function addNewCategory() {
    let newCategory = $('#new-category').val();
    if (newCategory) {
        $.ajax({
            url: '/api/createNewCategory',
            method: 'PUT',
            data: JSON.stringify({ categoryName: newCategory, creatorName: 'CurrentUser' }),
            contentType: 'application/json',
            success: function (result) {
                $('#new-category').val('');
                $('table tbody').append(`<tr><td>${newCategory}</td></tr>`);
            },
            error: function (xhr, status, error) {
                alert("Error adding category: " + error);
            }
        })
    } else {
        alert("Please enter a category name.");
    }
}

// Rename selected category
function renameCategory() {
    let selectedRow = $('tr.table-warning');
    let newCategoryName = $('#rename-category').val();
    let oldCategoryName = selectedRow.find('td').text();
    if (selectedRow.length && newCategoryName) {
        $.ajax({
            url: '/api/updateCategory', // You'll need to add this endpoint to your app.js
            method: 'PUT',
            data: JSON.stringify({ oldName: oldCategoryName, newName: newCategoryName }),
            contentType: 'application/json',
            success: function (result) {
                $('#rename-category').val('');
            },
            error: function (xhr, status, error) {
                alert("Error renaming category: " + error);
            }
        });
    } else {
        alert("Please select a category and enter a new name.");
    }
}

// Delete selected category
function deleteCategory() {
    let selectedRow = $('tr.table-warning');
    let categoryName = selectedRow.find('td').text();
    if (selectedRow.length) {
        $.ajax({
            url: '/api/deleteCategory', // Fixed the double slash issue
            method: 'DELETE',
            data: JSON.stringify({ categoryName: categoryName }),
            contentType: 'application/json',
            success: function (result) {
            },
            error: function (xhr, status, error) {
                alert("Error deleting category: " + error);
            }
        });
    } else {
        alert("Please select a category to delete.");
    }
}

// Highlight selected row
$('table tbody').on('click', 'tr', function () {
    $('tr').removeClass('table-warning');
    $(this).addClass('table-warning');
});

// Function to load all categories
function loadCategories() {
    $.ajax({
        url: '/api/readAllCategories',
        method: 'GET',
        success: function (categories) {
            $('table tbody').empty();
            categories.forEach(function (category) {
                $('table tbody').append(`<tr><td>${category}</td></tr>`);
            });
        },
        error: function (xhr, status, error) {
            alert("Error loading categories: " + error);
        }
    });
}
