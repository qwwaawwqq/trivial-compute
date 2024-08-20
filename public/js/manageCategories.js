$(document).ready(function () {
    $.ajax({
        url: '/api/checkAuth',
        method: 'POST',
        data: JSON.stringify({ uid: sessionStorage.getItem('uid') }),
        contentType: 'application/json',
        success: function (result) {
            if (!result) {
                window.location.href = "./index.html";
            } else {
                loadCategories();
                bindToControlButtons();
            }
        }
    })
    // Load categories from the server and populate the table

    // Bind event listeners to control buttons

});

/**
 * Bind event listeners to control buttons
 */
function bindToControlButtons() {
    // Bind click event to add category button
    $('#add-category-btn').on('click', addNewCategory);
    // Bind click event to rename category button
    $('#rename-category-btn').on('click', renameCategory);
    // Bind click event to delete category buttons
    $('.btn-danger').on('click', deleteCategory);
}

/**
 * Add a new category
 */
function addNewCategory() {
    // Get the new category name from the input field
    let newCategory = $('#new-category').val();
    if (newCategory) {
        // Send a PUT request to the server to create a new category
        $.ajax({
            url: '/api/createNewCategory',
            method: 'PUT',
            data: JSON.stringify({ categoryName: newCategory, creatorName: 'CurrentUser' }),
            contentType: 'application/json',
            success: function (result) {
                console.log("Server response:", result);
                // Reload the categories from the server
                loadCategories();
            },
            error: function (xhr, status, error) {
                console.error("Error details:", xhr.responseText);
                alert("Error adding category: " + xhr.responseText);
            }
        });
    } else {
        alert("Please enter a category name.");
    }
}

/**
 * Rename a category
 */
function renameCategory() {
    // Get the selected row and new category name
    let selectedRow = $('tr.table-warning');
    let newCategoryName = $('#rename-category').val();
    let oldCategoryName = selectedRow.find('td').text();

    console.log("New Category Name:", newCategoryName);
    console.log("Old Category Name:", oldCategoryName);
    if (selectedRow.length && newCategoryName) {
        // Send a PUT request to the server to rename the category
        $.ajax({
            url: '/api/updateCategory',
            method: 'PUT',
            data: JSON.stringify({ oldName: oldCategoryName, newName: newCategoryName }),
            contentType: 'application/json',
            dataType: 'json',
            success: function (result) {
                console.log(result)
                if (result.success) {
                    $('#rename-category').val('');
                    // Reload the categories from the server
                    loadCategories();
                } else {
                    alert("Error renaming category: " + result.error);
                }
            },
            error: function (xhr, status, error) {
                alert("Error renaming category: " + error);
            }
        });
    } else {
        alert("Please select a category and enter a new name.");
    }
}

/**
 * Delete a category
 */
function deleteCategory() {
    // Get the selected row and category name
    let selectedRow = $('tr.table-warning');
    let categoryName = selectedRow.find('td').text();
    if (selectedRow.length) {
        // Send a DELETE request to the server to delete the category
        $.ajax({
            url: '/api/deleteCategory',
            method: 'DELETE',
            data: JSON.stringify({ categoryName: categoryName }),
            contentType: 'application/json',
            dataType: 'json',
            success: function (result) {
                if (result.success) {
                    // Reload the categories from the server
                    loadCategories();
                } else {
                    alert("Error deleting category: " + result.error);
                }
            },
            error: function (xhr, status, error) {
                alert("Error deleting category: " + error);
            }
        });
    } else {
        alert("Please select a category to delete.");
    }
}

/**
 * Bind click event to table rows
 */
function bindRowClickEvent() {
    $(document).off('click', 'table tbody tr').on('click', 'table tbody tr', function () {
        $('table tbody tr').removeClass('table-warning');
        $(this).addClass('table-warning');
        let selectedCategory = $(this).find('td:first').text();
        console.log('Selected category:', selectedCategory);
    });
}

/**
 * Load categories from the server and populate the table
 */
function loadCategories() {
    $.ajax({
        url: '/api/readAllCategories',
        method: 'GET',
        dataType: 'json',
        success: function (response) {
            console.log("Server response:", response);  // Log the entire response
            let categories = response;

            // Check if the response is wrapped in a data property
            if (response.data && Array.isArray(response.data)) {
                categories = response.data;
            }

            if (Array.isArray(categories)) {
                $('table tbody').empty();
                categories.forEach(function (category) {
                    $('table tbody').append(`<tr id=${category}><td>${category}</td></tr>`);
                });
                bindRowClickEvent();
            } else {
                console.error("Invalid data format received:", categories);
                alert("Error: Invalid data format received from server.");
            }
        },
        error: function (xhr, status, error) {
            console.error("AJAX error:", status, error);
            console.error("Response Text:", xhr.responseText);
            if (xhr.status === 0) {
                alert("Unable to connect to the server. Please ensure the server is running and try again.");
            } else {
                alert("Error loading categories. Please check the console for more details.");
            }
        },
        timeout: 5000  // Set a timeout of 5 seconds
    });
}