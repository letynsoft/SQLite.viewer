"use strict";

var currentDatabase = null
var currentTable = null

function init() {
    refreshDbList();
    Api.onError = function(reason) {
        message(reason, true);
    }
}

function message(msg, isError) {
    $.alert(msg, {
        type: isError ? 'danger' : 'success',
        closeTime: 2000,
        position: ['bottom-right', [0, 0.01]],
        animaton: true
    });
}

function refreshDbList() {
    var dbListElem = $('#db-list')
    dbListElem.empty();
    $('#table-list').empty();
    $('#table-data').empty();
    Api.getDbList(function(list) {
        list.forEach(function(database) {
            $('<a href="#" class="list-group-item"/>')
            .text(database)
            .click(function() {
                currentDatabase = database;
                refreshTableList();
            })
            .appendTo(dbListElem);
        });
    });
}

function refreshTableList() {
    var tableListElem = $('#table-list')
    tableListElem.empty();
    $('#table-data').empty();
    Api.getTableList(currentDatabase, function (list) {
        list.forEach(function(table) {
            $('<a href="#" class="list-group-item"/>')
            .text(table)
            .click(function() {
                currentTable = table;
                refreshTableData();            
            })
            .appendTo(tableListElem);
        });
    });
}

function refreshTableData() {
    $('#table-data').empty();
    Api.getTableData(currentDatabase, currentTable, function (data) {
        displayTable(data, currentTable);
    })
}

function displayTable(data, tablename) {
    var elem = $('#table-data');
    elem.empty();
    var table = $('<table class="table"/>');
    var tableHead = $('<thead/>');
    var tableHeadRow = $('<tr/>');

    elem.append(table.append(tableHead.append(tableHeadRow)));
    data.columns.forEach(function (column) {
        tableHeadRow.append($('<th/>').text(column));
    });

    var tableBody =  $('<tbody/>');
    table.append(tableBody);
    data.rows.forEach(function (row) {
        var rowElem = $('<tr/>');
        tableBody.append(rowElem);
        row.forEach(function (value, index) {
            let origValue = value;
            if (data.blobs.indexOf(index) !== -1 && value) {
              value = 'blob: ' + value;
            }
            let cell = $('<td/>').append($('<span>').text(value ?? 'null'));
            if (value == null) {
              cell.addClass('is-null');
            } else if (value?.length > 200) {
              cell.addClass('is-long');
            }
            rowElem.append(cell);
            if (tablename && data.columns[0] === 'Z_PK') {
                // This is a CoreData helper
                cell.append($('<a>').addClass('edit-item').text('edit').attr('href', '#').on('click', function(e) {
                    $('#query').val('UPDATE '+tablename+' SET '+data.columns[index]+' = \''+escapeSqlite(origValue)+'\' WHERE '+data.columns[0]+' = \''+escapeSqlite(row[0])+'\'');
                    message('SQL updated');
                    e.preventDefault(true);
                    e.stopPropagation(true);
                    return false;
                }));
            }
        })
    });
}
function escapeSqlite(string) {
    return (''+string).replace(/'/g, '\'\'');
}

function executeQuery(query) {
    Api.executeQuery(currentDatabase, query, function (data) {
        if (data.hasOwnProperty('affected_rows')) {
            message(data.affected_rows + ' rows are affected.');
        } else {
            displayTable(data);
            message('Query completed.');
        }
    });
}

function download() {
    Api.downloadDatabase(currentDatabase, function() {
        message(currentDatabase + ' is downloaded.');
    });
}
$(document).ready(function () {
    init();
})
